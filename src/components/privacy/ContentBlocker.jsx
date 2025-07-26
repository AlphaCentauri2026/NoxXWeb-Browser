import React, { useState, useEffect } from 'react';
import { FiShield, FiEye, FiEyeOff, FiPlus, FiTrash2, FiDownload, FiSettings, FiCheck, FiX } from 'react-icons/fi';

const ContentBlocker = ({ isOpen, onClose }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [blockedRequests, setBlockedRequests] = useState([]);
  const [filterLists, setFilterLists] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [stats, setStats] = useState({
    adsBlocked: 0,
    trackersBlocked: 0,
    requestsBlocked: 0,
    dataSaved: '0 KB'
  });
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [newFilter, setNewFilter] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize with sample data
  useEffect(() => {
    const sampleBlockedRequests = [
      {
        id: 1,
        url: 'https://doubleclick.net/ads.js',
        type: 'script',
        category: 'advertising',
        timestamp: new Date(Date.now() - 5000),
        domain: 'doubleclick.net'
      },
      {
        id: 2,
        url: 'https://google-analytics.com/collect',
        type: 'xhr',
        category: 'analytics',
        timestamp: new Date(Date.now() - 10000),
        domain: 'google-analytics.com'
      },
      {
        id: 3,
        url: 'https://facebook.com/tr',
        type: 'image',
        category: 'social',
        timestamp: new Date(Date.now() - 15000),
        domain: 'facebook.com'
      },
      {
        id: 4,
        url: 'https://googlesyndication.com/pagead/js',
        type: 'script',
        category: 'advertising',
        timestamp: new Date(Date.now() - 20000),
        domain: 'googlesyndication.com'
      }
    ];

    const sampleFilterLists = [
      {
        id: 1,
        name: 'EasyList',
        description: 'Primary filter list for ad blocking',
        url: 'https://easylist.to/easylist/easylist.txt',
        enabled: true,
        rules: 45000,
        lastUpdated: new Date(Date.now() - 86400000)
      },
      {
        id: 2,
        name: 'Privacy Badger',
        description: 'Privacy-focused blocking rules',
        url: 'https://www.eff.org/privacybadger',
        enabled: true,
        rules: 12000,
        lastUpdated: new Date(Date.now() - 172800000)
      },
      {
        id: 3,
        name: 'Fanboy\'s Annoyance List',
        description: 'Blocks annoying elements and popups',
        url: 'https://www.fanboy.co.nz/fanboy-annoyance.txt',
        enabled: false,
        rules: 8000,
        lastUpdated: new Date(Date.now() - 259200000)
      }
    ];

    const sampleCustomFilters = [
      '||example.com/ads/*',
      '||tracking.example.com^',
      '||analytics.example.com/collect',
      '||ads.example.com/banner'
    ];

    setBlockedRequests(sampleBlockedRequests);
    setFilterLists(sampleFilterLists);
    setCustomFilters(sampleCustomFilters);
    
    // Calculate stats
    const adCount = sampleBlockedRequests.filter(r => r.category === 'advertising').length;
    const trackerCount = sampleBlockedRequests.filter(r => r.category === 'analytics').length;
    setStats({
      adsBlocked: adCount,
      trackersBlocked: trackerCount,
      requestsBlocked: sampleBlockedRequests.length,
      dataSaved: `${(sampleBlockedRequests.length * 2.5).toFixed(1)} KB`
    });
  }, []);

  const handleToggleFilterList = (id) => {
    setFilterLists(filterLists.map(list => 
      list.id === id ? { ...list, enabled: !list.enabled } : list
    ));
  };

  const handleAddCustomFilter = () => {
    if (newFilter.trim()) {
      setCustomFilters([...customFilters, newFilter.trim()]);
      setNewFilter('');
      setShowAddFilter(false);
    }
  };

  const handleRemoveCustomFilter = (index) => {
    setCustomFilters(customFilters.filter((_, i) => i !== index));
  };

  const handleUpdateFilterList = (id) => {
    // Simulate updating filter list
    setFilterLists(filterLists.map(list => 
      list.id === id ? { ...list, lastUpdated: new Date() } : list
    ));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'advertising': return '🛡️';
      case 'analytics': return '📊';
      case 'social': return '👥';
      case 'malware': return '🦠';
      default: return '❓';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'advertising': return 'text-red-400';
      case 'analytics': return 'text-yellow-400';
      case 'social': return 'text-blue-400';
      case 'malware': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'requests', name: 'Blocked Requests' },
    { id: 'filters', name: 'Filter Lists' },
    { id: 'custom', name: 'Custom Filters' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-strong rounded-2xl p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FiShield className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Content Blocker</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-300">
                {isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.adsBlocked}</div>
                  <div className="text-sm text-gray-300">Ads Blocked</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.trackersBlocked}</div>
                  <div className="text-sm text-gray-300">Trackers Blocked</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.requestsBlocked}</div>
                  <div className="text-sm text-gray-300">Total Blocked</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.dataSaved}</div>
                  <div className="text-sm text-gray-300">Data Saved</div>
                </div>
              </div>

              <div className="glass rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Blocked Requests</h3>
                <div className="space-y-2">
                  {blockedRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-2 rounded bg-gray-800">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getCategoryIcon(request.category)}</span>
                        <div>
                          <div className="text-white text-sm truncate max-w-xs">{request.url}</div>
                          <div className="text-gray-400 text-xs">{request.domain}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-semibold ${getCategoryColor(request.category)}`}>
                          {request.category}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {request.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Blocked Requests</h3>
                <button
                  onClick={() => setBlockedRequests([])}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear History
                </button>
              </div>
              {blockedRequests.map((request) => (
                <div key={request.id} className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryIcon(request.category)}</span>
                      <div>
                        <div className="text-white text-sm">{request.url}</div>
                        <div className="text-gray-400 text-xs">{request.domain} • {request.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${getCategoryColor(request.category)}`}>
                        {request.category}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {request.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'filters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Filter Lists</h3>
                <button
                  onClick={() => {/* Add new filter list */}}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <FiPlus />
                  <span>Add List</span>
                </button>
              </div>
              {filterLists.map((list) => (
                <div key={list.id} className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-white">{list.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          list.enabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
                        }`}>
                          {list.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{list.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{list.rules.toLocaleString()} rules</span>
                        <span>Updated: {list.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleFilterList(list.id)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          list.enabled 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {list.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleUpdateFilterList(list.id)}
                        className="text-gray-400 hover:text-white"
                        title="Update filter list"
                      >
                        <FiDownload size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Custom Filters</h3>
                <button
                  onClick={() => setShowAddFilter(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <FiPlus />
                  <span>Add Filter</span>
                </button>
              </div>

              {showAddFilter && (
                <div className="glass rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Add Custom Filter</h4>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newFilter}
                      onChange={(e) => setNewFilter(e.target.value)}
                      placeholder="Enter filter rule (e.g., ||example.com/ads/*)"
                      className="flex-1 px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomFilter()}
                    />
                    <button
                      onClick={handleAddCustomFilter}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      onClick={() => setShowAddFilter(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {customFilters.map((filter, index) => (
                  <div key={index} className="glass rounded-lg p-3 flex items-center justify-between">
                    <code className="text-blue-400 text-sm">{filter}</code>
                    <button
                      onClick={() => handleRemoveCustomFilter(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {customFilters.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <FiShield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No custom filters added</p>
                  <p className="text-sm">Add your own blocking rules to enhance privacy</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentBlocker; 