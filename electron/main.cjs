const { app, BrowserWindow, BrowserView, ipcMain, session } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const os = require('os');
const si = require('systeminformation');

// Global variables
let mainWindow;
let tabViews = {};
let activeTabId = null;
let homepageTabId = null; // Track the NoxX homepage tab ID separately
let performanceInterval = null;
let prevCpuInfo = os.cpus();

// Store permissions in memory for now (could be persisted)
let sitePermissions = {};

// Add navigation history tracking
let navigationHistory = {};
let forwardHistory = {}; // Track forward history for each tab
let detachedWindows = {}; // Track detached windows

function getTabsMetadata() {
  const browserViewTabs = Object.entries(tabViews).map(([id, view]) => ({
    id,
    title: view.webContents.getTitle() || 'New Tab',
    url: view.webContents.getURL() || '',
  }));
  
  // Always include the NoxX homepage tab if we have a homepageTabId
  if (homepageTabId) {
    const homepageTab = {
      id: homepageTabId,
      title: "NoxX Browser",
      url: "noxx://homepage"
    };
    
    // If there are no BrowserViews, just return the homepage
    if (browserViewTabs.length === 0) {
      return [homepageTab];
    }
    
    // If there are BrowserViews, check if the homepage is already included
    const homepageExists = browserViewTabs.some(tab => tab.id === homepageTabId);
    if (!homepageExists) {
      // Add the homepage tab to the beginning
      return [homepageTab, ...browserViewTabs];
    }
  }
  
  return browserViewTabs;
}

function sendTabsUpdate() {
  console.log('📤 Sending tabs update to React...');
  console.log('📊 Current tabs:', getTabsMetadata());
  console.log('🎯 Active tab ID:', activeTabId);
  
  if (mainWindow && mainWindow.webContents) {
    const updateData = {
      tabs: getTabsMetadata(),
      activeTabId,
    };
    console.log('📤 Sending data:', updateData);
    mainWindow.webContents.send('tabs-updated', updateData);
  } else {
    console.log('⚠️ Cannot send tabs update - mainWindow or webContents not ready');
  }
}

function getCpuUsage(prev, curr) {
  let totalIdle = 0, totalTick = 0;
  for (let i = 0; i < curr.length; i++) {
    const prevTimes = prev[i].times;
    const currTimes = curr[i].times;
    const idle = currTimes.idle - prevTimes.idle;
    const total = Object.keys(currTimes).reduce((acc, key) => acc + (currTimes[key] - prevTimes[key]), 0);
    totalIdle += idle;
    totalTick += total;
  }
  return 100 - (100 * totalIdle / totalTick);
}

