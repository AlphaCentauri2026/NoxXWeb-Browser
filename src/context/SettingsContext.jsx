import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Theme Settings
    backgroundType: 'video', // 'video', 'image', 'gradient', 'solid'
    backgroundVideo: '/videos/5562986-uhd_3840_2160_24fps (1).mp4',
    backgroundImage: '/backgrounds/default.jpg',
    backgroundColor: '#1a1a1a',
    gradientType: 'radial', // 'linear', 'radial'
    gradientColors: ['#667eea', '#764ba2'],
    
    // Glass Effects
    glassOpacity: 0.1,
    glassBlur: 8,
    glassSaturation: 180,
    glassBorderOpacity: 0.3,
    
    // Tab Settings
    tabShape: 'rounded', // 'rounded', 'square', 'chrome'
    tabHeight: 36,
    tabSpacing: 8,
    tabOverlayOpacity: 0.15,
    
    // UI Settings
    showTabCloseButtons: true,
    showTabIcons: true,
    enableAnimations: true,
    enableHoverEffects: true,
    
    // Privacy Settings
    enableTrackingProtection: true,
    blockThirdPartyCookies: true,
    enableDoNotTrack: true,
    
    // Performance Settings
    enableHardwareAcceleration: true,
    enableWebGL: true,
    maxTabCount: 50,
    
    // Browser Settings
    homepage: 'https://www.google.com',
    searchEngine: 'google', // 'google', 'bing', 'duckduckgo'
    newTabPage: 'https://www.google.com',
    
    // Customization
    customCSS: '',
    customFont: 'Inter',
    fontSize: 14,
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('noxx-browser-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    setSettingsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (settingsLoaded) {
      localStorage.setItem('noxx-browser-settings', JSON.stringify(settings));
    }
  }, [settings, settingsLoaded]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateMultipleSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      backgroundType: 'video',
      backgroundVideo: '/videos/5562986-uhd_3840_2160_24fps (1).mp4',
      backgroundImage: '/backgrounds/default.jpg',
      backgroundColor: '#1a1a1a',
      gradientType: 'radial',
      gradientColors: ['#667eea', '#764ba2'],
      glassOpacity: 0.1,
      glassBlur: 8,
      glassSaturation: 180,
      glassBorderOpacity: 0.3,
      tabShape: 'rounded',
      tabHeight: 36,
      tabSpacing: 8,
      tabOverlayOpacity: 0.15,
      showTabCloseButtons: true,
      showTabIcons: true,
      enableAnimations: true,
      enableHoverEffects: true,
      enableTrackingProtection: true,
      blockThirdPartyCookies: true,
      enableDoNotTrack: true,
      enableHardwareAcceleration: true,
      enableWebGL: true,
      maxTabCount: 50,
      homepage: 'https://www.google.com',
      searchEngine: 'google',
      newTabPage: 'https://www.google.com',
      customCSS: '',
      customFont: 'Inter',
      fontSize: 14,
    };
    setSettings(defaultSettings);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'noxx-browser-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (settingsData) => {
    try {
      const parsed = JSON.parse(settingsData);
      setSettings(prev => ({ ...prev, ...parsed }));
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  const value = {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    exportSettings,
    importSettings,
    settingsLoaded,
  };

  return (
    <SettingsContext.Provider value={value}>
      {settingsLoaded ? children : null}
    </SettingsContext.Provider>
  );
}; 