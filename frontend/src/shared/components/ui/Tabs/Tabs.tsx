import React, { useState, useRef, KeyboardEvent, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface Tab {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Tab label
   */
  label: string;

  /**
   * Tab content
   */
  content: ReactNode;

  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;

  /**
   * Optional icon
   */
  icon?: ReactNode;

  /**
   * Badge content (e.g., notification count)
   */
  badge?: string | number;
}

export interface TabsProps {
  /**
   * Array of tab configurations
   */
  tabs: Tab[];

  /**
   * Currently active tab ID
   */
  activeTab?: string;

  /**
   * Callback when tab changes
   */
  onChange?: (tabId: string) => void;

  /**
   * Tab variant
   */
  variant?: 'default' | 'pills' | 'underline';

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Content container CSS classes
   */
  contentClassName?: string;
}

/**
 * Production-grade Tabs component with keyboard navigation
 *
 * @example
 * <Tabs
 *   tabs={[
 *     { id: 'overview', label: 'Overview', content: <OverviewPanel /> },
 *     { id: 'settings', label: 'Settings', content: <SettingsPanel /> },
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  size = 'md',
  className,
  contentClassName,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  const handleTabChange = (tabId: string) => {
    if (onChange) {
      onChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentEnabledIndex = enabledTabs.findIndex((tab) => tab.id === tabs[currentIndex].id);

    let newIndex = currentEnabledIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    const newTab = enabledTabs[newIndex];
    handleTabChange(newTab.id);
    tabRefs.current[newTab.id]?.focus();
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      tab: cn(
        'border-b-2 -mb-px',
        'transition-colors duration-200'
      ),
      active: 'border-blue-600 text-blue-600',
      inactive: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300',
    },
    pills: {
      container: 'gap-2',
      tab: 'rounded-lg transition-colors duration-200',
      active: 'bg-blue-600 text-white',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    underline: {
      container: 'border-b-2 border-gray-200',
      tab: 'relative transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-colors',
      active: 'text-blue-600 after:bg-blue-600',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}
      <div
        className={cn('flex', styles.container)}
        role="tablist"
        aria-label="Tabs"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              onKeyDown={(e) => !tab.disabled && handleKeyDown(e, index)}
              className={cn(
                // Base styles
                'inline-flex items-center gap-2',
                'font-medium',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',

                // Size
                sizeClasses[size],

                // Variant
                styles.tab,
                isActive ? styles.active : styles.inactive
              )}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center',
                    'px-2 py-0.5',
                    'text-xs font-semibold',
                    'rounded-full',
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeTab}
          className={cn('mt-4', contentClassName)}
          tabIndex={0}
        >
          {tab.id === activeTab && tab.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