function startPerformanceMonitor() {
  if (performanceInterval) clearInterval(performanceInterval);
  prevCpuInfo = os.cpus();
  performanceInterval = setInterval(async () => {
    const currCpuInfo = os.cpus();
    const cpuLoad = getCpuUsage(prevCpuInfo, currCpuInfo);
    prevCpuInfo = currCpuInfo;

    // Use systeminformation for memory stats
    const mem = await si.mem();
    const memPercent = (mem.used / mem.total) * 100;

    // App memory usage
    const appMem = process.memoryUsage();

    // Aggregate memory for all Electron processes
    let totalElectronMemory = 0;
    try {
      const procList = await si.processes();
      const electronProcs = procList.list.filter(p => p.name && p.name.toLowerCase().includes('electron'));
      totalElectronMemory = electronProcs.reduce((sum, p) => sum + (p.memRss || 0), 0);
    } catch (e) {
      // fallback: just use appMem.rss
      totalElectronMemory = appMem.rss;
    }

    // Network (still placeholder)
    const network = { download: 0, upload: 0, latency: 0 };
    const browser = { tabs: Object.keys(tabViews).length, extensions: 0, cache: 0 };
    const fps = 60;
    const loadTime = Math.random() * 2000 + 100;

    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('performance-data', {
        cpu: { usage: cpuLoad, cores: currCpuInfo.length },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          available: mem.available,
          percentage: memPercent
        },
        appMemory: appMem,
        totalElectronMemory,
        network,
        browser,
        fps,
        loadTime,
        timestamp: Date.now(),
      });
    }
  }, 1000);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: isDev ? false : true, // Disable web security in development for CSE
      preload: path.join(__dirname, 'preload.cjs'),
      allowRunningInsecureContent: isDev ? true : false, // Allow insecure content in development
      experimentalFeatures: false
    },
    titleBarStyle: 'hiddenInset',
    show: false,
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'NoxX Browser',
  });

  if (isDev) {
    // Wait for dev server to be ready
    const waitForDevServer = async () => {
      const ports = [5173, 5174, 5175, 5176, 5177, 3000];
      for (const port of ports) {
        try {
          const response = await fetch(`http://localhost:${port}`);
          if (response.ok) {
            await mainWindow.loadURL(`http://localhost:${port}`);
            console.log(`Connected to dev server on port ${port}`);
            return;
          }
        } catch (error) {
          // Port not available, continue to next
          continue;
        }
      }
      // If no port works, try loading anyway (might be starting up)
      try {
        await mainWindow.loadURL('http://localhost:5173');
        console.log('Connected to dev server on port 5173');
      } catch (error) {
        console.log('Dev server not ready, retrying in 2 seconds...');
        setTimeout(waitForDevServer, 2000);
      }
    };
    waitForDevServer();
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  startPerformanceMonitor();
  
  // Create initial NoxX homepage tab (no BrowserView needed)
  const initialTabId = Date.now().toString();
  activeTabId = initialTabId;
  homepageTabId = initialTabId; // Initialize homepageTabId
  
  console.log('🏠 Initializing NoxX homepage tab with ID:', initialTabId);
  
  // Initialize navigation history for homepage
  navigationHistory[initialTabId] = ['noxx://homepage'];
  
  // Initialize forward history for homepage
  forwardHistory[initialTabId] = [];
  
  // Send initial tabs update to React
  setTimeout(() => {
    console.log('⏰ Sending initial tabs update after timeout...');
    sendTabsUpdate();
  }, 500); // Increased timeout to ensure React is ready
  
  session.defaultSession.setPermissionRequestHandler((wc, permission, callback, details) => {
    const url = new URL(details.requestingUrl || wc.getURL());
    const site = url.hostname;
    if (!sitePermissions[site]) sitePermissions[site] = {};
    // Default: prompt if not set, else use stored
    if (sitePermissions[site][permission]) {
      callback(sitePermissions[site][permission] === 'granted');
    } else {
      callback(false); // default deny, or could prompt
    }
  });
});

ipcMain.handle('add-tab', (event, url) => {
  const id = Date.now().toString();
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });
  tabViews[id] = view;
  
  // Position the BrowserView within the content area
  const contentArea = {
    x: 8,  // Small margin from left
    y: 120, // Below navbar and tabs
    width: 1264, // Full width minus margins
    height: 680  // Full height minus margins and navbar
  };
  
  view.setBounds(contentArea);
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadURL(url || 'https://www.google.com');
  mainWindow.setBrowserView(view);
  activeTabId = id;
  
  // Initialize navigation history for new tab
  navigationHistory[id] = [url || 'https://www.google.com'];
  
  // Initialize forward history for new tab
  forwardHistory[id] = [];
  
  sendTabsUpdate();
  // Listen for title/url changes to update tab metadata
  view.webContents.on('page-title-updated', sendTabsUpdate);
  view.webContents.on('did-navigate', sendTabsUpdate);
  view.webContents.on('did-navigate-in-page', sendTabsUpdate);
  
  // Listen for page load completion to add to history
  view.webContents.on('did-finish-load', () => {
    const url = view.webContents.getURL();
    const title = view.webContents.getTitle();
    
    // Don't add internal pages to history
    if (url && !url.startsWith('noxx://') && !url.startsWith('chrome://')) {
      console.log('📚 Adding to history:', { url, title, tabId: id });
      // Send history update to React
      mainWindow.webContents.send('add-history-item', {
        url,
        title,
        tabId: id,
        favicon: null // Could be enhanced to get favicon
      });
    }
  });
  return id;
});

