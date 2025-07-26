import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

const TabContext = createContext();
export const useTabs = () => useContext(TabContext);

// Google search configuration

export const TabProvider = ({ children }) => {
  const settingsContext = useSettings();
  const settings = settingsContext?.settings || {};
  const [tabs, setTabs] = useState([]); // Start with empty tabs, wait for Electron
  const [activeTabId, setActiveTabId] = useState(null); // Start with null, wait for Electron
  const [searchQuery, setSearchQuery] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // Track if we've received initial state

  // Listen for Electron tab updates
  useEffect(() => {
    if (window.electronAPI) {
      const handleTabsUpdated = (data) => {
        console.log('🔄 Received tabs update from Electron:', data);
        
        if (data.tabs && Array.isArray(data.tabs)) {
          setTabs(data.tabs);
        }
        if (data.activeTabId) {
          setActiveTabId(data.activeTabId);
        }
        // Mark as initialized after first update
        setIsInitialized(true);
        console.log('✅ TabContext initialized with Electron state');
      };

      const handleReattachTab = (tabData) => {
        console.log('🔄 Received reattach tab event:', tabData);
        
        // Add the tab back to the tabs array
        setTabs((prevTabs) => {
          const newTabs = [...prevTabs, {
            id: tabData.id,
            title: tabData.title,
            url: tabData.url
          }];
          console.log('🔄 Added reattached tab:', newTabs);
          return newTabs;
        });
        
        // Set as active tab
        setActiveTabId(tabData.id);
      };

      window.electronAPI.onTabsUpdated(handleTabsUpdated);
      window.electronAPI.onReattachTab(handleReattachTab);
      
      // Listen for history updates from Electron
      if (window.electronAPI.onAddHistoryItem) {
        const handleAddHistoryItem = (data) => {
          console.log('📚 Received history item from Electron:', data);
          // Dispatch event for HistoryContext to listen to
          const historyEvent = new CustomEvent('addHistoryItem', { detail: data });
          document.dispatchEvent(historyEvent);
        };
        window.electronAPI.onAddHistoryItem(handleAddHistoryItem);
      }
      
      // Fallback: If Electron doesn't send initial state within 1 second, create default state
      const fallbackTimeout = setTimeout(() => {
        if (!isInitialized) {
          console.log('⚠️ Electron initialization timeout, creating fallback state');
          const fallbackTabId = Date.now();
          setTabs([{ id: fallbackTabId, title: "NoxX Browser", url: "noxx://homepage" }]);
          setActiveTabId(fallbackTabId);
          setIsInitialized(true);
        }
      }, 1000);
      
      // Cleanup
      return () => {
        clearTimeout(fallbackTimeout);
        // Note: Electron doesn't provide a way to remove listeners in preload
        // This is fine for our use case as the component will unmount
      };
    } else {
      console.log('⚠️ window.electronAPI not available, creating fallback state immediately');
      const fallbackTabId = Date.now();
      setTabs([{ id: fallbackTabId, title: "NoxX Browser", url: "noxx://homepage" }]);
      setActiveTabId(fallbackTabId);
      setIsInitialized(true);
    }
  }, []); // Empty dependency array to run only once

  const addTab = async (url = null) => {
    // New tabs should always go to Google (not NoxX homepage)
    const defaultUrl = url || "https://www.google.com";
    const newTab = {
      id: Date.now(),
      title: "New Tab",
      url: defaultUrl
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);

    // Create the BrowserView in Electron
    if (window.electronAPI) {
      try {
        console.log('⚡ Creating new tab in Electron with URL:', defaultUrl);
        await window.electronAPI.addTab(defaultUrl);
        console.log('✅ New tab created successfully in Electron');
      } catch (error) {
        console.error('❌ Failed to create tab in Electron:', error);
      }
    } else {
      console.warn('⚠️ window.electronAPI not available');
    }
  };

  const switchTab = async (id) => {
    setActiveTabId(id);
    
    // Switch the BrowserView in Electron
    if (window.electronAPI) {
      try {
        console.log('⚡ Switching to tab in Electron:', id);
        await window.electronAPI.switchTab(id);
        console.log('✅ Tab switched successfully in Electron');
      } catch (error) {
        console.error('❌ Failed to switch tab in Electron:', error);
      }
    } else {
      console.warn('⚠️ window.electronAPI not available');
    }
  };

  const closeTab = async (id) => {
    console.log('🚪 React: Closing tab:', id, 'Total tabs:', tabs.length);
    
    // Check if this is the last tab
    if (tabs.length === 1) {
      console.log('🚪 This is the last tab, closing application');
      // Close the BrowserView in Electron (which will close the app)
      if (window.electronAPI) {
        try {
          console.log('⚡ Closing last tab in Electron');
          await window.electronAPI.closeTab(id);
          console.log('✅ Last tab closed, app should shut down');
        } catch (error) {
          console.error('❌ Failed to close last tab in Electron:', error);
        }
      }
      // Don't update React state since the app will close
      return;
    }
    
    // Close the BrowserView in Electron first
    if (window.electronAPI) {
      try {
        console.log('⚡ Closing tab in Electron:', id);
        await window.electronAPI.closeTab(id);
        console.log('✅ Tab closed successfully in Electron');
      } catch (error) {
        console.error('❌ Failed to close tab in Electron:', error);
      }
    } else {
      console.warn('⚠️ window.electronAPI not available');
    }

    // Update React state only if not the last tab
    setTabs((prev) => {
      const updated = prev.filter((tab) => tab.id !== id);
      if (id === activeTabId && updated.length > 0) {
        setActiveTabId(updated[0].id);
      }
      return updated;
    });
  };

  const updateTabTitle = (id, title) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, title } : tab))
    );
  };

  // Check if input is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Check if input looks like a URL (has protocol or common TLDs)
  const looksLikeUrl = (input) => {
    // Simplified URL pattern - only detect obvious URLs
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlPattern.test(input) && input.includes('.') && input.length > 5;
  };

  // Convert search query to Google search URL
  const createSearchUrl = (query) => {
    const encodedQuery = encodeURIComponent(query);
    // Use Google search directly
    return `https://www.google.com/search?q=${encodedQuery}&safe=active`;
  };

  // Perform Google search
  const performSearch = async (query) => {
    // For now, just return the direct Google search URL as fallback
    return createSearchUrl(query);
  };

  // Update tab URL with smart URL/search detection
  const updateTabUrl = async (tabId, input) => {
    console.log('🚀 updateTabUrl called with:', tabId, input);
    console.log('🔍 Current activeTabId:', activeTabId);
    console.log('🔍 Current tabs:', tabs.map(t => ({ id: t.id, url: t.url, title: t.title })));
    
    let finalUrl = input.trim();
    
    // If it's already a valid URL, use it directly
    if (isValidUrl(finalUrl)) {
      console.log('🔗 Input is a valid URL:', finalUrl);
      // Ensure it has a protocol
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      // Clear any active search
      setSearchQuery(null);
    } else if (finalUrl.includes('.') && looksLikeUrl(finalUrl)) {
      console.log('🌐 Input looks like a URL:', finalUrl);
      // If it looks like a URL but isn't valid, add https://
      finalUrl = 'https://' + finalUrl;
      // Clear any active search
      setSearchQuery(null);
    } else {
      console.log('🔍 Input is a search query:', finalUrl);
      // Navigate directly to Google search results in the current tab
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
      console.log('🔍 Navigating to Google search:', searchUrl);
      finalUrl = searchUrl;
      // Clear any active search
      setSearchQuery(null);
    }

    console.log('🎯 Final URL:', finalUrl);

    setTabs((prev) =>
      prev.map((tab) => 
        tab.id === tabId 
          ? { ...tab, url: finalUrl, title: "Loading..." }
          : tab
      )
    );

    // Update the active tab in Electron
    if (window.electronAPI) {
      console.log('⚡ Updating tab in Electron with tabId:', tabId);
      try {
        await window.electronAPI.updateTabUrl(tabId, finalUrl);
        console.log('✅ Electron tab updated successfully');
      } catch (error) {
        console.error('❌ Failed to update tab URL in Electron:', error);
      }
    } else {
      console.warn('⚠️ window.electronAPI not available');
    }
  };

  // Navigation functions (these will need to be implemented in Electron)
  const goBack = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.goBack(activeTabId);
      } catch (error) {
        console.error('Failed to go back:', error);
      }
    }
  };

  const goForward = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.goForward(activeTabId);
      } catch (error) {
        console.error('Failed to go forward:', error);
      }
    }
  };

  const refreshPage = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.refreshPage(activeTabId);
      } catch (error) {
        console.error('Failed to refresh page:', error);
      }
    }
  };

  const handleSearchResultClick = async (url) => {
    // Clear search query
    setSearchQuery(null);
    // Navigate to the clicked URL
    await updateTabUrl(activeTabId, url);
  };

  const reorderTabs = (oldIndex, newIndex) => {
    console.log('🔄 Reordering tabs from index', oldIndex, 'to', newIndex);
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      const [movedTab] = newTabs.splice(oldIndex, 1);
      newTabs.splice(newIndex, 0, movedTab);
      console.log('🔄 New tab order:', newTabs.map(t => ({ id: t.id, title: t.title })));
      return newTabs;
    });
  };

  const detachTab = async (tabId) => {
    console.log('🔗 Detaching tab:', tabId);
    const tabToDetach = tabs.find(tab => tab.id === tabId);
    
    if (!tabToDetach) {
      console.error('❌ Tab not found for detaching:', tabId);
      return;
    }

    // Don't allow detaching the homepage tab
    if (tabToDetach.url === 'noxx://homepage') {
      console.log('⚠️ Cannot detach homepage tab');
      return;
    }

    // Remove the tab from React state immediately
    const remainingTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(remainingTabs);
    
    // If this was the active tab, switch to another tab
    if (activeTabId === tabId) {
      if (remainingTabs.length > 0) {
        console.log('🔄 Switching to remaining tab:', remainingTabs[0].id);
        setActiveTabId(remainingTabs[0].id);
      }
    }

    // Create new window in Electron
    if (window.electronAPI) {
      try {
        console.log('⚡ Creating new window for detached tab:', tabToDetach);
        await window.electronAPI.detachTab(tabId, tabToDetach.url);
        console.log('✅ Tab detached successfully');
      } catch (error) {
        console.error('❌ Failed to detach tab:', error);
        // If detaching failed, restore the tab
        setTabs([...remainingTabs, tabToDetach]);
        if (activeTabId === tabId) {
          setActiveTabId(tabId);
        }
      }
    } else {
      console.warn('⚠️ window.electronAPI not available for detaching');
    }
  };

  return (
    <TabContext.Provider
      value={{ 
        tabs, 
        activeTabId, 
        addTab, 
        switchTab, 
        closeTab, 
        updateTabTitle,
        updateTabUrl,
        goBack,
        goForward,
        refreshPage,
        searchQuery,
        handleSearchResultClick,
        reorderTabs,
        detachTab
      }}
    >
      {children}
    </TabContext.Provider>
  );
}; 