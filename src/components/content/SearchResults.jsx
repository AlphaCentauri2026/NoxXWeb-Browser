import React, { useEffect, useState } from 'react';

const SearchResults = ({ query, onResultClick }) => {
  const [loading, setLoading] = useState(false);

  console.log('🔍 SearchResults rendered with query:', query);

  useEffect(() => {
    if (!query) return;

    console.log('🔍 SearchResults useEffect triggered with query:', query);
    setLoading(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [query]);

  const handleResultClick = (url) => {
    console.log('🔗 Opening result:', url);
    if (onResultClick) {
      onResultClick(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const openGoogleSearch = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
  };

  if (!query) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Enter a search query to get started</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-2">
            Search Results for "{query}"
          </h2>
          <p className="text-white/70 text-sm">
            Powered by Google Search
          </p>
          <div className="mt-2">
            <div className="spinner inline-block mr-2"></div>
            <span className="text-white/70">Loading results...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Search Results for "{query}"
        </h2>
        <p className="text-white/70 text-sm">
          Powered by Google Search
        </p>
      </div>
      
      {/* Search Results Interface */}
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Google Search Results
              </h3>
              <p className="text-white/70 text-sm">
                Choose how you want to view your search results
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={openGoogleSearch}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              View Full Search Results on Google
            </button>
            
            <div className="text-center">
              <p className="text-white/50 text-xs">
                Opens in a new tab for the complete Google search experience
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search Suggestions */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-3">Quick Search Options</h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank')}
              className="px-3 py-2 bg-red-500/20 text-white rounded text-sm hover:bg-red-500/30 transition-colors"
            >
              Search YouTube
            </button>
            <button 
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=vid`, '_blank')}
              className="px-3 py-2 bg-blue-500/20 text-white rounded text-sm hover:bg-blue-500/30 transition-colors"
            >
              Search Videos
            </button>
            <button 
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws`, '_blank')}
              className="px-3 py-2 bg-green-500/20 text-white rounded text-sm hover:bg-green-500/30 transition-colors"
            >
              Search News
            </button>
            <button 
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, '_blank')}
              className="px-3 py-2 bg-purple-500/20 text-white rounded text-sm hover:bg-purple-500/30 transition-colors"
            >
              Search Images
            </button>
          </div>
        </div>

        {/* Direct Navigation Option */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-3">Direct Navigation</h4>
          <p className="text-white/70 text-sm mb-3">
            If you know the exact website you want to visit, enter it below:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter website URL (e.g., youtube.com)"
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-blue-400"
            />
            <button 
              onClick={() => {
                const urlInput = document.querySelector('input[placeholder*="website URL"]');
                if (urlInput && urlInput.value.trim()) {
                  let url = urlInput.value.trim();
                  if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                  }
                  if (onResultClick) {
                    onResultClick(url);
                  }
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 