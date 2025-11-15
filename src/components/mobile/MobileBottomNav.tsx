/**
 * Mobile Bottom Navigation
 * Fixed bottom navigation bar for mobile devices
 */

'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

interface MobileBottomNavProps {
  items?: NavItem[];
  showLabels?: boolean;
  activeColor?: string;
}

const DEFAULT_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', path: '/' },
  { id: 'swap', label: 'Swap', icon: '🔄', path: '/swap' },
  { id: 'portfolio', label: 'Portfolio', icon: '💼', path: '/portfolio' },
  { id: 'wrapped', label: 'Wrapped', icon: '🎁', path: '/wrapped' },
  { id: 'more', label: 'More', icon: '☰', path: '/settings' },
];

export function MobileBottomNav({ 
  items = DEFAULT_ITEMS,
  showLabels = true,
  activeColor = 'text-blue-600'
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [ripples, setRipples] = useState<Record<string, boolean>>({});

  const handleItemClick = (item: NavItem) => {
    // Ripple effect
    setRipples(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setRipples(prev => ({ ...prev, [item.id]: false }));
    }, 600);

    // Navigate
    router.push(item.path);
  };

  const isActive = (item: NavItem) => {
    if (item.path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(item.path);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20 md:hidden" />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  relative flex-1 flex flex-col items-center justify-center
                  py-2 px-3 rounded-xl transition-all duration-200
                  active:scale-95
                  ${active ? `${activeColor} bg-blue-50` : 'text-gray-600'}
                `}
              >
                {/* Ripple effect */}
                {ripples[item.id] && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500 opacity-20 animate-ripple" />
                  </div>
                )}

                {/* Icon */}
                <div className="relative text-2xl mb-1">
                  <span>{item.icon}</span>
                  
                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {item.badge > 99 ? '99+' : item.badge}
                    </div>
                  )}

                  {/* Active indicator dot */}
                  {active && !showLabels && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </div>

                {/* Label */}
                {showLabels && (
                  <span className={`
                    text-xs font-medium transition-all
                    ${active ? 'opacity-100 scale-100' : 'opacity-70 scale-95'}
                  `}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/**
 * Floating Action Button
 * Central floating button for primary action
 */
interface FABProps {
  icon: string;
  label?: string;
  onClick: () => void;
  position?: 'center' | 'right';
}

export function FloatingActionButton({ 
  icon, 
  label, 
  onClick,
  position = 'center' 
}: FABProps) {
  const [isPressed, setIsPressed] = useState(false);

  const positionClasses = position === 'center'
    ? 'left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    : 'right-6 -translate-y-1/2';

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        fixed bottom-16 ${positionClasses} z-50
        w-16 h-16 rounded-full
        bg-gradient-to-r from-blue-500 to-purple-500
        text-white shadow-2xl
        flex items-center justify-center
        transition-all duration-200
        ${isPressed ? 'scale-90' : 'scale-100 hover:scale-105'}
        md:hidden
      `}
      style={{
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.5)',
      }}
    >
      <span className="text-3xl">{icon}</span>
      
      {label && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          {label}
        </div>
      )}
    </button>
  );
}

/**
 * Tab Bar with sliding indicator
 */
interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function MobileTabBar({ tabs, activeTab, onChange }: TabBarProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="relative bg-white border-b border-gray-200">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-4 px-4
              font-medium text-sm transition-colors relative
              ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'}
            `}
          >
            {tab.icon && <span className="text-xl">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Sliding indicator */}
      <div
        className="absolute bottom-0 h-1 bg-blue-600 transition-all duration-300 ease-out"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${(100 / tabs.length) * activeIndex}%`,
        }}
      />
    </div>
  );
}

