'use client';

import { useEffect, useRef } from 'react';
import { TradingViewConfig } from '@/lib/types/chart';

interface Props {
  config: TradingViewConfig;
}

declare global {
  interface Window {
    TradingView?: any;
  }
}

export function TradingViewWidget({ config }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Load TradingView library
    if (!document.getElementById('tradingview-widget-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => initWidget();
      document.head.appendChild(script);
    } else if (window.TradingView) {
      initWidget();
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
      }
    };
  }, [config]);

  const initWidget = () => {
    if (!containerRef.current || !window.TradingView) return;

    // Clear previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
    }

    widgetRef.current = new window.TradingView.widget({
      container_id: containerRef.current.id,
      ...config,
      width: '100%',
      height: 500,
    });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div
        id={`tradingview_${Date.now()}`}
        ref={containerRef}
        className="w-full"
      />
    </div>
  );
}

