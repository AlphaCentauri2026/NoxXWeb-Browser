import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import ThemeCustomizer from './ThemeCustomizer';
import SecurityPanel from '../privacy/SecurityPanel';
import PermissionManager from '../privacy/PermissionManager';
import Bookmarks from '../content/Bookmarks';
import History from '../content/History';
import Downloads from '../content/Downloads';
import ExtensionsPanel from '../content/ExtensionsPanel';
import PerformanceMonitor from '../system/PerformanceMonitor';
import IncognitoBadge from '../system/IncognitoBadge';
import VersionFooter from '../system/VersionFooter';
// Icon imports
import { FiSettings, FiSearch, FiLock, FiUser, FiStar, FiDownload, FiBook, FiShield, FiActivity, FiInfo, FiZap, FiChevronRight, FiCpu, FiEye, FiKey, FiBookmark, FiList, FiBox, FiUserCheck } from 'react-icons/fi';

const tabIcons = {
  theme: <FiEye />,
  security: <FiLock />,
  permissions: <FiKey />,
  bookmarks: <FiBookmark />,
  history: <FiBook />,
  downloads: <FiDownload />,
  extensions: <FiBox />,
  performance: <FiActivity />,
  privacy: <FiUserCheck />,
  about: <FiInfo />,
};

const categoryIcons = {
  appearance: <FiEye />,
  privacy: <FiShield />,
  content: <FiList />,
  system: <FiSettings />,
};

const SettingsPanel = () => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState('theme');
  const [searchTerm, setSearchTerm] = useState('');

  const settingsTabs = [
    {
      id: 'theme',
      label: 'Theme',
      description: 'Customize appearance and backgrounds',
      component: ThemeCustomizer,
      category: 'appearance'
    },
    {
      id: 'security',
      label: 'Security',
      description: 'HTTPS status and security settings',
      component: SecurityPanel,
      category: 'privacy'
    },
    {
      id: 'permissions',
      label: 'Permissions',
      description: 'Manage site permissions',
      component: PermissionManager,
      category: 'privacy'
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      description: 'Organize and manage bookmarks',
      component: Bookmarks,
      category: 'content'
    },
    {
      id: 'history',
      label: 'History',
      description: 'Browse and manage history',
      component: History,
      category: 'content'
    },
    {
      id: 'downloads',
      label: 'Downloads',
      description: 'Manage downloaded files',
      component: Downloads,
      category: 'content'
    },
    {
      id: 'extensions',
      label: 'Extensions',
      description: 'Manage browser extensions',
      component: ExtensionsPanel,
      category: 'content'
    },
    {
      id: 'performance',
      label: 'Performance',
      description: 'Monitor system performance',
      component: PerformanceMonitor,
      category: 'system'
    },
    {
      id: 'privacy',
      label: 'Privacy',
      description: 'Incognito mode and privacy settings',
      component: IncognitoBadge,
      category: 'system'
    },
    {
      id: 'about',
      label: 'About',
      description: 'Browser version and system info',
      component: VersionFooter,
      category: 'system'
    }
  ];

  const categories = [
    { id: 'appearance', label: 'Appearance', icon: categoryIcons.appearance },
    { id: 'privacy', label: 'Privacy & Security', icon: categoryIcons.privacy },
    { id: 'content', label: 'Content Management', icon: categoryIcons.content },
    { id: 'system', label: 'System', icon: categoryIcons.system }
  ];

  // Filter tabs based on search term
  const filteredTabs = settingsTabs.filter(tab => 
    tab.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tab.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tab.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActiveComponent = () => {
    const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
    return activeTabData ? activeTabData.component : ThemeCustomizer;
  };

  const getCategoryTabs = (categoryId) => {
    return filteredTabs.filter(tab => tab.category === categoryId);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : <FiList />;
  };

  const getCategoryLabel = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : 'Other';
  };

  const ActiveComponent = getActiveComponent();

  return (
    <div className="w-full h-screen flex overflow-hidden" style={{
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px) saturate(200%)',
      WebkitBackdropFilter: 'blur(20px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.4)'
    }}>
      {/* Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl"><FiSettings /></span>
            <div>
              <h1 className="text-xl font-bold text-white">Settings</h1>
              <p className="text-sm text-white/70">Customize your browser experience</p>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search settings..."
              className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"><FiSearch /></span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {categories.map(category => {
            const categoryTabs = getCategoryTabs(category.id);
            if (categoryTabs.length === 0) return null;

            return (
              <div key={category.id} className="mb-6">
                <div className="px-6 py-3">
                  <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center space-x-2">
                    <span>{getCategoryIcon(category.id)}</span>
                    <span>{getCategoryLabel(category.id)}</span>
                  </h2>
                </div>
                <div className="space-y-1">
                  {categoryTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full px-6 py-3 text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white/20 border-r-2 border-blue-400 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{tabIcons[tab.id]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {tab.label}
                          </div>
                          <div className="text-xs text-white/50 truncate">
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-sm text-white/70 mb-1">NoxX Browser</div>
            <div className="text-xs text-white/50">Version {settings.version || '1.0.0'}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-white/70">
              <span>Settings</span>
              <span><FiChevronRight /></span>
              <span className="text-white">
                {settingsTabs.find(tab => tab.id === activeTab)?.label || 'Theme'}
              </span>
            </nav>
          </div>

          {/* Active Component */}
          <div className="animate-fadeIn">
            <ActiveComponent />
          </div>
        </div>
      </div>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-6 right-6">
        <div className="relative group">
          <button className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-xl transition-all duration-200 transform hover:scale-110">
            <FiZap />
          </button>
          {/* Quick Actions Menu */}
          <div className="absolute bottom-16 right-0 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-4">
              <h3 className="text-white font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('performance')}
                  className="w-full p-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <FiActivity className="inline mr-2" />Check Performance
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className="w-full p-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <FiLock className="inline mr-2" />Security Status
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="w-full p-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <FiUserCheck className="inline mr-2" />Privacy Mode
                </button>
                <button
                  onClick={() => setActiveTab('downloads')}
                  className="w-full p-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <FiDownload className="inline mr-2" />Downloads
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 