import React, { useState } from 'react';
import { MdExtension } from 'react-icons/md';
import { FiSearch, FiShoppingCart, FiCheckCircle, FiXCircle, FiRefreshCw, FiGlobe, FiTrash2, FiStar, FiUsers, FiCalendar, FiTool } from 'react-icons/fi';
import GlassPanel from '../../components/settings/GlassPanel';

const ExtensionsPanel = () => {
  const [extensions, setExtensions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSystemExtensions, setShowSystemExtensions] = useState(false);

  // Placeholder for extensions button logic
  const handleExtensionsButton = () => {
    // TODO: Implement logic for opening extension store or managing extensions
    alert('Extensions button logic goes here!');
  };

  // Removed mockExtensions and useEffect

  const toggleExtension = (id) => {
    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, status: ext.status === 'enabled' ? 'disabled' : 'enabled' } : ext
    ));
  };

  const removeExtension = (id) => {
    setExtensions(prev => prev.filter(ext => ext.id !== id));
  };

  const updateExtension = (id) => {
    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, lastUpdated: new Date().toISOString() } : ext
    ));
  };

  const openExtensionPage = (homepage) => {
    if (homepage) {
      window.open(homepage, '_blank');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enabled': return 'text-green-400';
      case 'disabled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'enabled': return <FiCheckCircle />;
      case 'disabled': return <FiXCircle />;
      default: return <MdExtension />;
    }
  };

  const getPermissionDescription = (permission) => {
    const descriptions = {
      'activeTab': 'Access to current tab',
      'storage': 'Store data locally',
      'tabs': 'Access to all tabs',
      'webRequest': 'Monitor web requests',
      'identity': 'Access to identity',
      'system': 'System-level access'
    };
    return descriptions[permission] || permission;
  };

  // Filter extensions based on search, status, and system filter
  const filteredExtensions = extensions.filter(extension => {
    const matchesSearch = extension.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         extension.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || extension.status === statusFilter;
    const matchesSystem = showSystemExtensions || !extension.isSystem;
    
    return matchesSearch && matchesStatus && matchesSystem;
  });

  const getStats = () => {
    const stats = {
      total: extensions.length,
      enabled: extensions.filter(ext => ext.status === 'enabled').length,
      disabled: extensions.filter(ext => ext.status === 'disabled').length,
      system: extensions.filter(ext => ext.isSystem).length,
      totalSize: extensions.reduce((sum, ext) => {
        const sizeInMB = parseFloat(ext.size?.replace(' MB', ''));
        return sum + (sizeInMB || 0);
      }, 0)
    };
    return stats;
  };

  const stats = getStats();

  return (
    <GlassPanel className="w-full max-w-6xl mx-auto p-6 shadow-2xl">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <span><MdExtension /></span>
          <span>Extensions</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleExtensionsButton}
            className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
          >
            <FiShoppingCart className="inline mr-1" /> Get Extensions
          </button>
          <button
            onClick={() => setExtensions(prev => prev.map(ext => ({ ...ext, status: 'enabled' })))}
            className="px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-lg text-green-200 hover:bg-green-400/30 transition-all duration-200"
          >
            <FiCheckCircle className="inline mr-1" /> Enable All
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
          <div className="text-2xl font-bold text-green-400">{stats.enabled}</div>
          <div className="text-sm text-white/70">Enabled</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.disabled}</div>
          <div className="text-sm text-white/70">Disabled</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.totalSize.toFixed(1)} MB</div>
          <div className="text-sm text-white/70">Total Size</div>
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
              placeholder="Search extensions..."
              className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"><FiSearch /></span>
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
            <input
              type="checkbox"
              checked={showSystemExtensions}
              onChange={(e) => setShowSystemExtensions(e.target.checked)}
              className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded"
            />
            <span className="text-white text-sm">Show System</span>
          </label>
        </div>
      </div>

      {/* Extensions List */}
      <div className="space-y-4">
        {filteredExtensions.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <div className="text-4xl mb-4"><MdExtension /></div>
            <div className="text-lg font-medium mb-2">No extensions found</div>
            <div className="text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Install extensions to get started'}
            </div>
          </div>
        ) : (
          filteredExtensions.map(extension => (
            <div
              key={extension.id}
              className="p-6 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="text-3xl">{extension.icon}</div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{extension.name}</h3>
                      {extension.isSystem && (
                        <span className="px-2 py-1 bg-purple-400/20 border border-purple-400/30 rounded text-xs text-purple-200">
                          System
                        </span>
                      )}
                      <span className={`text-lg ${getStatusColor(extension.status)}`}>{getStatusIcon(extension.status)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-white/70">v{extension.version}</span>
                      <span className="text-sm text-white/70">{extension.size}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/80 mb-3">{extension.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-white/60 mb-3">
                    <span>By {extension.author}</span>
                    <span><FiStar className="inline mr-1" /> {extension.rating}</span>
                    <span><FiUsers className="inline mr-1" /> {extension.users.toLocaleString()}</span>
                    <span><FiCalendar className="inline mr-1" /> {new Date(extension.lastUpdated).toLocaleDateString()}</span>
                  </div>

                  {/* Permissions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Permissions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {extension.permissions.map(permission => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded text-xs text-yellow-200"
                          title={getPermissionDescription(permission)}
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {!extension.isSystem && (
                      <button
                        onClick={() => toggleExtension(extension.id)}
                        className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                          extension.status === 'enabled'
                            ? 'bg-red-400/20 border border-red-400/30 text-red-200 hover:bg-red-400/30'
                            : 'bg-green-400/20 border border-green-400/30 text-green-200 hover:bg-green-400/30'
                        }`}
                      >
                        {extension.status === 'enabled' ? 'Disable' : 'Enable'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => updateExtension(extension.id)}
                      className="px-3 py-1 bg-blue-400/20 border border-blue-400/30 rounded text-sm text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
                    >
                      <FiRefreshCw className="inline mr-1" /> Update
                    </button>
                    
                    {extension.homepage && (
                      <button
                        onClick={() => openExtensionPage(extension.homepage)}
                        className="px-3 py-1 bg-purple-400/20 border border-purple-400/30 rounded text-sm text-purple-200 hover:bg-purple-400/30 transition-all duration-200"
                      >
                        <FiGlobe className="inline mr-1" /> Homepage
                      </button>
                    )}
                    
                    {!extension.isSystem && (
                      <button
                        onClick={() => removeExtension(extension.id)}
                        className="px-3 py-1 bg-red-400/20 border border-red-400/30 rounded text-sm text-red-200 hover:bg-red-400/30 transition-all duration-200"
                      >
                        <FiTrash2 className="inline mr-1" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Extension Tips */}
      <div className="mt-6 p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
        <h4 className="text-md font-semibold text-yellow-200 mb-2"><MdExtension className="inline mr-1" /> Extension Tips</h4>
        <ul className="text-sm text-yellow-100 space-y-1">
          <li>• Only install extensions from trusted sources</li>
          <li>• Review permissions before installing</li>
          <li>• Disable unused extensions to improve performance</li>
          <li>• Keep extensions updated for security</li>
        </ul>
      </div>

      {/* Developer Mode */}
      <div className="mt-6 p-4 bg-blue-400/20 border border-blue-400/30 rounded-lg">
        <h4 className="text-md font-semibold text-blue-200 mb-2"><FiTool className="inline mr-1" /> Developer Mode</h4>
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-100">
            Load unpacked extensions for development
          </div>
          <button className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded text-blue-200 hover:bg-blue-400/30 transition-all duration-200">
            Load Extension
          </button>
        </div>
      </div>
    </GlassPanel>
  );
};

export default ExtensionsPanel; 