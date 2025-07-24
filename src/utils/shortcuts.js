// Keyboard shortcuts utility
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.isEnabled = true;
    this.init();
  }

  init() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    if (!this.isEnabled) return;

    // Don't trigger shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true') {
      return;
    }

    const key = this.getKeyString(event);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      event.preventDefault();
      shortcut.callback(event);
    }
  }

  getKeyString(event) {
    const modifiers = [];
    
    if (event.ctrlKey || event.metaKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey) modifiers.push('Shift');
    
    const key = event.key.toLowerCase();
    modifiers.push(key);
    
    return modifiers.join('+');
  }

  register(keys, callback, description = '') {
    this.shortcuts.set(keys, { callback, description });
  }

  unregister(keys) {
    this.shortcuts.delete(keys);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([keys, { description }]) => ({
      keys,
      description
    }));
  }
}

// Default shortcuts
const defaultShortcuts = {
  // Navigation
  'Ctrl+t': { description: 'New Tab', action: 'newTab' },
  'Ctrl+w': { description: 'Close Tab', action: 'closeTab' },
  'Ctrl+Tab': { description: 'Next Tab', action: 'nextTab' },
  'Ctrl+Shift+Tab': { description: 'Previous Tab', action: 'previousTab' },
  'Ctrl+r': { description: 'Refresh Page', action: 'refresh' },
  'Ctrl+l': { description: 'Focus Address Bar', action: 'focusAddressBar' },
  'F5': { description: 'Refresh Page', action: 'refresh' },
  'F6': { description: 'Focus Address Bar', action: 'focusAddressBar' },
  
  // Navigation History
  'Alt+ArrowLeft': { description: 'Go Back', action: 'goBack' },
  'Alt+ArrowRight': { description: 'Go Forward', action: 'goForward' },
  'Ctrl+Shift+Delete': { description: 'Clear Browsing Data', action: 'clearData' },
  
  // Zoom
  'Ctrl+Plus': { description: 'Zoom In', action: 'zoomIn' },
  'Ctrl+Minus': { description: 'Zoom Out', action: 'zoomOut' },
  'Ctrl+0': { description: 'Reset Zoom', action: 'resetZoom' },
  
  // Settings
  'Ctrl+,': { description: 'Open Settings', action: 'openSettings' },
  'F12': { description: 'Developer Tools', action: 'devTools' },
  
  // Modals
  'Escape': { description: 'Close Modal/Panel', action: 'closeModal' },
  
  // Bookmarks
  'Ctrl+d': { description: 'Add Bookmark', action: 'addBookmark' },
  'Ctrl+Shift+o': { description: 'Open Bookmarks', action: 'openBookmarks' },
  
  // Downloads
  'Ctrl+j': { description: 'Open Downloads', action: 'openDownloads' },
  
  // History
  'Ctrl+h': { description: 'Open History', action: 'openHistory' },
  
  // Extensions
  'Ctrl+Shift+e': { description: 'Open Extensions', action: 'openExtensions' },
  
  // Performance
  'Ctrl+Shift+p': { description: 'Performance Monitor', action: 'performanceMonitor' },
  
  // Privacy
  'Ctrl+Shift+n': { description: 'New Incognito Window', action: 'incognitoMode' },
  
  // System
  'Ctrl+Shift+i': { description: 'System Information', action: 'systemInfo' }
};

// Create and export the shortcuts instance
const shortcuts = new KeyboardShortcuts();

// Register default shortcuts
Object.entries(defaultShortcuts).forEach(([keys, { description, action }]) => {
  shortcuts.register(keys, (event) => {
    // Dispatch custom event that components can listen to
    const customEvent = new CustomEvent('browserShortcut', {
      detail: { action, keys, description }
    });
    document.dispatchEvent(customEvent);
  }, description);
});

export default shortcuts;
export { defaultShortcuts }; 