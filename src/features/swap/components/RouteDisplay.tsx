/**
 * Swap route display component
 * @module components/swap/RouteDisplay
 */

'use client';

import { styled } from 'nativewind';

interface RouteDisplayProps {
  route: string[];
  className?: string;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({ route, className = '' }) => {
  if (route.length < 2) return null;

  return (
    <div className={`flex items-center gap-2 overflow-x-auto ${className}`}>
      {route.map((token, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap">
            {token}
          </div>
          {index < route.length - 1 && <span className="text-gray-400">→</span>}
        </div>
      ))}
    </div>
  );
};

export default styled(RouteDisplay);
