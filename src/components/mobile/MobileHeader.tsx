/**
 * Mobile Header Component
 * Reusable header for mobile pages
 */

'use client';

export function MobileHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
      <div className="px-4 py-4 flex items-center justify-between">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 text-2xl active:scale-95">
            ←
          </button>
        )}
        <h1 className="text-xl font-bold flex-1 text-center">{title}</h1>
        <div className="w-10" />
      </div>
    </div>
  );
}

