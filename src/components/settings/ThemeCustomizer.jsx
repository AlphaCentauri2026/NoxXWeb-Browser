import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { FiVideo, FiImage, FiFeather, FiGrid, FiCircle, FiSquare, FiGlobe, FiDroplet, FiLayers, FiBookOpen, FiInfo, FiStar, FiLayout, FiColumns, FiAlertCircle } from 'react-icons/fi';
import GlassPanel from './GlassPanel';

const ThemeCustomizer = () => {
  const { settings, updateSetting, updateMultipleSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('background');

  // Local state for animated sliders
  const [glassOpacity, setGlassOpacity] = useState(settings.glassOpacity);
  const [glassBlur, setGlassBlur] = useState(settings.glassBlur);
  const [glassSaturation, setGlassSaturation] = useState(settings.glassSaturation);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(settings.glassBorderOpacity);

  // Animation state for glow effect
  const [animating, setAnimating] = useState({ opacity: false, blur: false, saturation: false, border: false });

  // Sync local state with settings when not animating
  useEffect(() => {
    setGlassOpacity(settings.glassOpacity);
    setGlassBlur(settings.glassBlur);
    setGlassSaturation(settings.glassSaturation);
    setGlassBorderOpacity(settings.glassBorderOpacity);
  }, [settings.glassOpacity, settings.glassBlur, settings.glassSaturation, settings.glassBorderOpacity]);

  // Animation function with ease-out cubic
  const animateValue = (from, to, setter, key, duration = 400) => {
    if (from === to) return;
    setAnimating((prev) => ({ ...prev, [key]: true }));
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const value = from + (to - from) * eased;
      setter(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setter(to);
        setAnimating((prev) => ({ ...prev, [key]: false }));
      }
    };
    requestAnimationFrame(step);
  };

  // Animate all sliders to preset
  const animateToPreset = (preset) => {
    animateValue(glassOpacity, preset.glassOpacity, setGlassOpacity, 'opacity');
    animateValue(glassBlur, preset.glassBlur, setGlassBlur, 'blur');
    animateValue(glassSaturation, preset.glassSaturation, setGlassSaturation, 'saturation');
    animateValue(glassBorderOpacity, preset.glassBorderOpacity, setGlassBorderOpacity, 'border');
    // After animation, update settings context
    setTimeout(() => {
      updateMultipleSettings({
        glassOpacity: preset.glassOpacity,
        glassBlur: preset.glassBlur,
        glassSaturation: preset.glassSaturation,
        glassBorderOpacity: preset.glassBorderOpacity,
      });
    }, 420);
  };

  const backgroundTypes = [
    { id: 'video', label: 'Video', icon: <FiVideo /> },
    { id: 'image', label: 'Image', icon: <FiImage /> },
    { id: 'gradient', label: 'Gradient', icon: <FiFeather /> },
    { id: 'solid', label: 'Solid Color', icon: <FiDroplet /> }
  ];

  const tabShapes = [
    { id: 'rounded', label: 'Rounded', icon: <FiCircle /> },
    { id: 'square', label: 'Square', icon: <FiSquare /> },
    { id: 'custom', label: 'Custom', icon: <FiGlobe /> }
  ];

  const navTabs = [
    { id: 'background', label: 'Background', icon: <FiFeather /> },
    { id: 'glass', label: 'Glass Effects', icon: <FiLayers /> },
    { id: 'tabs', label: 'Tabs', icon: <FiBookOpen /> }
  ];

  const PREINSTALLED_VIDEOS = [
    '/videos/857195-hd_1280_720_25fps.mp4',
    '/videos/1409899-uhd_3840_2160_25fps.mp4',
    '/videos/5562986-uhd_3840_2160_24fps (1).mp4',
    '/videos/9629255-hd_1920_1080_24fps.mp4',
    '/videos/4063585-hd_1920_1080_30fps.mp4',
  ];
  const PREINSTALLED_IMAGES = [
    '/backgrounds/default.jpg',
    // Add more preinstalled images here
  ];

  const GLASS_DEFAULT = { name: 'Default', glassOpacity: 0.1, glassBlur: 8, glassSaturation: 180, glassBorderOpacity: 0.3 };
  const GLASS_PRESETS = [
    GLASS_DEFAULT,
    { name: 'Classic', glassOpacity: 0.1, glassBlur: 8, glassSaturation: 180, glassBorderOpacity: 0.3 },
    { name: 'Frosty', glassOpacity: 0.18, glassBlur: 16, glassSaturation: 220, glassBorderOpacity: 0.18 },
    { name: 'Milky', glassOpacity: 0.22, glassBlur: 12, glassSaturation: 160, glassBorderOpacity: 0.12 },
    { name: 'Crystal', glassOpacity: 0.08, glassBlur: 20, glassSaturation: 250, glassBorderOpacity: 0.22 },
    { name: 'Smoky', glassOpacity: 0.15, glassBlur: 10, glassSaturation: 120, glassBorderOpacity: 0.4 },
    { name: 'Vivid', glassOpacity: 0.13, glassBlur: 14, glassSaturation: 300, glassBorderOpacity: 0.25 },
    { name: 'Subtle', glassOpacity: 0.07, glassBlur: 6, glassSaturation: 140, glassBorderOpacity: 0.09 },
    { name: 'Bold', glassOpacity: 0.25, glassBlur: 18, glassSaturation: 200, glassBorderOpacity: 0.35 },
    { name: 'Dream', glassOpacity: 0.19, glassBlur: 15, glassSaturation: 270, glassBorderOpacity: 0.15 },
    { name: 'Minimal', glassOpacity: 0.05, glassBlur: 4, glassSaturation: 110, glassBorderOpacity: 0.05 },
  ];

  const renderBackgroundSettings = () => (
    <div className="space-y-6">
      {/* Background Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Background Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {backgroundTypes.map(type => (
            <button
              key={type.id}
              onClick={() => updateSetting('backgroundType', type.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                settings.backgroundType === type.id
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Background Type Specific Settings */}
      {settings.backgroundType === 'video' && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Video Settings</h4>
          <input
            type="text"
            value={settings.backgroundVideo}
            onChange={(e) => updateSetting('backgroundVideo', e.target.value)}
            placeholder="Video URL or path"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
          />
          {/* Preinstalled Videos Dropdown */}
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 rounded border border-white/20 bg-white/10 text-white"
              value={PREINSTALLED_VIDEOS.includes(settings.backgroundVideo) ? settings.backgroundVideo : ''}
              onChange={e => updateSetting('backgroundVideo', e.target.value)}
            >
              <option value="">Choose preinstalled video...</option>
              {PREINSTALLED_VIDEOS.map(path => (
                <option key={path} value={path}>{path.split('/').pop()}</option>
              ))}
            </select>
            <span className="text-white/50 text-xs">or</span>
            {/* Hidden file input for custom video */}
            <input
              id="custom-video-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  updateSetting('backgroundVideo', url);
                }
              }}
            />
            <button
              type="button"
              className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200 hover:bg-blue-500/30 transition-all duration-200"
              onClick={() => document.getElementById('custom-video-input').click()}
            >
              Choose from computer
            </button>
          </div>
        </div>
      )}

      {settings.backgroundType === 'image' && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Image Settings</h4>
          <input
            type="text"
            value={settings.backgroundImage}
            onChange={(e) => updateSetting('backgroundImage', e.target.value)}
            placeholder="Image URL or path"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
          />
          {/* Preinstalled Images Dropdown */}
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 rounded border border-white/20 bg-white/10 text-white"
              value={PREINSTALLED_IMAGES.includes(settings.backgroundImage) ? settings.backgroundImage : ''}
              onChange={e => updateSetting('backgroundImage', e.target.value)}
            >
              <option value="">Choose preinstalled image...</option>
              {PREINSTALLED_IMAGES.map(path => (
                <option key={path} value={path}>{path.split('/').pop()}</option>
              ))}
            </select>
            <span className="text-white/50 text-xs">or</span>
            {/* Hidden file input for custom image */}
            <input
              id="custom-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  updateSetting('backgroundImage', url);
                }
              }}
            />
            <button
              type="button"
              className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200 hover:bg-blue-500/30 transition-all duration-200"
              onClick={() => document.getElementById('custom-image-input').click()}
            >
              Choose from computer
            </button>
          </div>
        </div>
      )}

      {settings.backgroundType === 'gradient' && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Gradient Settings</h4>
          <div className="flex gap-3">
            <button
              onClick={() => updateSetting('gradientType', 'linear')}
              className={`px-3 py-2 rounded ${
                settings.gradientType === 'linear'
                  ? 'bg-blue-400/20 border border-blue-400'
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => updateSetting('gradientType', 'radial')}
              className={`px-3 py-2 rounded ${
                settings.gradientType === 'radial'
                  ? 'bg-blue-400/20 border border-blue-400'
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              Radial
            </button>
          </div>
          <div className="flex gap-2">
            {settings.gradientColors.map((color, index) => (
              <input
                key={index}
                type="color"
                value={color}
                onChange={(e) => {
                  const newColors = [...settings.gradientColors];
                  newColors[index] = e.target.value;
                  updateSetting('gradientColors', newColors);
                }}
                className="w-12 h-10 rounded border border-white/20"
              />
            ))}
            <button
              onClick={() => {
                const newColors = [...settings.gradientColors, '#ffffff'];
                updateSetting('gradientColors', newColors);
              }}
              className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white"
            >
              +
            </button>
          </div>
        </div>
      )}

      {settings.backgroundType === 'solid' && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Solid Color</h4>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => updateSetting('backgroundColor', e.target.value)}
            className="w-full h-12 rounded border border-white/20"
          />
        </div>
      )}
    </div>
  );

  const renderGlassSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Glass Effects</h3>
      {/* Glass Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {GLASS_PRESETS.map((preset, idx) => (
          <button
            key={preset.name}
            className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white text-xs hover:bg-blue-400/20 hover:border-blue-400 transition-all duration-150"
            onClick={() => animateToPreset(preset)}
            title={`Preset ${idx + 1}: ${preset.name}`}
          >
            {preset.name}
          </button>
        ))}
      </div>
      {/* Glass Opacity */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Glass Opacity: {Math.round(glassOpacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={glassOpacity}
          onChange={(e) => {
            setGlassOpacity(parseFloat(e.target.value));
            updateSetting('glassOpacity', parseFloat(e.target.value));
          }}
          className={`w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer ${animating.opacity ? 'slider-glow' : ''}`}
        />
      </div>

      {/* Glass Blur */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Glass Blur: {Math.round(glassBlur)}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={glassBlur}
          onChange={(e) => {
            setGlassBlur(parseInt(e.target.value));
            updateSetting('glassBlur', parseInt(e.target.value));
          }}
          className={`w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer ${animating.blur ? 'slider-glow' : ''}`}
        />
      </div>

      {/* Glass Saturation */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Glass Saturation: {Math.round(glassSaturation)}%
        </label>
        <input
          type="range"
          min="100"
          max="300"
          step="10"
          value={glassSaturation}
          onChange={(e) => {
            setGlassSaturation(parseInt(e.target.value));
            updateSetting('glassSaturation', parseInt(e.target.value));
          }}
          className={`w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer ${animating.saturation ? 'slider-glow' : ''}`}
        />
      </div>

      {/* Border Opacity */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Border Opacity: {Math.round(glassBorderOpacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={glassBorderOpacity}
          onChange={(e) => {
            setGlassBorderOpacity(parseFloat(e.target.value));
            updateSetting('glassBorderOpacity', parseFloat(e.target.value));
          }}
          className={`w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer ${animating.border ? 'slider-glow' : ''}`}
        />
      </div>
    </div>
  );

  const renderTabSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Tab Customization</h3>
      
      {/* Tab Shape */}
      <div>
        <h4 className="text-md font-medium text-white mb-3">Tab Shape</h4>
        <div className="grid grid-cols-3 gap-3">
          {tabShapes.map(shape => (
            <button
              key={shape.id}
              onClick={() => updateSetting('tabShape', shape.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                settings.tabShape === shape.id
                  ? 'border-blue-400 bg-blue-400/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <div className="text-xl mb-1">{shape.icon}</div>
              <div className="text-xs">{shape.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Height */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tab Height: {settings.tabHeight}px
        </label>
        <input
          type="range"
          min="24"
          max="48"
          step="2"
          value={settings.tabHeight}
          onChange={(e) => updateSetting('tabHeight', parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Tab Spacing */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tab Spacing: {settings.tabSpacing}px
        </label>
        <input
          type="range"
          min="0"
          max="16"
          step="1"
          value={settings.tabSpacing}
          onChange={(e) => updateSetting('tabSpacing', parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Tab Overlay Opacity */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tab Overlay: {Math.round(settings.tabOverlayOpacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={settings.tabOverlayOpacity}
          onChange={(e) => updateSetting('tabOverlayOpacity', parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Tab Options */}
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.showTabCloseButtons}
            onChange={(e) => updateSetting('showTabCloseButtons', e.target.checked)}
            className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded"
          />
          <span className="text-white">Show Close Buttons</span>
        </label>
        
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.showTabIcons}
            onChange={(e) => updateSetting('showTabIcons', e.target.checked)}
            className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded"
          />
          <span className="text-white">Show Tab Icons</span>
        </label>
      </div>
    </div>
  );

  return (
    <GlassPanel className="w-full max-w-2xl mx-auto p-6 shadow-2xl">
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 p-1 bg-white/10 rounded-lg">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'background' && renderBackgroundSettings()}
        {activeTab === 'glass' && renderGlassSettings()}
        {activeTab === 'tabs' && renderTabSettings()}
      </div>

      {/* Preview Note */}
      <div className="mt-6 p-3 bg-blue-400/20 border border-blue-400/30 rounded-lg">
        <p className="text-sm text-blue-200 flex items-center gap-2">
          <FiAlertCircle className="inline" /> Changes are applied in real-time. Your settings are automatically saved.
        </p>
      </div>
    </GlassPanel>
  );
};

export default ThemeCustomizer; 