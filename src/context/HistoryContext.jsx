import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();
export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    saveHistory();
  }, [history]);

  // Listen for history updates from Electron
  useEffect(() => {
    const handleAddHistoryItem = (event) => {
      const { url, title, tabId, favicon } = event.detail;
      addHistoryItem(url, title, tabId, favicon);
    };

    document.addEventListener('addHistoryItem', handleAddHistoryItem);
    return () => {
      document.removeEventListener('addHistoryItem', handleAddHistoryItem);
    };
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('noxx-browser-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } else {
        // Add sample history data for demonstration
        const sampleHistory = [
          {
            id: '1',
            url: 'https://github.com',
            title: 'GitHub: Let\'s build from here',
            tabId: 'sample-tab-1',
            favicon: 'https://github.com/favicon.ico',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            visitCount: 3,
            lastVisit: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
          },
          {
            id: '2',
            url: 'https://stackoverflow.com',
            title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
            tabId: 'sample-tab-2',
            favicon: 'https://stackoverflow.com/favicon.ico',
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            visitCount: 2,
            lastVisit: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          },
          {
            id: '3',
            url: 'https://developer.mozilla.org',
            title: 'MDN Web Docs',
            tabId: 'sample-tab-3',
            favicon: 'https://developer.mozilla.org/favicon.ico',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            visitCount: 5,
            lastVisit: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
          },
          {
            id: '4',
            url: 'https://react.dev',
            title: 'React – A JavaScript library for building user interfaces',
            tabId: 'sample-tab-4',
            favicon: 'https://react.dev/favicon.ico',
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            visitCount: 1,
            lastVisit: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          }
        ];
        setHistory(sampleHistory);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const saveHistory = () => {
    try {
      localStorage.setItem('noxx-browser-history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const addHistoryItem = (url, title, tabId, favicon = null) => {
    // Don't add internal pages or empty URLs
    if (!url || url.startsWith('noxx://') || url.startsWith('chrome://')) {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      url,
      title: title || url,
      tabId,
      favicon,
      timestamp: new Date().toISOString(),
      visitCount: 1,
      lastVisit: new Date().toISOString()
    };

    // Check if URL already exists in history
    const existingIndex = history.findIndex(item => item.url === url);
    
    if (existingIndex !== -1) {
      // Update existing item
      const updatedHistory = [...history];
      updatedHistory[existingIndex] = {
        ...updatedHistory[existingIndex],
        visitCount: updatedHistory[existingIndex].visitCount + 1,
        lastVisit: new Date().toISOString(),
        title: title || updatedHistory[existingIndex].title,
        favicon: favicon || updatedHistory[existingIndex].favicon
      };
      setHistory(updatedHistory);
    } else {
      // Add new item
      setHistory(prev => [newItem, ...prev]);
    }
  };

  const removeHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const removeHistoryItems = (ids) => {
    setHistory(prev => prev.filter(item => !ids.includes(item.id)));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const clearHistoryByDate = (startDate, endDate) => {
    setHistory(prev => prev.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate < startDate || itemDate > endDate;
    }));
  };

  const searchHistory = (query) => {
    if (!query) return history;
    
    const lowercaseQuery = query.toLowerCase();
    return history.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.url.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getHistoryByDateRange = (startDate, endDate) => {
    return history.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const getHistoryByTab = (tabId) => {
    return history.filter(item => item.tabId === tabId);
  };

  const getMostVisitedSites = (limit = 10) => {
    return history
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, limit);
  };

  const getRecentlyVisitedSites = (limit = 10) => {
    return history
      .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
      .slice(0, limit);
  };

  const getHistoryStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), now.getMonth(), 1);

    return {
      total: history.length,
      today: getHistoryByDateRange(today, now).length,
      yesterday: getHistoryByDateRange(yesterday, today).length,
      thisWeek: getHistoryByDateRange(thisWeek, now).length,
      thisMonth: getHistoryByDateRange(thisMonth, now).length,
      totalVisits: history.reduce((sum, item) => sum + item.visitCount, 0),
      uniqueSites: new Set(history.map(item => new URL(item.url).hostname)).size
    };
  };

  const exportHistory = (format = 'json') => {
    const stats = getHistoryStats();
    const exportData = {
      exportDate: new Date().toISOString(),
      stats,
      history
    };

    if (format === 'json') {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `noxx-browser-history-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvContent = [
        ['Title', 'URL', 'Visit Count', 'First Visit', 'Last Visit', 'Tab ID'],
        ...history.map(item => [
          `"${item.title}"`,
          `"${item.url}"`,
          item.visitCount,
          item.timestamp,
          item.lastVisit,
          item.tabId
        ])
      ].map(row => row.join(',')).join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `noxx-browser-history-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const importHistory = (data) => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsedData.history && Array.isArray(parsedData.history)) {
        setHistory(prev => [...prev, ...parsedData.history]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  };

  const getDomainStats = () => {
    const domainMap = {};
    history.forEach(item => {
      const domain = new URL(item.url).hostname;
      if (!domainMap[domain]) {
        domainMap[domain] = {
          domain,
          visitCount: 0,
          lastVisit: null,
          titles: new Set()
        };
      }
      domainMap[domain].visitCount += item.visitCount;
      domainMap[domain].titles.add(item.title);
      if (!domainMap[domain].lastVisit || new Date(item.lastVisit) > new Date(domainMap[domain].lastVisit)) {
        domainMap[domain].lastVisit = item.lastVisit;
      }
    });

    return Object.values(domainMap).map(domain => ({
      ...domain,
      titles: Array.from(domain.titles)
    })).sort((a, b) => b.visitCount - a.visitCount);
  };

  const value = {
    history,
    isLoading,
    addHistoryItem,
    removeHistoryItem,
    removeHistoryItems,
    clearHistory,
    clearHistoryByDate,
    searchHistory,
    getHistoryByDateRange,
    getHistoryByTab,
    getMostVisitedSites,
    getRecentlyVisitedSites,
    getHistoryStats,
    getDomainStats,
    exportHistory,
    importHistory
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}; 