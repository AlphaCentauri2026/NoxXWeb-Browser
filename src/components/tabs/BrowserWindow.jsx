import { useTabs } from '../../context/TabContext';
import { useSettings } from '../../context/SettingsContext';
import GlassPanel from '../settings/GlassPanel';
import SearchResults from '../content/SearchResults';
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
    <GlassPanel className="m-2 sm:m-4 p-2 sm:p-6 text-white rounded-lg min-h-[200px] sm:min-h-[400px]">
      {searchQuery ? (
        <SearchResults 
          query={searchQuery} 
          onResultClick={handleSearchResultClick}
        />
      ) : activeTab?.url === 'noxx://homepage' ? (
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">NoxX</span>
          </h1>
          <p className="text-white/70 text-lg mb-6">
            Your premium, customizable web browser
          </p>
          <p className="text-white/50 text-sm">
            Use the search bar above to search the web with Google
          </p>
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