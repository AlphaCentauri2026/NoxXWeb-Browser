import React, { useState, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import GlassPanel from '../settings/GlassPanel';
import { FiCamera, FiMic, FiMapPin, FiBell, FiSave, FiMaximize, FiCreditCard, FiMusic, FiShield, FiGlobe, FiTrash2, FiUpload, FiCheckCircle, FiXCircle, FiClock, FiInfo, FiSearch, FiLock } from 'react-icons/fi';

const PermissionManager = () => {
  const { tabs, activeTabId } = useTabs();
  const [permissions, setPermissions] = useState([]); // [{ site, permissions: [{ type, status, lastUsed }] }]
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Fetch real permissions on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      const sitePerms = await window.electronAPI.getSitePermissions();
      // Convert { site: { permission: status, ... }, ... } to [{ site, permissions: [{ type, status }] }]
      const permsArr = Object.entries(sitePerms).map(([site, perms]) => ({
        site,
        permissions: Object.entries(perms).map(([type, status]) => ({ type, status }))
      }));
      setPermissions(permsArr);
    };
    fetchPermissions();
  }, []);

  const permissionTypes = [
    { key: 'camera', label: 'Camera', icon: <FiCamera />, description: 'Access to camera' },
    { key: 'microphone', label: 'Microphone', icon: <FiMic />, description: 'Access to microphone' },
    { key: 'location', label: 'Location', icon: <FiMapPin />, description: 'Access to location' },
    { key: 'notifications', label: 'Notifications', icon: <FiBell />, description: 'Send notifications' },
    { key: 'storage', label: 'Storage', icon: <FiSave />, description: 'Access to storage' },
    { key: 'fullscreen', label: 'Fullscreen', icon: <FiMaximize />, description: 'Enter fullscreen mode' },
    { key: 'payment', label: 'Payment', icon: <FiCreditCard />, description: 'Access to payment methods' },
    { key: 'midi', label: 'MIDI', icon: <FiMusic />, description: 'Access to MIDI devices' }
  ];

  const getPermissionIcon = (type) => {
    const permission = permissionTypes.find(p => p.key === type);
    return permission ? permission.icon : <FiInfo />;
  };

  const getPermissionLabel = (type) => {
    const permission = permissionTypes.find(p => p.key === type);
    return permission ? permission.label : type;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'granted': return 'text-green-400';
      case 'denied': return 'text-red-400';
      case 'prompt': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'granted': return <FiCheckCircle className="text-green-400" />;
      case 'denied': return <FiXCircle className="text-red-400" />;
      case 'prompt': return <FiClock className="text-yellow-400" />;
      default: return <FiInfo className="text-gray-400" />;
    }
  };

  const updatePermission = async (site, permissionType, newStatus) => {
    await window.electronAPI.setSitePermission(site, permissionType, newStatus);
    // Refresh permissions
    const sitePerms = await window.electronAPI.getSitePermissions();
    const permsArr = Object.entries(sitePerms).map(([site, perms]) => ({
      site,
      permissions: Object.entries(perms).map(([type, status]) => ({ type, status }))
    }));
    setPermissions(permsArr);
  };

  const removeSite = async (site) => {
    await window.electronAPI.removeSitePermissions(site);
    // Refresh permissions
    const sitePerms = await window.electronAPI.getSitePermissions();
    const permsArr = Object.entries(sitePerms).map(([site, perms]) => ({
      site,
      permissions: Object.entries(perms).map(([type, status]) => ({ type, status }))
    }));
    setPermissions(permsArr);
  };

  const clearAllPermissions = async () => {
    await window.electronAPI.clearAllPermissions();
    setPermissions([]);
  };

  const exportPermissions = () => {
    const dataStr = JSON.stringify(permissions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'browser-permissions.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter permissions based on search and status
  const filteredPermissions = permissions.filter(site => {
    const matchesSearch = site.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
      site.permissions.some(perm => perm.status === activeFilter);
    return matchesSearch && matchesFilter;
  });

  const getStats = () => {
    const stats = { granted: 0, denied: 0, prompt: 0, total: 0 };
    permissions.forEach(site => {
      site.permissions.forEach(perm => {
        stats[perm.status]++;
        stats.total++;
      });
    });
    return stats;
  };

  const stats = getStats();

  return (
    <GlassPanel className="w-full max-w-6xl mx-auto p-6 shadow-2xl">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <FiLock className="text-3xl text-blue-300" />
          <span>Site Permissions</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={exportPermissions}
            className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
          >
            <FiUpload className="inline mr-2" /> Export
          </button>
          <button
            onClick={clearAllPermissions}
            className="px-4 py-2 bg-red-400/20 border border-red-400/30 rounded-lg text-red-200 hover:bg-red-400/30 transition-all duration-200"
          >
            <FiTrash2 className="inline mr-2" /> Clear All
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.granted}</div>
          <div className="text-sm text-white/70">Granted</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.denied}</div>
          <div className="text-sm text-white/70">Denied</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.prompt}</div>
          <div className="text-sm text-white/70">Pending</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-400">{permissions.length}</div>
          <div className="text-sm text-white/70">Sites</div>
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
              placeholder="Search sites..."
              className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>
        </div>
        <div className="flex space-x-2">
          {['all', 'granted', 'denied', 'prompt'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-blue-400/20 border-blue-400/30 text-blue-200'
                  : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Current Site Info */}
      {activeTab?.url && (
        <div className="mb-6 p-4 bg-blue-400/20 border border-blue-400/30 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-200 mb-2">Current Site</h3>
          <div className="text-white">{activeTab.url}</div>
          <div className="text-sm text-blue-100 mt-1">
            Manage permissions for this site in the list below
          </div>
        </div>
      )}

      {/* Permissions List */}
      <div className="space-y-4">
        {filteredPermissions.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <FiLock className="text-4xl mb-4 text-blue-300 mx-auto" />
            <div className="text-lg font-medium mb-2">No permissions found</div>
            <div className="text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Sites will appear here when they request permissions'}
            </div>
          </div>
        ) : (
          filteredPermissions.map(site => (
            <div
              key={site.site}
              className="p-6 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FiGlobe className="text-2xl text-blue-200" />
                  <div>
                    <div className="text-lg font-semibold text-white">{site.site}</div>
                    <div className="text-sm text-white/70">
                      {site.permissions.length} permission{site.permissions.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeSite(site.site)}
                  className="px-3 py-1 bg-red-400/20 border border-red-400/30 rounded text-red-200 hover:bg-red-400/30 transition-all duration-200"
                >
                  Remove Site
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {site.permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded-lg border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPermissionIcon(permission.type)}</span>
                        <span className="font-medium text-white">{getPermissionLabel(permission.type)}</span>
                      </div>
                      <span className={`text-lg ${getStatusColor(permission.status)}`}>
                        {getStatusIcon(permission.status)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-white/70 mb-3">
                      {permissionTypes.find(p => p.key === permission.type)?.description}
                    </div>

                    <div className="flex space-x-1">
                      {['granted', 'denied', 'prompt'].map(status => (
                        <button
                          key={status}
                          onClick={() => updatePermission(site.site, permission.type, status)}
                          className={`flex-1 px-2 py-1 text-xs rounded transition-all duration-200 ${
                            permission.status === status
                              ? 'bg-blue-400/20 border border-blue-400/30 text-blue-200'
                              : 'bg-white/5 border border-white/20 text-white hover:bg-white/10'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>

                    {permission.lastUsed && (
                      <div className="text-xs text-white/50 mt-2">
                        Last used: {new Date(permission.lastUsed).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Permission Types Reference */}
      <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Permission Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {permissionTypes.map(permission => (
            <div key={permission.key} className="flex items-center space-x-2 p-2 bg-white/5 rounded">
              <span className="text-lg">{permission.icon}</span>
              <div>
                <div className="text-sm font-medium text-white">{permission.label}</div>
                <div className="text-xs text-white/70">{permission.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
        <h4 className="text-md font-semibold text-yellow-200 mb-2 flex items-center"><FiShield className="mr-2" /> Permission Tips</h4>
        <ul className="text-sm text-yellow-100 space-y-1">
          <li><FiCheckCircle className="inline mr-1 text-yellow-200" /> Only grant permissions to sites you trust</li>
          <li><FiCheckCircle className="inline mr-1 text-yellow-200" /> Regularly review and revoke unnecessary permissions</li>
          <li><FiMic className="inline mr-1 text-yellow-200" /> Be cautious with camera and microphone access</li>
          <li><FiMapPin className="inline mr-1 text-yellow-200" /> Location permissions can be set to "ask" for better control</li>
        </ul>
      </div>
    </GlassPanel>
  );
};

export default PermissionManager; 