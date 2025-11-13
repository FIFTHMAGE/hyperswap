'use client';

import { motion } from 'framer-motion';
import { SwapRoute } from '@/lib/types/swap';

interface Props {
  routes: SwapRoute[];
  inputSymbol: string;
  outputSymbol: string;
}

export function RouteVisualization({ routes, inputSymbol, outputSymbol }: Props) {
  if (routes.length === 0) {
    return null;
  }

  const isDirect = routes.length === 1;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Routing Path {isDirect ? '(Direct)' : `(${routes.length} hops)`}
        </h3>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Optimized for best price
        </span>
      </div>

      {/* Visual Route */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Start Token */}
        <div className="flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {inputSymbol}
            </span>
          </div>
        </div>

        {routes.map((route, index) => (
          <div key={index} className="flex items-center gap-2 flex-shrink-0">
            {/* Arrow with protocol */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 whitespace-nowrap">
                {route.protocol}
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className="h-0.5 w-8 bg-blue-500" />
                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-blue-500" />
              </motion.div>
              {route.percentage < 100 && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {route.percentage}%
                </div>
              )}
            </div>

            {/* Intermediate or End Token */}
            {index < routes.length - 1 ? (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 shadow-sm">
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  {route.tokenOut.slice(0, 6)}...
                </span>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {outputSymbol}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Route Details */}
      <div className="mt-4 space-y-2">
        {routes.map((route, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 rounded-lg p-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-semibold">
                {index + 1}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                via {route.protocol}
              </span>
            </div>
            {route.poolAddress && (
              <span className="text-gray-500 dark:text-gray-500 font-mono">
                {route.poolAddress.slice(0, 6)}...{route.poolAddress.slice(-4)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Info Banner */}
      {routes.length > 2 && (
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg p-2">
          💡 This trade routes through multiple pools to get you the best price
        </div>
      )}
    </motion.div>
  );
}

