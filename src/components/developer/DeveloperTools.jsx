import React, { useState, useEffect, useRef } from 'react';
import { FiTerminal, FiGlobe, FiCode, FiActivity, FiX, FiMaximize2, FiMinimize2, FiRefreshCw } from 'react-icons/fi';

const DeveloperTools = ({ isOpen, onClose, activeTabId }) => {
  const [activeTab, setActiveTab] = useState('console');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [networkRequests, setNetworkRequests] = useState([]);
  const [elements, setElements] = useState([]);
  const [performance, setPerformance] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);
  const [consoleInput, setConsoleInput] = useState('');
  const consoleEndRef = useRef(null);

  // Sample data for demonstration
  useEffect(() => {
    const sampleConsoleLogs = [
      { id: 1, type: 'log', message: 'NoxX Browser initialized successfully', timestamp: new Date(), level: 'info' },
      { id: 2, type: 'warn', message: 'Deprecated API usage detected', timestamp: new Date(), level: 'warning' },
      { id: 3, type: 'error', message: 'Failed to load external resource', timestamp: new Date(), level: 'error' },
      { id: 4, type: 'info', message: 'Tab created: github.com', timestamp: new Date(), level: 'info' }
    ];

    const sampleNetworkRequests = [
      {
        id: 1,
        method: 'GET',
        url: 'https://api.github.com/user',
        status: 200,
        size: '2.3 KB',
        time: '145ms',
        type: 'xhr'
      },
      {
        id: 2,
        method: 'POST',
        url: 'https://api.example.com/data',
        status: 201,
        size: '1.1 KB',
        time: '89ms',
        type: 'fetch'
      },
      {
        id: 3,
        method: 'GET',
        url: 'https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js',
        status: 200,
        size: '45.2 KB',
        time: '234ms',
        type: 'script'
      }
    ];

    const sampleElements = [
      { id: 'html', tag: 'html', children: ['head', 'body'] },
      { id: 'head', tag: 'head', children: ['title', 'meta', 'link'] },
      { id: 'body', tag: 'body', children: ['div', 'script'] },
      { id: 'div', tag: 'div', children: ['h1', 'p', 'button'] }
    ];

    setConsoleLogs(sampleConsoleLogs);
    setNetworkRequests(sampleNetworkRequests);
    setElements(sampleElements);
  }, []);

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [consoleLogs]);

  const handleConsoleSubmit = (e) => {
    e.preventDefault();
    if (consoleInput.trim()) {
      const newLog = {
        id: Date.now(),
        type: 'input',
        message: `> ${consoleInput}`,
        timestamp: new Date(),
        level: 'input'
      };
      setConsoleLogs([...consoleLogs, newLog]);
      setConsoleInput('');
      
      // Simulate response
      setTimeout(() => {
        const responseLog = {
          id: Date.now() + 1,
          type: 'output',
          message: `// Result: ${consoleInput}`,
          timestamp: new Date(),
          level: 'output'
        };
        setConsoleLogs(prev => [...prev, responseLog]);
      }, 100);
    }
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-yellow-400';
    if (status >= 400 && status < 500) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const tabs = [
    { id: 'console', name: 'Console', icon: FiTerminal },
    { id: 'network', name: 'Network', icon: FiGlobe },
    { id: 'elements', name: 'Elements', icon: FiCode },
    { id: 'performance', name: 'Performance', icon: FiActivity }
  ];

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="text-gray-400 hover:text-white"
            >
              <FiMaximize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40 h-96">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white"
          >
            <FiMinimize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="h-full overflow-hidden">
        {activeTab === 'console' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <h3 className="text-white font-semibold">Console</h3>
              <button
                onClick={clearConsole}
                className="text-gray-400 hover:text-white text-sm"
              >
                Clear console
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {consoleLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2">
                  <span className="text-gray-500 text-xs mt-1">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`text-sm ${
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warning' ? 'text-yellow-400' :
                    log.level === 'input' ? 'text-blue-400' :
                    log.level === 'output' ? 'text-green-400' :
                    'text-gray-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
            <form onSubmit={handleConsoleSubmit} className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">></span>
                <input
                  type="text"
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  placeholder="Enter JavaScript expression..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            </form>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <h3 className="text-white font-semibold">Network</h3>
              <button
                onClick={() => setNetworkRequests([])}
                className="text-gray-400 hover:text-white text-sm flex items-center space-x-1"
              >
                <FiRefreshCw size={14} />
                <span>Clear</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                <div className="col-span-1">Method</div>
                <div className="col-span-6">URL</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-1">Time</div>
                <div className="col-span-1">Type</div>
              </div>
              <div className="space-y-1">
                {networkRequests.map((request) => (
                  <div key={request.id} className="grid grid-cols-12 gap-2 px-4 py-2 text-sm hover:bg-gray-800">
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded text-xs text-white ${getMethodColor(request.method)}`}>
                        {request.method}
                      </span>
                    </div>
                    <div className="col-span-6 text-blue-400 truncate">{request.url}</div>
                    <div className={`col-span-1 ${getStatusColor(request.status)}`}>
                      {request.status}
                    </div>
                    <div className="col-span-1 text-gray-300">{request.size}</div>
                    <div className="col-span-1 text-gray-300">{request.time}</div>
                    <div className="col-span-1 text-gray-300">{request.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="h-full flex">
            <div className="w-1/2 border-r border-gray-700">
              <div className="px-4 py-2 border-b border-gray-700">
                <h3 className="text-white font-semibold">Elements</h3>
              </div>
              <div className="p-4 space-y-1">
                {elements.map((element) => (
                  <div key={element.id} className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">▶</span>
                    <span className="text-blue-400">&lt;{element.tag}&gt;</span>
                    <span className="text-gray-300">({element.children.length} children)</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <div className="px-4 py-2 border-b border-gray-700">
                <h3 className="text-white font-semibold">Styles</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">color:</span>
                    <span className="text-blue-400">#ffffff</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">background:</span>
                    <span className="text-blue-400">transparent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">font-size:</span>
                    <span className="text-blue-400">14px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-gray-700">
              <h3 className="text-white font-semibold">Performance</h3>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Memory Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Used:</span>
                      <span className="text-green-400">256 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Available:</span>
                      <span className="text-blue-400">8.2 GB</span>
                    </div>
                  </div>
                </div>
                <div className="glass rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">CPU Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current:</span>
                      <span className="text-yellow-400">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Peak:</span>
                      <span className="text-red-400">45%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Page Load Times</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">DOM Content Loaded:</span>
                    <span className="text-green-400">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Window Load:</span>
                    <span className="text-blue-400">2.8s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">First Paint:</span>
                    <span className="text-yellow-400">0.8s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperTools; 