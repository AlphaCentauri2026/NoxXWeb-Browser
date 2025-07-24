import React, { useState, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import GlassPanel from '../settings/GlassPanel';

const Bookmarks = () => {
  const { tabs, activeTabId, updateTabUrl } = useTabs();
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', folder: 'default' });
  const [folders, setFolders] = useState(['default', 'work', 'personal', 'social']);
  const [activeFolder, setActiveFolder] = useState('all');

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('noxx-browser-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Failed to parse saved bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('noxx-browser-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Load folders from localStorage
  useEffect(() => {
    const savedFolders = localStorage.getItem('noxx-browser-folders');
    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders));
      } catch (error) {
        console.error('Failed to parse saved folders:', error);
      }
    }
  }, []);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('noxx-browser-folders', JSON.stringify(folders));
  }, [folders]);

  const addBookmark = () => {
    if (newBookmark.title && newBookmark.url) {
      const bookmark = {
        id: Date.now().toString(),
        title: newBookmark.title,
        url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
        folder: newBookmark.folder,
        createdAt: new Date().toISOString(),
        icon: '🌐'
      };
      setBookmarks(prev => [...prev, bookmark]);
      setNewBookmark({ title: '', url: '', folder: 'default' });
      setShowAddForm(false);
    }
  };

  const addCurrentPage = () => {
    if (activeTab && activeTab.url) {
      const bookmark = {
        id: Date.now().toString(),
        title: activeTab.title || activeTab.url,
        url: activeTab.url,
        folder: 'default',
        createdAt: new Date().toISOString(),
        icon: '🌐'
      };
      setBookmarks(prev => [...prev, bookmark]);
    }
  };

  const deleteBookmark = (id) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const editBookmark = (id, updates) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === id ? { ...bookmark, ...updates } : bookmark
    ));
  };

  const addFolder = (folderName) => {
    if (folderName && !folders.includes(folderName)) {
      setFolders(prev => [...prev, folderName]);
    }
  };

  const deleteFolder = (folderName) => {
    if (folderName !== 'default') {
      setFolders(prev => prev.filter(folder => folder !== folderName));
      setBookmarks(prev => prev.map(bookmark => 
        bookmark.folder === folderName ? { ...bookmark, folder: 'default' } : bookmark
      ));
    }
  };

  const navigateToBookmark = (url) => {
    updateTabUrl(activeTabId, url);
  };

  // Filter bookmarks based on search and folder
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = activeFolder === 'all' || bookmark.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const getBookmarksByFolder = () => {
    const grouped = {};
    folders.forEach(folder => {
      grouped[folder] = bookmarks.filter(bookmark => bookmark.folder === folder);
    });
    return grouped;
  };

  return (
    <GlassPanel className="w-full max-w-4xl mx-auto p-6 shadow-2xl">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <span>📚</span>
          <span>Bookmarks</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
          >
            + Add Bookmark
          </button>
          <button
            onClick={addCurrentPage}
            disabled={!activeTab?.url}
            className="px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-lg text-green-200 hover:bg-green-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📌 Add Current Page
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">🔍</span>
        </div>
      </div>

      {/* Add Bookmark Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Bookmark</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={newBookmark.title}
              onChange={(e) => setNewBookmark(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Bookmark title"
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            />
            <input
              type="text"
              value={newBookmark.url}
              onChange={(e) => setNewBookmark(prev => ({ ...prev, url: e.target.value }))}
              placeholder="URL"
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            />
            <select
              value={newBookmark.folder}
              onChange={(e) => setNewBookmark(prev => ({ ...prev, folder: e.target.value }))}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              {folders.map(folder => (
                <option key={folder} value={folder} className="bg-gray-800">
                  {folder.charAt(0).toUpperCase() + folder.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={addBookmark}
              className="px-4 py-2 bg-blue-400/20 border border-blue-400/30 rounded-lg text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
            >
              Add Bookmark
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Folder Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFolder('all')}
            className={`px-3 py-1 rounded-lg border transition-all duration-200 ${
              activeFolder === 'all'
                ? 'bg-blue-400/20 border-blue-400/30 text-blue-200'
                : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
            }`}
          >
            📁 All ({bookmarks.length})
          </button>
          {folders.map(folder => {
            const count = bookmarks.filter(b => b.folder === folder).length;
            return (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-3 py-1 rounded-lg border transition-all duration-200 ${
                  activeFolder === folder
                    ? 'bg-blue-400/20 border-blue-400/30 text-blue-200'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                }`}
              >
                📁 {folder.charAt(0).toUpperCase() + folder.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-4">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <div className="text-4xl mb-4">📚</div>
            <div className="text-lg font-medium mb-2">No bookmarks found</div>
            <div className="text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first bookmark to get started'}
            </div>
          </div>
        ) : (
          filteredBookmarks.map(bookmark => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-xl">{bookmark.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{bookmark.title}</div>
                  <div className="text-sm text-white/70 truncate">{bookmark.url}</div>
                  <div className="text-xs text-white/50 mt-1">
                    📁 {bookmark.folder} • {new Date(bookmark.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateToBookmark(bookmark.url)}
                  className="px-3 py-1 bg-blue-400/20 border border-blue-400/30 rounded text-blue-200 hover:bg-blue-400/30 transition-all duration-200"
                >
                  Open
                </button>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="px-3 py-1 bg-red-400/20 border border-red-400/30 rounded text-red-200 hover:bg-red-400/30 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Folder Management */}
      <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Folder Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium text-white mb-2">Add New Folder</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Folder name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addFolder(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  addFolder(input.value);
                  input.value = '';
                }}
                className="px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-lg text-green-200 hover:bg-green-400/30 transition-all duration-200"
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium text-white mb-2">Delete Folder</h4>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  deleteFolder(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">Select folder to delete</option>
              {folders.filter(folder => folder !== 'default').map(folder => (
                <option key={folder} value={folder} className="bg-gray-800">
                  {folder.charAt(0).toUpperCase() + folder.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-400">{bookmarks.length}</div>
          <div className="text-sm text-white/70">Total Bookmarks</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-green-400">{folders.length}</div>
          <div className="text-sm text-white/70">Folders</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg border border-white/20 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {bookmarks.filter(b => b.folder === 'default').length}
          </div>
          <div className="text-sm text-white/70">Unorganized</div>
        </div>
      </div>
    </GlassPanel>
  );
};

export default Bookmarks; 