ipcMain.handle('switch-tab', (event, id) => {
  console.log('🔄 Switching to tab:', id);
  console.log('📚 Navigation history for tab', id, ':', navigationHistory[id]);
  
  if (tabViews[id]) {
    // Switch to a tab with a BrowserView
    mainWindow.setBrowserView(tabViews[id]);
    activeTabId = id;
    sendTabsUpdate();
  } else if (id === homepageTabId) {
    // Switch to the NoxX homepage tab (no BrowserView)
    mainWindow.setBrowserView(null);
    activeTabId = id;
    sendTabsUpdate();
  }
});

ipcMain.handle('close-tab', (event, id) => {
  console.log('🚪 Closing tab:', id, 'Current tabViews:', Object.keys(tabViews));
  
  // Check if this is the homepage tab
  if (id === homepageTabId) {
    console.log('🚪 Closing NoxX homepage tab');
    // If there are no other tabs, close the application
    if (Object.keys(tabViews).length === 0) {
      console.log('🚪 All tabs closed, shutting down NoxX Browser');
      mainWindow.setBrowserView(null);
      setTimeout(() => {
        app.exit(0);
      }, 100);
      return;
    }
    // If there are other tabs, switch to the first one
    const remainingIds = Object.keys(tabViews);
    mainWindow.setBrowserView(tabViews[remainingIds[0]]);
    activeTabId = remainingIds[0];
    sendTabsUpdate();
    return;
  }
  
  // Remove the tab from tabViews if it exists
  if (tabViews[id]) {
    try {
      tabViews[id].destroy();
      console.log('✅ BrowserView destroyed successfully');
    } catch (error) {
      console.log('⚠️ Error destroying BrowserView:', error);
    }
    delete tabViews[id];
  }
  
  const remainingIds = Object.keys(tabViews);
  console.log('📊 Remaining tabs after close:', remainingIds);
  
  if (remainingIds.length > 0) {
    // Switch to the first remaining tab
    mainWindow.setBrowserView(tabViews[remainingIds[0]]);
    activeTabId = remainingIds[0];
    sendTabsUpdate();
  } else {
    // No more tabs with BrowserViews, switch to homepage
    console.log('📊 No more web tabs, switching to NoxX homepage');
    mainWindow.setBrowserView(null);
    activeTabId = homepageTabId;
    sendTabsUpdate();
  }
});

