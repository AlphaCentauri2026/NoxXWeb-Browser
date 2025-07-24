const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  addTab: (url) => ipcRenderer.invoke('add-tab', url),
  switchTab: (id) => ipcRenderer.invoke('switch-tab', id),
  closeTab: (id) => ipcRenderer.invoke('close-tab', id),
  onTabsUpdated: (callback) => ipcRenderer.on('tabs-updated', (event, data) => callback(data)),
  onPerformanceData: (callback) => ipcRenderer.on('performance-data', (event, data) => callback(data)),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  // Permissions
  getSitePermissions: () => ipcRenderer.invoke('get-site-permissions'),
  setSitePermission: (site, permission, status) => ipcRenderer.invoke('set-site-permission', { site, permission, status }),
  removeSitePermissions: (site) => ipcRenderer.invoke('remove-site-permissions', site),
  clearAllPermissions: () => ipcRenderer.invoke('clear-all-permissions'),
  // Navigation
  updateTabUrl: (tabId, url) => ipcRenderer.invoke('update-tab-url', tabId, url),
  goBack: (tabId) => ipcRenderer.invoke('go-back', tabId),
  goForward: (tabId) => ipcRenderer.invoke('go-forward', tabId),
  refreshPage: (tabId) => ipcRenderer.invoke('refresh-page', tabId),
  // Tab Management
  detachTab: (tabId, url) => ipcRenderer.invoke('detach-tab', tabId, url),
  reattachTab: (tabData) => ipcRenderer.invoke('reattach-tab', tabData),
  onReattachTab: (callback) => ipcRenderer.on('reattach-tab', (event, data) => callback(data)),
}); 