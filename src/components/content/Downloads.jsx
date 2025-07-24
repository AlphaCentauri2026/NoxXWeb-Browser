import React, { useState, useEffect } from 'react';
import GlassPanel from '../settings/GlassPanel';

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showCompleted, setShowCompleted] = useState(true);

  // Remove mockDownloads useEffect

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'downloading': return 'text-blue-400';
      case 'paused': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'downloading': return '⬇️';
      case 'paused': return '⏸️';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const pauseDownload = (id) => {
    setDownloads(prev => prev.map(download => 
      download.id === id ? { ...download, status: 'paused' } : download
    ));
  };

  const resumeDownload = (id) => {
    setDownloads(prev => prev.map(download => 
      download.id === id ? { ...download, status: 'downloading' } : download
    ));
  };

  const cancelDownload = (id) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
  };

  const retryDownload = (id) => {
    setDownloads(prev => prev.map(download => 
      download.id === id ? { ...download, status: 'downloading', progress: 0, downloadedSize: 0 } : download
    ));
  };

  const openFile = (id) => {
    const download = downloads.find(d => d.id === id);
    if (download && download.status === 'completed') {
      // In a real app, this would open the file
      console.log(`Opening file: ${download.filename}`);
    }
  };

  const openFolder = (id) => {
    const download = downloads.find(d => d.id === id);
    if (download) {
      // In a real app, this would open the folder containing the file
      console.log(`Opening folder for: ${download.filename}`);
    }
  };

  const clearCompleted = () => {
    setDownloads(prev => prev.filter(download => download.status !== 'completed'));
  };

  const clearFailed = () => {
    setDownloads(prev => prev.filter(download => download.status !== 'failed'));
  };

  const exportDownloads = () => {
    const dataStr = JSON.stringify(downloads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'browser-downloads.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter and sort downloads
  const filteredDownloads = downloads
    .filter(download => {
      const matchesSearch = download.filename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || download.status === statusFilter;
      const matchesShowCompleted = showCompleted || download.status !== 'completed';
      return matchesSearch && matchesStatus && matchesShowCompleted;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.filename.localeCompare(b.filename);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

  const getStats = () => {
    const stats = {
      total: downloads.length,
      completed: downloads.filter(d => d.status === 'completed').length,
      downloading: downloads.filter(d => d.status === 'downloading').length,
      failed: downloads.filter(d => d.status === 'failed').length,
      totalSize: downloads.reduce((sum, d) => sum + d.size, 0),
      downloadedSize: downloads.reduce((sum, d) => sum + d.downloadedSize, 0)
    };
    return stats;
  };

  const stats = getStats();

  return (
    <GlassPanel className="w-full max-w-6xl mx-auto p-6 shadow-2xl">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <span>📥</span>
          <span>Downloads</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={exportDownloads}
            className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
          >
            📤 Export
          </button>
          <button
            onClick={clearCompleted}
            className="px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-lg text-green-200 hover:bg-green-400/30 transition-all duration-200"
          >
            🗑️ Clear Completed
          </button>
          <button
            onClick={clearFailed}
            className="px-4 py-2 bg-red-400/20 border border-red-400/30 rounded-lg text-red-200 hover:bg-red-400/30 transition-all duration-200"
          >
            🗑️ Clear Failed
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
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-white/70">Completed</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.downloading}</div>
          <div className="text-sm text-white/70">Downloading</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
          <div className="text-sm text-white/70">Failed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/70">Overall Progress</span>
          <span className="text-sm text-white/70">
            {formatFileSize(stats.downloadedSize)} / {formatFileSize(stats.totalSize)}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.totalSize > 0 ? (stats.downloadedSize / stats.totalSize) * 100 : 0}%` }}
          ></div>
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
              placeholder="Search downloads..."
              className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">🔍</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="downloading">Downloading</option>
            <option value="paused">Paused</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
          <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded"
            />
            <span className="text-white text-sm">Show Completed</span>
          </label>
        </div>
      </div>

      {/* Downloads List */}
      <div className="space-y-3">
        {filteredDownloads.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <div className="text-4xl mb-4">📥</div>
            <div className="text-lg font-medium mb-2">No downloads found</div>
            <div className="text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Your downloads will appear here'}
            </div>
          </div>
        ) : (
          filteredDownloads.map(download => (
            <div
              key={download.id}
              className="p-4 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{download.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{download.filename}</div>
                  <div className="text-sm text-white/70 truncate">{download.url}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg ${getStatusColor(download.status)}`}>
                    {getStatusIcon(download.status)}
                  </span>
                  <span className="text-sm text-white/70">
                    {formatFileSize(download.size)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white/70">
                    {formatFileSize(download.downloadedSize)} / {formatFileSize(download.size)}
                  </span>
                  <span className="text-xs text-white/70">{download.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      download.status === 'completed' ? 'bg-green-400' :
                      download.status === 'failed' ? 'bg-red-400' :
                      download.status === 'paused' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}
                    style={{ width: `${download.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Download Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-white/50">
                  {getTimeAgo(download.timestamp)} • {download.speed} • {download.estimatedTime}
                </div>
                <div className="text-xs text-white/50">
                  {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {download.status === 'completed' && (
                  <>
                    <button
                      onClick={() => openFile(download.id)}
                      className="px-3 py-1 bg-green-400/20 border border-green-400/30 rounded text-green-200 hover:bg-green-400/30 transition-all duration-200"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => openFolder(download.id)}
                      className="px-3 py-1 bg-blue-400/20 border border-blue-400/30 rounded text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
                    >
                      Show in Folder
                    </button>
                  </>
                )}
                
                {download.status === 'downloading' && (
                  <button
                    onClick={() => pauseDownload(download.id)}
                    className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded text-yellow-200 hover:bg-yellow-400/30 transition-all duration-200"
                  >
                    Pause
                  </button>
                )}
                
                {download.status === 'paused' && (
                  <button
                    onClick={() => resumeDownload(download.id)}
                    className="px-3 py-1 bg-blue-400/20 border border-blue-400/30 rounded text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
                  >
                    Resume
                  </button>
                )}
                
                {download.status === 'failed' && (
                  <button
                    onClick={() => retryDownload(download.id)}
                    className="px-3 py-1 bg-green-400/20 border border-green-400/30 rounded text-green-200 hover:bg-green-400/30 transition-all duration-200"
                  >
                    Retry
                  </button>
                )}
                
                <button
                  onClick={() => cancelDownload(download.id)}
                  className="px-3 py-1 bg-red-400/20 border border-red-400/30 rounded text-red-200 hover:bg-red-400/30 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
        <h4 className="text-md font-semibold text-yellow-200 mb-2">📥 Download Tips</h4>
        <ul className="text-sm text-yellow-100 space-y-1">
          <li>• Pause downloads to save bandwidth when needed</li>
          <li>• Failed downloads can be retried</li>
          <li>• Use the search to find specific files quickly</li>
          <li>• Clear completed downloads to keep the list organized</li>
        </ul>
      </div>
    </GlassPanel>
  );
};

export default Downloads; 