ipcMain.handle('get-system-info', async () => {
  const os = require('os');
  const mem = await si.mem();
  const cpu = await si.cpu();
  const osInfo = await si.osInfo();
  const net = await si.networkInterfaces();
  return {
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    hostname: os.hostname(),
    totalmem: mem.total,
    freemem: mem.free,
    availablemem: mem.available,
    cpus: os.cpus(),
    cpuModel: cpu.manufacturer + ' ' + cpu.brand,
    cpuCores: cpu.cores,
    osDistro: osInfo.distro,
    osVersion: osInfo.version,
    osBuild: osInfo.build,
    network: net,
    uptime: os.uptime(),
    userInfo: os.userInfo(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    screen: {
      width: typeof screen !== 'undefined' ? screen.width : null,
      height: typeof screen !== 'undefined' ? screen.height : null,
      colorDepth: typeof screen !== 'undefined' ? screen.colorDepth : null
    }
  };
});

// IPC: Get all permissions for all sites
ipcMain.handle('get-site-permissions', () => {
  return sitePermissions;
});

// IPC: Set a permission for a site
ipcMain.handle('set-site-permission', (event, { site, permission, status }) => {
  if (!sitePermissions[site]) sitePermissions[site] = {};
  sitePermissions[site][permission] = status;
  return true;
});

// IPC: Remove all permissions for a site
ipcMain.handle('remove-site-permissions', (event, site) => {
  delete sitePermissions[site];
  return true;
});

// IPC: Clear all permissions
ipcMain.handle('clear-all-permissions', () => {
  sitePermissions = {};
  return true;
});

// Navigation IPC handlers
ipcMain.handle('update-tab-url', (event, tabId, url) => {
  console.log('🔄 update-tab-url called with:', tabId, url);
  
  // Clear forward history when navigating to a new URL
  if (forwardHistory[tabId]) {
    forwardHistory[tabId] = [];
    console.log('🧹 Cleared forward history for tab', tabId);
  }
  
  // Don't create BrowserView for NoxX homepage
  if (url === 'noxx://homepage') {
    if (tabViews[tabId]) {
      try {
        tabViews[tabId].destroy();
        console.log('✅ BrowserView destroyed for homepage switch');
      } catch (error) {
        console.log('⚠️ Error destroying BrowserView for homepage:', error);
      }
      delete tabViews[tabId];
      mainWindow.setBrowserView(null);
    }
    // Add to navigation history
    if (!navigationHistory[tabId]) {
      navigationHistory[tabId] = [];
    }
    navigationHistory[tabId].push(url);
    console.log('📚 Updated navigation history for tab', tabId, ':', navigationHistory[tabId]);
    sendTabsUpdate();
    return true;
  }

  // Create BrowserView if it doesn't exist
  if (!tabViews[tabId]) {
    const view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
        allowRunningInsecureContent: false
      }
    });
    tabViews[tabId] = view;
    
    // Position the BrowserView within the content area (below the navbar and tabs)
    // Adjust these values to match your NoxX browser layout
    const contentArea = {
      x: 8,  // Small margin from left
      y: 120, // Below navbar and tabs
      width: 1264, // Full width minus margins
      height: 680  // Full height minus margins and navbar
    };
    
    view.setBounds(contentArea);
    view.setAutoResize({ width: true, height: true });
    
    view.webContents.on('page-title-updated', sendTabsUpdate);
    view.webContents.on('did-navigate', sendTabsUpdate);
    view.webContents.on('did-navigate-in-page', sendTabsUpdate);
  }

  // Add to navigation history
  if (!navigationHistory[tabId]) {
    navigationHistory[tabId] = [];
  }
  navigationHistory[tabId].push(url);
  console.log('📚 Updated navigation history for tab', tabId, ':', navigationHistory[tabId]);

  tabViews[tabId].webContents.loadURL(url);
  mainWindow.setBrowserView(tabViews[tabId]);
  sendTabsUpdate();
  return true;
});

ipcMain.handle('go-back', (event, tabId) => {
  console.log('🔙 Going back for tab:', tabId);
  console.log('📚 Current navigation history for tab', tabId, ':', navigationHistory[tabId]);
  
  if (tabViews[tabId]) {
    // Check if we can go back within the BrowserView
    try {
      if (tabViews[tabId].webContents.canGoBack()) {
        console.log('🔙 Using BrowserView back navigation');
        tabViews[tabId].webContents.goBack();
        sendTabsUpdate();
        return true;
      }
    } catch (error) {
      console.log('⚠️ BrowserView navigation failed:', error);
    }
  }
  
  // If we can't go back within the BrowserView, check our navigation history
  if (navigationHistory[tabId] && navigationHistory[tabId].length > 1) {
    // Get current URL before going back
    let currentUrl = 'noxx://homepage';
    if (tabViews[tabId]) {
      try {
        currentUrl = tabViews[tabId].webContents.getURL();
      } catch (error) {
        console.log('⚠️ Error getting current URL:', error);
      }
    }
    
    // Remove current URL from history
    navigationHistory[tabId].pop();
    const previousUrl = navigationHistory[tabId][navigationHistory[tabId].length - 1];
    
    console.log('🔙 Going back to:', previousUrl);
    console.log('📚 Updated navigation history:', navigationHistory[tabId]);
    
    // Save current URL to forward history
    if (!forwardHistory[tabId]) {
      forwardHistory[tabId] = [];
    }
    forwardHistory[tabId].push(currentUrl);
    console.log('🔜 Added to forward history:', forwardHistory[tabId]);
    
    if (previousUrl === 'noxx://homepage') {
      // Switch to homepage
      if (tabViews[tabId]) {
        try {
          tabViews[tabId].destroy();
        } catch (error) {
          console.log('⚠️ Error destroying BrowserView:', error);
        }
        delete tabViews[tabId];
      }
      mainWindow.setBrowserView(null);
      activeTabId = homepageTabId;
      sendTabsUpdate();
    } else {
      // Navigate to previous web URL
      try {
        tabViews[tabId].webContents.loadURL(previousUrl);
        sendTabsUpdate();
      } catch (error) {
        console.log('⚠️ Error loading previous URL:', error);
      }
    }
    return true;
  }
  
  console.log('⚠️ Cannot go back - no history available');
  console.log('📚 Navigation history for tab', tabId, ':', navigationHistory[tabId]);
  return false;
});

