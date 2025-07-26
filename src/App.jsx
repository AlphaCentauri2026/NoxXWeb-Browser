import './index.css';
import { useState, useEffect } from 'react';
import { TabProvider } from "./context/TabContext";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { HistoryProvider } from "./context/HistoryContext";
import TabBar from "./components/tabs/TabBar";
import BrowserWindow from "./components/tabs/BrowserWindow";
import Navbar from "./components/ui/Navbar";
import SettingsPanel from "./components/settings/SettingsPanel";
import ExtensionsPanel from "./components/content/ExtensionsPanel";
import History from "./components/content/History";
import PasswordManager from "./components/security/PasswordManager";
import DeveloperTools from "./components/developer/DeveloperTools";
import ContentBlocker from "./components/privacy/ContentBlocker";
import shortcuts from "./utils/shortcuts";
import { FiSettings, FiShield, FiCode, FiEye } from 'react-icons/fi';

function AppContent() {
  const [showSettings, setShowSettings] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [showPasswordManager, setShowPasswordManager] = useState(false);
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);
  const [showContentBlocker, setShowContentBlocker] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    // Listen for keyboard shortcuts
    const handleShortcut = (event) => {
      const { action } = event.detail;
      switch (action) {
        case 'openSettings':
          setShowSettings(true);
          break;
        case 'devTools':
          setShowDeveloperTools(true);
          break;
        case 'passwordManager':
          setShowPasswordManager(true);
          break;
        case 'contentBlocker':
          setShowContentBlocker(true);
          break;
        case 'closeModal':
          setShowSettings(false);
          setShowExtensions(false);
          setShowPasswordManager(false);
          setShowDeveloperTools(false);
          setShowContentBlocker(false);
          setShowHistory(false);
          break;
        default:
          console.log('Shortcut action:', action);
      }
    };
    document.addEventListener('browserShortcut', handleShortcut);
    return () => {
      document.removeEventListener('browserShortcut', handleShortcut);
    };
  }, []);

  // Render background based on settings
  let backgroundElement = null;
  if (settings.backgroundType === "video") {
    backgroundElement = (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: "brightness(0.7) contrast(1.1)" }}
        key={settings.backgroundVideo}
      >
        <source src={settings.backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (settings.backgroundType === "image") {
    backgroundElement = (
      <div
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          backgroundImage: `url('${settings.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7) contrast(1.1)",
        }}
      />
    );
  } else if (settings.backgroundType === "gradient") {
    const gradient = settings.gradientType === "radial"
      ? `radial-gradient(circle, ${settings.gradientColors.join(", ")})`
      : `linear-gradient(135deg, ${settings.gradientColors.join(", ")})`;
    backgroundElement = (
      <div
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          background: gradient,
          filter: "brightness(0.7) contrast(1.1)",
        }}
      />
    );
  } else if (settings.backgroundType === "solid") {
    backgroundElement = (
      <div
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          background: settings.backgroundColor,
          filter: "brightness(0.7) contrast(1.1)",
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full text-white relative overflow-hidden">
      {/* Dynamic Background */}
      {backgroundElement}
      {/* Black Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          pointerEvents: 'none'
        }}
      />
      {/* Content Overlay */}
      <div className="relative z-20 w-full h-full">
        <TabProvider>
          <TabBar />
          <Navbar 
            openExtensionsPanel={() => setShowExtensions(true)}
            openHistoryPanel={() => setShowHistory(true)}
          />
          <BrowserWindow />
          
          {/* Toolbar Buttons */}
          <div className="fixed top-4 right-4 flex space-x-2 z-50">
            {/* Password Manager Button */}
            <button
              onClick={() => setShowPasswordManager(true)}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              title="Password Manager (Ctrl+Shift+P)"
            >
              <FiShield size={20} />
            </button>
            
            {/* Developer Tools Button */}
            <button
              onClick={() => setShowDeveloperTools(true)}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              title="Developer Tools (F12)"
            >
              <FiCode size={20} />
            </button>
            
            {/* Content Blocker Button */}
            <button
              onClick={() => setShowContentBlocker(true)}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              title="Content Blocker (Ctrl+Shift+B)"
            >
              <FiEye size={20} />
            </button>
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              title="Open Settings (Ctrl+,)"
            >
              <FiSettings size={20} />
            </button>
          </div>
          {/* Settings Panel Modal */}
          {showSettings && (
            <div className="fixed inset-0 z-50 animate-fadeIn">
              <SettingsPanel />
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-full flex items-center justify-center text-red-200 hover:bg-red-500/30 transition-all duration-200"
                title="Close Settings (Esc)"
              >
                ✕
              </button>
            </div>
          )}
          {/* Extensions Panel Modal */}
          {showExtensions && (
            <div className="fixed inset-0 z-50 animate-fadeIn overflow-y-auto" style={{ maxHeight: '100vh' }}>
              <div className="relative min-h-screen flex flex-col">
                <ExtensionsPanel />
                <button
                  onClick={() => setShowExtensions(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-full flex items-center justify-center text-red-200 hover:bg-red-500/30 transition-all duration-200"
                  title="Close Extensions (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {/* History Panel Modal */}
          {showHistory && (
            <div className="fixed inset-0 z-50 animate-fadeIn overflow-y-auto" style={{ maxHeight: '100vh' }}>
              <div className="relative min-h-screen flex flex-col">
                <History />
                <button
                  onClick={() => setShowHistory(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-full flex items-center justify-center text-red-200 hover:bg-red-500/30 transition-all duration-200"
                  title="Close History (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {/* Password Manager Modal */}
          <PasswordManager 
            isOpen={showPasswordManager} 
            onClose={() => setShowPasswordManager(false)} 
          />
          
          {/* Developer Tools */}
          <DeveloperTools 
            isOpen={showDeveloperTools} 
            onClose={() => setShowDeveloperTools(false)}
            activeTabId={null}
          />
          
          {/* Content Blocker Modal */}
          <ContentBlocker 
            isOpen={showContentBlocker} 
            onClose={() => setShowContentBlocker(false)} 
          />
        </TabProvider>
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <HistoryProvider>
        <AppContent />
      </HistoryProvider>
    </SettingsProvider>
  );
}

export default App;
