import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const GlassPanel = ({ children, className = '', style = {}, ...props }) => {
  const { settings } = useSettings();
  const glassStyle = {
    background: `rgba(255,255,255,${settings.glassOpacity})`,
    backdropFilter: `blur(${settings.glassBlur}px) saturate(${settings.glassSaturation}%)`,
    border: `1px solid rgba(255,255,255,${settings.glassBorderOpacity})`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    borderRadius: 16,
    ...style,
  };
  return (
    <div className={`glass-panel ${className}`} style={glassStyle} {...props}>
      {children}
    </div>
  );
};

export default GlassPanel; 