ipcMain.handle('go-forward', (event, tabId) => {
  console.log('🔜 Going forward for tab:', tabId);
  console.log('🔜 Forward history for tab', tabId, ':', forwardHistory[tabId]);
  
  if (tabViews[tabId]) {
    // Check if we can go forward within the BrowserView
    try {
      if (tabViews[tabId].webContents.canGoForward()) {
        console.log('🔜 Using BrowserView forward navigation');
        tabViews[tabId].webContents.goForward();
        sendTabsUpdate();
        return true;
      }
    } catch (error) {
      console.log('⚠️ BrowserView forward navigation failed:', error);
    }
  }
  
  // Check our forward history
  if (forwardHistory[tabId] && forwardHistory[tabId].length > 0) {
    const nextUrl = forwardHistory[tabId].pop();
    console.log('🔜 Going forward to:', nextUrl);
    console.log('🔜 Updated forward history:', forwardHistory[tabId]);
    
    // Add the URL back to navigation history
    if (!navigationHistory[tabId]) {
      navigationHistory[tabId] = [];
    }
    navigationHistory[tabId].push(nextUrl);
    console.log('📚 Updated navigation history:', navigationHistory[tabId]);
    
    if (nextUrl === 'noxx://homepage') {
      // Switch to homepage
      if (tabViews[tabId]) {
        try {
          tabViews[tabId].destroy();
        } catch (error) {
          console.log('⚠️ Error destroying BrowserView:', error);
        }
        delete tabViews[tabId];
      }
      mainWindow.setBrowserView(null);
      activeTabId = homepageTabId;
      sendTabsUpdate();
    } else {
      // Navigate to the forward URL
      if (!tabViews[tabId]) {
        // Create BrowserView if it doesn't exist
        const view = new BrowserView({
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true,
            allowRunningInsecureContent: false
          }
        });
        tabViews[tabId] = view;
        
        const contentArea = {
          x: 8,
          y: 120,
          width: 1264,
          height: 680
        };
        
        view.setBounds(contentArea);
        view.setAutoResize({ width: true, height: true });
        
        view.webContents.on('page-title-updated', sendTabsUpdate);
        view.webContents.on('did-navigate', sendTabsUpdate);
        view.webContents.on('did-navigate-in-page', sendTabsUpdate);
      }
      
      try {
        tabViews[tabId].webContents.loadURL(nextUrl);
        mainWindow.setBrowserView(tabViews[tabId]);
        sendTabsUpdate();
      } catch (error) {
        console.log('⚠️ Error loading forward URL:', error);
      }
    }
    return true;
  }
  
  console.log('⚠️ Cannot go forward - no forward history available');
  return false;
});

ipcMain.handle('refresh-page', (event, tabId) => {
  console.log('🔄 Refreshing page for tab:', tabId);
  if (tabViews[tabId]) {
    try {
      tabViews[tabId].webContents.reload();
      sendTabsUpdate();
      return true;
    } catch (error) {
      console.log('⚠️ Error refreshing page:', error);
      return false;
    }
  }
  return false;
});

