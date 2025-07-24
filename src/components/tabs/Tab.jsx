import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { FiHome, FiExternalLink } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Tab = ({ id, title, url, isActive, onClick, onClose, onDetach }) => {
  const { settings } = useSettings();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle detach button click
  const handleDetach = (e) => {
    e.stopPropagation();
    console.log('🔗 Detach button clicked for tab:', id, 'with URL:', url);
    if (onDetach) {
      console.log('🔗 Calling onDetach function for tab:', id);
      onDetach(id);
    } else {
      console.error('❌ onDetach function not available');
    }
  };

  // Determine border radius based on tabShape
  let borderRadius = '12px 12px 0 0';
  if (settings.tabShape === 'square') borderRadius = '0px';
  if (settings.tabShape === 'custom') borderRadius = '16px 16px 0 0';

  // Determine background overlay
  const backgroundColor = isActive
    ? `rgba(255, 255, 255, ${0.2 + (settings.tabOverlayOpacity || 0)})`
    : `rgba(128, 128, 128, ${0.1 + (settings.tabOverlayOpacity || 0)})`;

  // Combine styles properly
  const combinedStyle = {
    ...style,
    height: `${settings.tabHeight || 36}px`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor,
    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
    borderRadius,
    zIndex: isActive ? '20' : '5',
    minWidth: '180px',
    backdropFilter: isActive ? 'blur(8px) saturate(180%)' : 'blur(4px) saturate(120%)',
    WebkitBackdropFilter: isActive ? 'blur(8px) saturate(180%)' : 'blur(4px) saturate(120%)',
    userSelect: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`tab-item ${isActive ? 'active' : ''}`}
      style={combinedStyle}
      title={`${title} - Click to switch, use detach button to open in new window`}
    >
      {/* Tab icon (optional) */}
      {settings.showTabIcons && (
        title === 'Home' ? (
          <FiHome className="mr-2" style={{ fontSize: '16px' }} />
        ) : null
      )}
      
      {/* Tab content */}
      <span
        className="truncate"
        style={{
          maxWidth: '120px',
          minWidth: '120px',
          fontSize: '12px',
          fontWeight: isActive ? '600' : '500',
        }}
      >
        {title}
      </span>
      
      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Detach button (only for non-homepage tabs) */}
        {url && url !== 'noxx://homepage' && (
          <button
            onClick={handleDetach}
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '10px',
              background: 'transparent',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '2px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#3b82f6';
              e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.6)';
              e.target.style.backgroundColor = 'transparent';
            }}
            title="Open in new window"
          >
            <FiExternalLink size={10} />
          </button>
        )}
        
        {/* Close button */}
        {settings.showTabCloseButtons && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '12px',
              fontWeight: '600',
              background: 'transparent',
              border: 'none',
              padding: '0',
              margin: '0',
              outline: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            title="Close tab"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Tab; 