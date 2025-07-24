import React, { useState, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import { MdExtension } from 'react-icons/md';

const Navbar = ({ openExtensionsPanel }) => {
  const { tabs, activeTabId, updateTabUrl, refreshPage, goBack, goForward } = useTabs();
  const [inputUrl, setInputUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Only show URL in search bar if it's a real website (not homepage or search results)
  useEffect(() => {
    if (!isEditing && activeTab) {
      // Only show URL if it's a real website, not the homepage or search results
      if (activeTab.url && 
          activeTab.url !== 'noxx://homepage' && 
          !activeTab.url.startsWith('http') && 
          !activeTab.url.startsWith('https')) {
        setInputUrl('');
      } else if (activeTab.url && 
                 (activeTab.url.startsWith('http') || activeTab.url.startsWith('https'))) {
        setInputUrl(activeTab.url);
      } else {
        setInputUrl('');
      }
    }
  }, [activeTab, isEditing]);

  // Don't render until tabs are initialized
  if (!activeTabId || tabs.length === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-3 text-white">
        <div className="spinner mr-2"></div>
        <span>Loading NoxX Browser...</span>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔍 Search form submitted with:', inputUrl);
    console.log('🔍 Active tab ID:', activeTabId);
    console.log('🔍 Active tab:', activeTab);
    console.log('🔍 All tabs:', tabs);
    if (inputUrl.trim()) {
      console.log('🔍 Calling updateTabUrl with:', activeTabId, inputUrl);
      // Update the active tab's URL
      updateTabUrl(activeTabId, inputUrl);
      setIsEditing(false);
      // Clear the input after search
      setInputUrl('');
    } else {
      console.log('🔍 Empty input, not submitting');
    }
  };

  const handleSearch = () => {
    console.log('🔍 Search button clicked with:', inputUrl);
    console.log('🔍 Active tab ID:', activeTabId);
    console.log('🔍 Active tab:', activeTab);
    console.log('🔍 All tabs:', tabs);
    if (inputUrl.trim()) {
      updateTabUrl(activeTabId, inputUrl);
      setIsEditing(false);
      // Clear the input after search
      setInputUrl('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInputUrl('');
      setIsEditing(false);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Don't restore URL on blur - keep it empty for better UX
    if (!activeTab?.url || 
        activeTab.url === 'noxx://homepage' || 
        (!activeTab.url.startsWith('http') && !activeTab.url.startsWith('https'))) {
      setInputUrl('');
    }
  };

  return (
    <div 
      className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm w-full backdrop-blur-md saturate-180 gap-2 sm:gap-0"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderTop: '1px solid rgba(209, 213, 219, 0.3)',
        WebkitBackdropFilter: 'blur(8px) saturate(180%)',
        color: 'white'
      }}
    >
      {/* Left Navigation */}
      <div className="flex items-center">
        <button onClick={e => { e.currentTarget.classList.remove('animate-bounceOnce'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('animate-bounceOnce'); goBack(); }} style={{ background: 'transparent', border: 'none', padding: '0', margin: '0 14px 0 0', cursor: 'pointer', outline: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button onClick={e => { e.currentTarget.classList.remove('animate-bounceOnce'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('animate-bounceOnce'); goForward(); }} style={{ background: 'transparent', border: 'none', padding: '0', margin: '0 14px 0 0', cursor: 'pointer', outline: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
        <button 
          onClick={e => { e.currentTarget.classList.remove('animate-bounceOnce'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('animate-bounceOnce'); refreshPage(); }}
          style={{ background: 'transparent', border: 'none', padding: '0', margin: '0 14px 0 0', cursor: 'pointer', outline: 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M3 21v-5h5"/>
          </svg>
        </button>
      </div>

      {/* Centered Search Bar */}
      <div className="flex-1 flex justify-center px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur-sm opacity-50"></div>
            <div className="relative backdrop-blur-xl saturate-200 border border-white/40 rounded-full shadow-2xl hover:border-white/60 hover:shadow-3xl transition-all duration-300" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', WebkitBackdropFilter: 'blur(20px) saturate(200%)', boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)' }}>
              <div className="flex items-center px-6 py-3">
                <div className="flex-shrink-0 mr-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Search the web - Powered by Google"
                  className="flex-1 bg-transparent text-white placeholder-white/70 text-sm font-semibold outline-none border-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex-shrink-0 ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Right Extensions */}
      <div className="flex items-center">
        <button 
          className="px-3 py-1.5 backdrop-blur-md saturate-180 border border-white/30 rounded-lg text-xs font-medium transition-all duration-200 text-white hover:border-white/50" 
          style={{ backgroundColor: 'rgba(255, 255, 255, 0)', WebkitBackdropFilter: 'blur(8px) saturate(180%)' }}
          onClick={openExtensionsPanel}
        >
          <MdExtension className="inline mr-1" size={18} /> EXTENSIONS
        </button>
      </div>
    </div>
  );
};

export default Navbar; 