ipcMain.handle('detach-tab', (event, tabId, url) => {
  console.log('🔗 Detaching tab:', tabId, 'with URL:', url);
  
  // Get the current window's position and size for the new window
  const currentBounds = mainWindow.getBounds();
  
  // Create a new window for the detached tab
  const newWindow = new BrowserWindow({
    width: currentBounds.width,
    height: currentBounds.height,
    x: currentBounds.x + 50, // Offset slightly from original window
    y: currentBounds.y + 50,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
      allowRunningInsecureContent: isDev ? true : false,
      experimentalFeatures: false
    },
    titleBarStyle: 'hiddenInset',
    show: false,
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'NoxX Browser - Detached Tab',
  });

  // Create a BrowserView for the detached tab
  const detachedView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  // Position the BrowserView to fill the entire window (no navbar/tabs)
  const contentArea = {
    x: 0,
    y: 0,
    width: currentBounds.width,
    height: currentBounds.height
  };
  
  detachedView.setBounds(contentArea);
  detachedView.setAutoResize({ width: true, height: true });
  newWindow.setBrowserView(detachedView);

  // Load the URL
  console.log('🔗 Loading URL in detached window:', url);
  detachedView.webContents.loadURL(url).then(() => {
    console.log('✅ URL loaded successfully in detached window');
  }).catch((error) => {
    console.error('❌ Failed to load URL in detached window:', error);
  });

  // Show the window when ready
  newWindow.once('ready-to-show', () => {
    console.log('🔗 Detached window ready to show');
    newWindow.show();
    console.log('✅ Detached window shown');
  });

  // Also show window after a timeout as fallback
  setTimeout(() => {
    if (!newWindow.isVisible()) {
      console.log('🔗 Showing detached window after timeout fallback');
      newWindow.show();
    }
  }, 2000);

  // Handle window close
  newWindow.on('closed', () => {
    console.log('🔗 Detached window closed');
  });

  // Handle window resize
  newWindow.on('resize', () => {
    const bounds = newWindow.getBounds();
    detachedView.setBounds({
      x: 0,
      y: 0,
      width: bounds.width,
      height: bounds.height
    });
  });

  // Remove the tab from the original window's tabViews
  if (tabViews[tabId]) {
    try {
      mainWindow.removeBrowserView(tabViews[tabId]);
      tabViews[tabId].webContents.destroy();
      delete tabViews[tabId];
      console.log('✅ Original tab view destroyed');
    } catch (error) {
      console.log('⚠️ Error destroying original tab view:', error);
    }
  }

  // Add to detachedWindows tracking
  detachedWindows[tabId] = {
    window: newWindow,
    view: detachedView,
    url: url,
    tabData: { id: tabId, url: url, title: 'Detached Tab' }
  };

  // Handle detached window close
  newWindow.on('closed', () => {
    console.log('🔗 Detached window closed for tab:', tabId);
    delete detachedWindows[tabId];
  });

  // The React frontend will handle tab removal from the UI
  // We just need to update the tabs to reflect the change
  sendTabsUpdate();
  
  console.log('✅ Tab detached to new window successfully');
  return true;
});

ipcMain.handle('reattach-tab', (event, tabData) => {
  console.log('🔄 Reattaching tab:', tabData);
  const detached = detachedWindows[tabData.id];
  if (!detached) {
    console.log('⚠️ No detached window found for tab:', tabData.id);
    return false;
  }

  // Create a new BrowserView for the main window
  const newView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  // Position the BrowserView in the main window
  const contentArea = {
    x: 8,
    y: 120,
    width: 1264,
    height: 680
  };
  
  newView.setBounds(contentArea);
  newView.setAutoResize({ width: true, height: true });
  newView.webContents.loadURL(tabData.url);

  // Add to tabViews
  tabViews[tabData.id] = newView;
  
  // Set as active tab
  activeTabId = tabData.id;
  mainWindow.setBrowserView(newView);

  // Close the detached window
  detached.window.close();
  delete detachedWindows[tabData.id];

  // Notify React to add the tab back
  mainWindow.webContents.send('reattach-tab', tabData);
  
  console.log('✅ Tab reattached to main window successfully');
  return true;
});

ipcMain.handle('get-cursor-position', () => {
  const point = screen.getCursorScreenPoint();
  return { x: point.x, y: point.y };
});

// Clean up polling on window close
app.on('before-quit', () => {
  if (performanceInterval) {
    clearInterval(performanceInterval);
    performanceInterval = null;
  }
});

app.on('window-all-closed', () => {
  if (performanceInterval) clearInterval(performanceInterval);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
}); 