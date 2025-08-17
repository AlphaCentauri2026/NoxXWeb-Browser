import { useTabs } from '../../context/TabContext';
import { useSettings } from '../../context/SettingsContext';
import GlassPanel from '../settings/GlassPanel';
import SearchResults from '../content/SearchResults';
import { FiArrowRight, FiCheckCircle, FiActivity, FiStar } from 'react-icons/fi';
// import '../../styles/glass.css';

const BrowserWindow = () => {
  const { tabs, activeTabId, searchQuery, handleSearchResultClick } = useTabs();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const { settings } = useSettings();

  // Don't render until tabs are initialized
  if (!activeTabId || tabs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white">
        <div className="spinner mr-4"></div>
        <span>Loading NoxX Browser...</span>
      </div>
    );
  }

  const glassStyle = {
    background: `rgba(255,255,255,${settings.glassOpacity})`,
    backdropFilter: `blur(${settings.glassBlur}px) saturate(${settings.glassSaturation}%)`,
    border: `1px solid rgba(255,255,255,${settings.glassBorderOpacity})`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  };

  return (
    <GlassPanel className="m-2 sm:m-4 p-2 sm:p-6 text-white rounded-lg min-h-[200px] sm:min-h-[600px]">
      {searchQuery ? (
        <SearchResults 
          query={searchQuery} 
          onResultClick={handleSearchResultClick}
        />
      ) : activeTab?.url === 'noxx://homepage' ? (
        <div className="flex items-center justify-center min-h-[600px] text-center relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl bg-decorative"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl bg-decorative"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl bg-decorative"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 homepage-content">
            {/* Main Welcome Card */}
            <div className="homepage-card rounded-2xl p-8 mb-8">
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to <span className="gradient-text">NoxX</span>
              </h1>
              
              {/* Primary Tagline */}
              <p className="text-3xl font-semibold text-white/90 mb-8 leading-relaxed">
                Your Premium, Customizable Web Browser
              </p>
              
              {/* Secondary Tagline */}
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Experience the future of browsing with enterprise-grade features and stunning design
              </p>
              
              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
                <p className="text-lg text-white/80 font-medium flex items-center justify-center gap-2">
                  <FiArrowRight className="text-blue-400" size={20} />
                  Use the search bar above to explore the web with Google
                </p>
              </div>
            </div>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="homepage-feature-card rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <FiCheckCircle className="text-4xl text-blue-400" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Privacy First</h3>
                <p className="text-white/70">Advanced security controls and incognito mode</p>
              </div>
              
              <div className="homepage-feature-card rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <FiActivity className="text-4xl text-yellow-400" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-white/70">Built with Electron and React for optimal performance</p>
              </div>
              
              <div className="homepage-feature-card rounded-xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <FiStar className="text-4xl text-purple-400" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Beautiful Design</h3>
                <p className="text-white/70">Glassmorphism UI with premium styling</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-semibold">{activeTab?.title || 'No Tab Selected'}</h1>
          <p className="mt-2 text-sm break-all">{activeTab?.url || ''}</p>
          {/* The real web content is managed by Electron's BrowserView */}
        </>
      )}
    </GlassPanel>
  );
};

export default BrowserWindow; 