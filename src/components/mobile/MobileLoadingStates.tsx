/**
 * Mobile Loading States
 * Skeleton screens and loading indicators for mobile
 */

'use client';

export function SwapInterfaceSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* From Token Card */}
      <div className="bg-white rounded-2xl p-4 space-y-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Flip Button */}
      <div className="flex justify-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
      </div>

      {/* To Token Card */}
      <div className="bg-white rounded-2xl p-4 space-y-3">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Swap Button */}
      <div className="h-14 bg-gray-200 rounded-2xl" />
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header Card */}
      <div className="bg-gray-200 rounded-b-3xl p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-300 rounded" />
        <div className="h-12 w-64 bg-gray-300 rounded" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-gray-300 rounded-xl" />
          <div className="h-16 bg-gray-300 rounded-xl" />
          <div className="h-16 bg-gray-300 rounded-xl" />
        </div>
      </div>

      {/* Token List */}
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-5 w-20 bg-gray-200 rounded ml-auto" />
                <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
              </div>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PriceFeedSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-5 w-24 bg-gray-200 rounded ml-auto" />
            <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-12 bg-gray-200 rounded" />
            <div className="h-8 w-12 bg-gray-200 rounded" />
            <div className="h-8 w-12 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="flex justify-around">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Spinner Loaders
 */
export function SpinnerLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

export function DotsLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`${dotSizes[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`${dotSizes[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`${dotSizes[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  );
}

export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 bg-blue-500 rounded-full opacity-75 animate-ping" />
        <div className="absolute inset-0 bg-blue-500 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Progress Loaders
 */
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}

export function CircularProgress({ progress, size = 'md' }: { progress: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { outer: 40, stroke: 3 },
    md: { outer: 60, stroke: 4 },
    lg: { outer: 80, stroke: 5 },
  };

  const { outer, stroke } = sizes[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={outer} height={outer} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-sm font-bold">{Math.round(progress)}%</span>
    </div>
  );
}

/**
 * Full Page Loaders
 */
export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <PulseLoader size="lg" />
        {message && (
          <p className="text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 z-50 flex items-center justify-center">
      <div className="text-center text-white space-y-6">
        <div className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center text-6xl font-bold text-blue-600 shadow-2xl animate-bounce">
          H
        </div>
        <h1 className="text-3xl font-bold">HyperSwap</h1>
        <DotsLoader size="lg" />
      </div>
    </div>
  );
}

