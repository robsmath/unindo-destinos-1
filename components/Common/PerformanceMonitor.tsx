"use client";

import { useEffect, useState } from 'react';

// Declaração global para gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: Partial<PerformanceMetrics>) => void;
  enableDeviceInfo?: boolean;
}

const PerformanceMonitor = ({ 
  onMetricsUpdate, 
  enableDeviceInfo = false 
}: PerformanceMonitorProps) => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Função para coletar métricas Web Vitals
    const collectMetrics = () => {
      // FCP - First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      // TTFB - Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const ttfb = navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : 0;

      const newMetrics: Partial<PerformanceMetrics> = {
        fcp: fcpEntry ? fcpEntry.startTime : 0,
        ttfb: ttfb,
      };

      setMetrics(prev => ({ ...prev, ...newMetrics }));
      onMetricsUpdate?.(newMetrics);
    };

    // LCP - Largest Contentful Paint
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          const lcpMetric = { lcp: lastEntry.startTime };
          setMetrics(prev => ({ ...prev, ...lcpMetric }));
          onMetricsUpdate?.(lcpMetric);
        });

        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // Fallback se não suportado
          console.warn('LCP observation not supported');
        }
      }
    };

    // FID - First Input Delay
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const fidMetric = { fid: entry.processingStart - entry.startTime };
            setMetrics(prev => ({ ...prev, ...fidMetric }));
            onMetricsUpdate?.(fidMetric);
          });
        });

        try {
          observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observation not supported');
        }
      }
    };

    // CLS - Cumulative Layout Shift
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries: any[] = [];

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              const firstSessionEntry = sessionEntries[0];
              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

              if (sessionValue && 
                  entry.startTime - lastSessionEntry.startTime < 1000 &&
                  entry.startTime - firstSessionEntry.startTime < 5000) {
                sessionValue += entry.value;
                sessionEntries.push(entry);
              } else {
                sessionValue = entry.value;
                sessionEntries = [entry];
              }

              if (sessionValue > clsValue) {
                clsValue = sessionValue;
                const clsMetric = { cls: clsValue };
                setMetrics(prev => ({ ...prev, ...clsMetric }));
                onMetricsUpdate?.(clsMetric);
              }
            }
          }
        });

        try {
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observation not supported');
        }
      }
    };

    // Coletar informações do dispositivo
    const collectDeviceInfo = () => {
      if (enableDeviceInfo) {
        const info = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          platform: navigator.platform,
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          connection: (navigator as any).connection ? {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
            rtt: (navigator as any).connection.rtt
          } : null,
          memory: (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
          } : null
        };

        setDeviceInfo(info);
      }
    };

    // Aguardar carregamento completo antes de coletar métricas
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    // Iniciar observadores
    observeLCP();
    observeFID();
    observeCLS();
    collectDeviceInfo();    // Enviar métricas para analytics (se configurado)
    const sendToAnalytics = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        Object.entries(metrics).forEach(([key, value]) => {
          if (value > 0) {
            window.gtag!('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: key.toUpperCase(),
              value: Math.round(value),
              custom_parameter: deviceInfo ? JSON.stringify(deviceInfo) : undefined
            });
          }
        });
      }
    };

    // Enviar métricas após 5 segundos
    const analyticsTimer = setTimeout(sendToAnalytics, 5000);

    return () => {
      window.removeEventListener('load', collectMetrics);
      clearTimeout(analyticsTimer);
    };
  }, [onMetricsUpdate, enableDeviceInfo]);

  // Log das métricas no desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && Object.keys(metrics).length > 0) {
      console.group('🚀 Performance Metrics');
      console.table(metrics);
      
      // Análise das métricas
      if (metrics.fcp && metrics.fcp > 2500) {
        console.warn('⚠️ FCP está lento (>2.5s). Considere otimizar o carregamento inicial.');
      }
      
      if (metrics.lcp && metrics.lcp > 4000) {
        console.warn('⚠️ LCP está lento (>4s). Otimize imagens e recursos críticos.');
      }
      
      if (metrics.fid && metrics.fid > 100) {
        console.warn('⚠️ FID está alto (>100ms). Reduza o trabalho da thread principal.');
      }
      
      if (metrics.cls && metrics.cls > 0.25) {
        console.warn('⚠️ CLS está alto (>0.25). Evite mudanças de layout não esperadas.');
      }

      if (deviceInfo) {
        console.group('📱 Device Info');
        console.table(deviceInfo);
        console.groupEnd();
      }
      
      console.groupEnd();
    }
  }, [metrics, deviceInfo]);

  // Componente não renderiza nada visualmente no production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Painel de debug para desenvolvimento
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <h3 className="font-bold mb-2 text-green-400">⚡ Performance</h3>
      <div className="space-y-1">
        {metrics.fcp && (
          <div className={`flex justify-between ${metrics.fcp > 2500 ? 'text-red-400' : 'text-green-400'}`}>
            <span>FCP:</span>
            <span>{Math.round(metrics.fcp)}ms</span>
          </div>
        )}
        {metrics.lcp && (
          <div className={`flex justify-between ${metrics.lcp > 4000 ? 'text-red-400' : 'text-green-400'}`}>
            <span>LCP:</span>
            <span>{Math.round(metrics.lcp)}ms</span>
          </div>
        )}
        {metrics.fid && (
          <div className={`flex justify-between ${metrics.fid > 100 ? 'text-red-400' : 'text-green-400'}`}>
            <span>FID:</span>
            <span>{Math.round(metrics.fid)}ms</span>
          </div>
        )}
        {metrics.cls && (
          <div className={`flex justify-between ${metrics.cls > 0.25 ? 'text-red-400' : 'text-green-400'}`}>
            <span>CLS:</span>
            <span>{metrics.cls.toFixed(3)}</span>
          </div>
        )}
        {metrics.ttfb && (
          <div className={`flex justify-between ${metrics.ttfb > 600 ? 'text-red-400' : 'text-green-400'}`}>
            <span>TTFB:</span>
            <span>{Math.round(metrics.ttfb)}ms</span>
          </div>
        )}
      </div>
      
      {deviceInfo?.connection && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-blue-400 font-bold mb-1">Connection</div>
          <div className="flex justify-between text-blue-300">
            <span>Type:</span>
            <span>{deviceInfo.connection.effectiveType}</span>
          </div>
          <div className="flex justify-between text-blue-300">
            <span>Speed:</span>
            <span>{deviceInfo.connection.downlink}Mbps</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
