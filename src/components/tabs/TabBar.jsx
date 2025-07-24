import { useTabs } from "../../context/TabContext";
import { useSettings } from "../../context/SettingsContext";
import Tab from "./Tab";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

const TabBar = () => {
  const { tabs, activeTabId, addTab, switchTab, closeTab, reorderTabs, detachTab } = useTabs();
  const { settings } = useSettings();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tabs.findIndex(tab => tab.id === active.id);
      const newIndex = tabs.findIndex(tab => tab.id === over.id);
      
      if (reorderTabs) {
        reorderTabs(oldIndex, newIndex);
      }
    }
  };

  const handleDetachTab = (tabId) => {
    console.log('🔗 TabBar: Detaching tab:', tabId);
    if (detachTab) {
      console.log('🔗 TabBar: Calling detachTab function');
      detachTab(tabId);
    } else {
      console.error('❌ TabBar: detachTab function not available');
    }
  };

  // Handle drop for reattaching tabs
  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const tabData = JSON.parse(e.dataTransfer.getData('tab-data'));
      console.log('🔄 Dropped tab data:', tabData);
      
      // Call the reattach function
      if (window.electronAPI) {
        window.electronAPI.reattachTab(tabData);
      }
    } catch (error) {
      console.log('⚠️ No valid tab data in drop:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Don't render until tabs are initialized
  if (!activeTabId || tabs.length === 0) {
    return null;
  }

  return (
    <div 
      className="flex items-end shadow-inner w-full backdrop-blur-md saturate-180 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
        pl-2 pr-2 sm:pl-[90px] sm:pr-[40px] pt-0 mt-0 sm:mt-[-16px] h-12 sm:h-[60px] gap-2 sm:gap-[8px] bg-transparent border-b border-gray-300/30"
      style={{
        WebkitBackdropFilter: 'blur(8px) saturate(180%)'
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tabs.map(tab => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              title={tab.title}
              url={tab.url}
              isActive={tab.id === activeTabId}
              onClick={() => switchTab(tab.id)}
              onClose={() => closeTab(tab.id)}
              onDetach={handleDetachTab}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {/* Add Tab Button */}
      <button
        onClick={() => addTab()}
        style={{
          height: `${settings.tabHeight || 36}px`,
          minWidth: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '8px 8px 0 0',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(4px) saturate(120%)',
          WebkitBackdropFilter: 'blur(4px) saturate(120%)',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.color = 'rgba(255, 255, 255, 0.7)';
        }}
        title="Add new tab"
      >
        +
      </button>
    </div>
  );
};

export default TabBar; 