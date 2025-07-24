import React, { useState, useEffect } from 'react';
import GlassPanel from '../settings/GlassPanel';
import { FiInfo, FiCpu, FiServer, FiActivity, FiDownload, FiUpload, FiWifi, FiMonitor, FiZap, FiRefreshCw, FiBox, FiLayers, FiBarChart2, FiTrash2, FiArrowUpCircle, FiArrowDownCircle, FiPause, FiPlay, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

const PerformanceMonitor = () => {
  const [performance, setPerformance] = useState({
    cpu: { usage: 0, cores: 8 },
    memory: { used: 0, total: 0, percentage: 0 },
    network: { download: 0, upload: 0, latency: 0 },
    browser: { tabs: 0, extensions: 0, cache: 0 },
    fps: 60,
    loadTime: 0
  });
  const [history, setHistory] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshRate, setRefreshRate] = useState(1000); // 1 second

  // Listen for real performance data from Electron
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onPerformanceData) {
      const handler = (data) => {
        setPerformance(data);
        setHistory(prev => {
          const newHistory = [...prev, data];
          return newHistory.slice(-60);
        });
      };
      window.electronAPI.onPerformanceData(handler);
      return () => {
        // No need to remove listener for ipcRenderer.on
      };
    }
  }, []);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceIcon = (value, thresholds) => {
    if (value <= thresholds.good) return <FiCheckCircle className="inline text-green-400" />;
    if (value <= thresholds.warning) return <FiAlertTriangle className="inline text-yellow-400" />;
    return <FiXCircle className="inline text-red-400" />;
  };

  const clearCache = () => {
    setPerformance(prev => ({
      ...prev,
      browser: { ...prev.browser, cache: 0 }
    }));
  };

  const optimizePerformance = () => {
    // Simulate performance optimization
    setPerformance(prev => ({
      ...prev,
      cpu: { ...prev.cpu, usage: Math.max(0, prev.cpu.usage - 20) },
      memory: { 
        ...prev.memory, 
        used: prev.memory.used * 0.8,
        percentage: prev.memory.percentage * 0.8
      },
      browser: { ...prev.browser, cache: 0 }
    }));
  };

  const exportPerformanceData = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'performance-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getAveragePerformance = () => {
    if (history.length === 0) return null;
    const avg = history.reduce((acc, perf) => ({
      cpu: acc.cpu + perf.cpu.usage,
      appRss: acc.appRss + (perf.appMemory?.rss || 0),
      fps: acc.fps + perf.fps,
      loadTime: acc.loadTime + perf.loadTime
    }), { cpu: 0, appRss: 0, fps: 0, loadTime: 0 });
    return {
      cpu: avg.cpu / history.length,
      appRss: avg.appRss / history.length,
      fps: avg.fps / history.length,
      loadTime: avg.loadTime / history.length
    };
  };

  const averagePerformance = getAveragePerformance();

  return (
    <GlassPanel className="w-full max-w-6xl mx-auto p-6 shadow-2xl">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <span>📊</span>
          <span>Performance Monitor</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
              isMonitoring
                ? 'bg-red-400/20 border-red-400/30 text-red-200 hover:bg-red-400/30'
                : 'bg-green-400/20 border-green-400/30 text-green-200 hover:bg-green-400/30'
            }`}
          >
            {isMonitoring ? <FiPause className="inline mr-1" /> : <FiPlay className="inline mr-1" />}
            {isMonitoring ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={optimizePerformance}
            className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
          >
            <FiZap className="inline mr-1" /> Optimize
          </button>
          <button
            onClick={exportPerformanceData}
            className="px-4 py-2 bg-purple-400/20 border border-purple-400/30 rounded-lg text-purple-200 hover:bg-purple-400/30 transition-all duration-200"
          >
            <FiDownload className="inline mr-1" /> Export
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CPU Usage */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70 flex items-center gap-1"><FiCpu /> CPU Usage</span>
            <span className={`text-lg ${getPerformanceColor(performance.cpu.usage, { good: 50, warning: 80 })}`}>
              {getPerformanceIcon(performance.cpu.usage, { good: 50, warning: 80 })}
            </span>
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(performance.cpu.usage, { good: 50, warning: 80 })}`}>
            {performance.cpu.usage.toFixed(1)}%
          </div>
          <div className="text-xs text-white/50 mt-1">
            {performance.cpu.cores} cores
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                performance.cpu.usage <= 50 ? 'bg-green-400' :
                performance.cpu.usage <= 80 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.min(performance.cpu.usage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70 flex items-center gap-1"><FiServer /> App Memory <span title="Resident Set Size: Total memory allocated for this Electron process, including JS, native modules, and buffers."><FiInfo className="inline text-blue-300 cursor-pointer" /></span></span>
          </div>
          {performance.appMemory && (
            <>
              <div className="text-2xl font-bold text-blue-300 flex items-center gap-2">
                {formatBytes(performance.appMemory.rss)}
                <span className="text-xs flex items-center gap-1" title="Resident Set Size: Total memory allocated for this Electron process.">(RSS)<FiInfo className="inline text-blue-300 cursor-pointer" /></span>
              </div>
              <div className="text-xs text-blue-200 mt-1 flex items-center gap-1">Heap: {formatBytes(performance.appMemory.heapUsed)} / {formatBytes(performance.appMemory.heapTotal)}<span title="Heap: JavaScript heap used/total. Used is actual JS objects, total is allocated by V8."><FiInfo className="inline text-blue-200 cursor-pointer" /></span></div>
            </>
          )}
          {performance.totalElectronMemory && (
            <div className="text-xs text-purple-300 mt-1 flex items-center gap-1">All Electron: {formatBytes(performance.totalElectronMemory)}<span title="Total memory (RSS) used by all Electron processes (main, renderer, GPU, etc.)"><FiInfo className="inline text-purple-300 cursor-pointer" /></span></div>
          )}
        </div>

        {/* Network */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70 flex items-center gap-1"><FiWifi /> Network</span>
            <span className={`text-lg ${getPerformanceColor(performance.network.latency, { good: 50, warning: 100 })}`}>
              {getPerformanceIcon(performance.network.latency, { good: 50, warning: 100 })}
            </span>
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(performance.network.latency, { good: 50, warning: 100 })}`}>
            {performance.network.latency.toFixed(0)}ms
          </div>
          <div className="text-xs text-white/50 mt-1">
            ↓ {performance.network.download.toFixed(1)} MB/s
          </div>
          <div className="text-xs text-white/50">
            ↑ {performance.network.upload.toFixed(1)} MB/s
          </div>
        </div>

        {/* FPS */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70 flex items-center gap-1"><FiMonitor /> FPS</span>
            <span className={`text-lg ${getPerformanceColor(60 - performance.fps, { good: 10, warning: 30 })}`}>
              {getPerformanceIcon(60 - performance.fps, { good: 10, warning: 30 })}
            </span>
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(60 - performance.fps, { good: 10, warning: 30 })}`}>
            {performance.fps.toFixed(0)}
          </div>
          <div className="text-xs text-white/50 mt-1">
            Load: {performance.loadTime.toFixed(0)}ms
          </div>
        </div>
      </div>

      {/* Browser Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70 flex items-center gap-1"><FiLayers /> Active Tabs</div>
              <div className="text-xl font-bold text-white">{performance.browser.tabs}</div>
            </div>
            <FiBox className="text-2xl" />
          </div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70 flex items-center gap-1"><FiBarChart2 /> Extensions</div>
              <div className="text-xl font-bold text-white">{performance.browser.extensions}</div>
            </div>
            <FiBox className="text-2xl" />
          </div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70 flex items-center gap-1"><FiTrash2 /> Cache Size</div>
              <div className="text-xl font-bold text-white">{performance.browser.cache.toFixed(1)} MB</div>
            </div>
            <FiTrash2 className="text-2xl hover:text-blue-400 transition-colors cursor-pointer" title="Clear Cache" onClick={clearCache} />
          </div>
        </div>
      </div>

      {/* Performance History Chart */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FiBarChart2 /> Performance History</h3>
        <div className="h-32 flex items-end space-x-1">
          {history.slice(-30).map((perf, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-t opacity-60"
              style={{ 
                height: `${(perf.cpu.usage / 100) * 100}%`,
                minHeight: '2px'
              }}
              title={`CPU: ${perf.cpu.usage.toFixed(1)}% | Memory: ${perf.memory.percentage.toFixed(1)}%`}
            ></div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-white/50 mt-2">
          <span>30 seconds ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Average Performance */}
      {averagePerformance && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FiBarChart2 /> Average Performance (Last Minute)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-white/70">Avg CPU</div>
              <div className="text-xl font-bold text-white">{averagePerformance.cpu.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/70">Avg App RSS</div>
              <div className="text-xl font-bold text-blue-300">{formatBytes(averagePerformance.appRss)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/70">Avg FPS</div>
              <div className="text-xl font-bold text-white">{averagePerformance.fps.toFixed(0)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/70">Avg Load Time</div>
              <div className="text-xl font-bold text-white">{averagePerformance.loadTime.toFixed(0)}ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tips */}
      <div className="p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-lg flex items-center gap-2">
        <FiInfo className="inline text-yellow-200" />
        <h4 className="text-md font-semibold text-yellow-200 mb-2">Performance Tips</h4>
        <ul className="text-sm text-yellow-100 space-y-1">
          <li>• Close unused tabs to reduce memory usage</li>
          <li>• Disable unnecessary extensions</li>
          <li>• Clear browser cache regularly</li>
          <li>• Monitor CPU usage for background processes</li>
        </ul>
      </div>

      {/* Refresh Rate Control */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white">Update Frequency</div>
            <div className="text-xs text-white/70">How often to refresh performance data</div>
          </div>
          <select
            value={refreshRate}
            onChange={(e) => setRefreshRate(parseInt(e.target.value))}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value={500}>0.5s (Fast)</option>
            <option value={1000}>1s (Normal)</option>
            <option value={2000}>2s (Slow)</option>
            <option value={5000}>5s (Very Slow)</option>
          </select>
        </div>
      </div>
    </GlassPanel>
  );
};

export default PerformanceMonitor; 