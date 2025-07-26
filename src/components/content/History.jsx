import React, { useState, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import { useHistory } from '../../context/HistoryContext';
import GlassPanel from '../settings/GlassPanel';

const History = () => {
  const { tabs, activeTabId, updateTabUrl } = useTabs();
  const { 
    history, 
    searchHistory, 
    removeHistoryItem, 
    removeHistoryItems, 
    clearHistory, 
    exportHistory,
    getHistoryStats,
    getDomainStats
  } = useHistory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('global'); // 'global' or 'tab'
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const getDateCategory = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInDays = Math.floor((now - time) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return 'this-week';
    if (diffInDays < 30) return 'this-month';
    return 'older';
  };

  const deleteHistoryItem = (id) => {
    removeHistoryItem(id);
  };

  const deleteSelectedItems = () => {
    removeHistoryItems(selectedItems);
    setSelectedItems([]);
  };

  const clearAllHistory = () => {
    clearHistory();
    setSelectedItems([]);
  };

  const handleExportHistory = (format = 'json') => {
    exportHistory(format);
  };

  const navigateToHistoryItem = (url) => {
    updateTabUrl(activeTabId, url);
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const filteredIds = filteredHistory.map(item => item.id);
    setSelectedItems(filteredIds);
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  // Filter history based on search, filter, date, and view mode
  const filteredHistory = searchHistory(searchTerm).filter(item => {
    const matchesFilter = activeFilter === 'all' || item.tabId === activeFilter;
    const matchesDate = dateFilter === 'all' || getDateCategory(item.timestamp) === dateFilter;
    const matchesView = viewMode === 'global' || item.tabId === activeTabId;
    
    return matchesFilter && matchesDate && matchesView;
  });

  const stats = getHistoryStats();

  const dateFilters = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'this-week', label: 'This Week' },
    { key: 'this-month', label: 'This Month' },
    { key: 'older', label: 'Older' }
  ];

  return (
    <GlassPanel className="w-full max-w-6xl mx-auto p-6 shadow-2xl">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <span>📜</span>
          <span>Browsing History</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={exportHistory}
            className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
          >
            📤 Export
          </button>
          <button
            onClick={clearAllHistory}
            className="px-4 py-2 bg-red-400/20 border border-red-400/30 rounded-lg text-red-200 hover:bg-red-400/30 transition-all duration-200"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-sm text-white/70">Total</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.today}</div>
          <div className="text-sm text-white/70">Today</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.thisWeek}</div>
          <div className="text-sm text-white/70">This Week</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.thisMonth}</div>
          <div className="text-sm text-white/70">This Month</div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-1 p-1 bg-white/10 rounded-lg">
          <button
            onClick={() => setViewMode('global')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${
              viewMode === 'global'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🌍 Global History
          </button>
          <button
            onClick={() => setViewMode('tab')}
            className={`flex-1 px-4 py-2 rounded-md transition-all duration-200 ${
              viewMode === 'tab'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            📑 Current Tab History
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">🔍</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">All Tabs</option>
            {tabs.map(tab => (
              <option key={tab.id} value={tab.id} className="bg-gray-800">
                {tab.title || 'Untitled'}
              </option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            {dateFilters.map(filter => (
              <option key={filter.key} value={filter.key} className="bg-gray-800">
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selection Controls */}
      {selectedItems.length > 0 && (
        <div className="mb-6 p-4 bg-blue-400/20 border border-blue-400/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-blue-200">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={deleteSelectedItems}
                className="px-3 py-1 bg-red-400/20 border border-red-400/30 rounded text-red-200 hover:bg-red-400/30 transition-all duration-200"
              >
                Delete Selected
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white hover:bg-white/20 transition-all duration-200"
              >
                Deselect All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <div className="text-4xl mb-4">📜</div>
            <div className="text-lg font-medium mb-2">No history found</div>
            <div className="text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Your browsing history will appear here'}
            </div>
          </div>
        ) : (
          <>
            {/* Select All Button */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={selectedItems.length === filteredHistory.length ? deselectAll : selectAll}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white hover:bg-white/20 transition-all duration-200"
              >
                {selectedItems.length === filteredHistory.length ? 'Deselect All' : 'Select All'}
              </button>
              <div className="text-sm text-white/70">
                {filteredHistory.length} item{filteredHistory.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* History Items */}
            {filteredHistory.map(item => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                  selectedItems.includes(item.id)
                    ? 'bg-blue-400/20 border-blue-400/30'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded"
                />
                
                <span className="text-xl">{item.icon}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{item.title}</div>
                  <div className="text-sm text-white/70 truncate">{item.url}</div>
                  <div className="text-xs text-white/50 mt-1">
                    {getTimeAgo(item.timestamp)} • {item.visitCount} visit{item.visitCount !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateToHistoryItem(item.url)}
                    className="px-3 py-1 bg-blue-400/20 border border-blue-400/30 rounded text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="px-3 py-1 bg-red-400/20 border border-red-400/30 rounded text-red-200 hover:bg-red-400/30 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
        <h4 className="text-md font-semibold text-yellow-200 mb-2">📜 History Tips</h4>
        <ul className="text-sm text-yellow-100 space-y-1">
          <li>• Use search to quickly find specific pages</li>
          <li>• Filter by date to find recent or older pages</li>
          <li>• Switch between global and tab-specific history</li>
          <li>• Export your history for backup or analysis</li>
        </ul>
      </div>
    </GlassPanel>
  );
};

export default History; 