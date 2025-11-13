/**
 * Live Swap Execution Monitor
 * Displays real-time swap execution progress and status
 */

'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SwapStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp?: number;
  txHash?: string;
  error?: string;
}

interface SwapExecution {
  swapId: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  expectedOutput: string;
  steps: SwapStep[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
}

interface LiveSwapMonitorProps {
  swapId: string;
  onComplete?: (execution: SwapExecution) => void;
  onError?: (error: string) => void;
}

export function LiveSwapMonitor({ swapId, onComplete, onError }: LiveSwapMonitorProps) {
  const [execution, setExecution] = useState<SwapExecution | null>(null);
  const [progress, setProgress] = useState(0);

  const { isConnected, lastMessage, sendMessage } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.hyperswap.io/ws',
    autoConnect: true,
  });

  useEffect(() => {
    if (isConnected && swapId) {
      sendMessage({
        type: 'subscribe',
        channel: 'swap-execution',
        params: { swapId },
      });

      return () => {
        sendMessage({
          type: 'unsubscribe',
          channel: 'swap-execution',
          params: { swapId },
        });
      };
    }
  }, [isConnected, swapId, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        if (data.channel === 'swap-execution' && data.swapId === swapId) {
          const updatedExecution: SwapExecution = data.execution;
          setExecution(updatedExecution);

          // Calculate progress
          const completedSteps = updatedExecution.steps.filter(
            s => s.status === 'completed'
          ).length;
          const newProgress = (completedSteps / updatedExecution.steps.length) * 100;
          setProgress(newProgress);

          // Handle completion
          if (updatedExecution.status === 'completed' && onComplete) {
            onComplete(updatedExecution);
          }

          // Handle errors
          if (updatedExecution.status === 'failed' && onError) {
            const failedStep = updatedExecution.steps.find(s => s.status === 'failed');
            onError(failedStep?.error || 'Swap execution failed');
          }
        }
      } catch (err) {
        console.error('Error parsing swap execution data:', err);
      }
    }
  }, [lastMessage, swapId, onComplete, onError]);

  if (!execution) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        <span className="ml-3 text-gray-600">Initializing swap...</span>
      </div>
    );
  }

  const getStepIcon = (status: SwapStep['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'processing':
        return '⏳';
      case 'failed':
        return '✗';
      default:
        return '○';
    }
  };

  const getStepColor = (status: SwapStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600 animate-pulse';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Swap Execution Monitor</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            {execution.fromAmount} {execution.fromToken} → {execution.toToken}
          </span>
          <span className="font-medium">{execution.status.toUpperCase()}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Execution Steps */}
      <div className="space-y-4">
        {execution.steps.map((step, index) => (
          <div key={step.id} className="flex items-start">
            <div className={`text-2xl mr-3 ${getStepColor(step.status)}`}>
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{step.name}</h4>
                  {step.timestamp && (
                    <p className="text-xs text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                {step.status === 'processing' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                )}
              </div>
              
              {step.txHash && (
                <a
                  href={`https://solscan.io/tx/${step.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                >
                  View Transaction →
                </a>
              )}
              
              {step.error && (
                <p className="text-sm text-red-600 mt-1">{step.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {execution.endTime && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Execution Time:</span>
            <span className="font-medium">
              {((execution.endTime - execution.startTime) / 1000).toFixed(2)}s
            </span>
          </div>
          {execution.status === 'completed' && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg text-center">
              <p className="text-green-800 font-medium">
                Expected Output: {execution.expectedOutput} {execution.toToken}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

