"use client";

import { useEffect } from "react";

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = (event: AnalyticsEvent) => {
    // Google Analytics 4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // Também enviar para console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  };

  const trackAccessibility = (action: string, details?: Record<string, any>) => {
    trackEvent({
      category: 'accessibility',
      action,
      custom_parameters: {
        ...details,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      },
    });
  };

  const trackPerformance = (metric: string, value: number, details?: Record<string, any>) => {
    trackEvent({
      category: 'performance',
      action: metric,
      value,
      custom_parameters: {
        ...details,
        connection_type: (navigator as any).connection?.effectiveType || 'unknown',
        device_memory: (navigator as any).deviceMemory || 'unknown',
      },
    });
  };

  const trackUserFlow = (flow: string, step: string, details?: Record<string, any>) => {
    trackEvent({
      category: 'user_flow',
      action: `${flow}_${step}`,
      custom_parameters: {
        flow,
        step,
        ...details,
      },
    });
  };

  const trackError = (error: Error, context?: string) => {
    trackEvent({
      category: 'error',
      action: 'application_error',
      label: error.message,
      custom_parameters: {
        error_name: error.name,
        error_stack: error.stack,
        context,
      },
    });
  };

  return {
    trackEvent,
    trackAccessibility,
    trackPerformance,
    trackUserFlow,
    trackError,
  };
};

// Hook para rastrear automaticamente eventos de acessibilidade
export const useAccessibilityTracking = () => {
  const { trackAccessibility } = useAnalytics();

  useEffect(() => {
    // Rastrear uso de teclado
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        trackAccessibility('keyboard_navigation', {
          key: e.key,
          shift_key: e.shiftKey,
          target: e.target instanceof Element ? e.target.tagName : 'unknown',
        });
      }

      // Rastrear teclas de acessibilidade
      if (e.altKey || e.ctrlKey) {
        trackAccessibility('accessibility_shortcut', {
          key_combination: `${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.key}`,
        });
      }
    };

    // Rastrear mudanças de foco
    const handleFocusChange = (e: FocusEvent) => {
      if (e.target instanceof Element) {
        const element = e.target;
        const hasAriaLabel = element.hasAttribute('aria-label');
        const hasAriaDescribedBy = element.hasAttribute('aria-describedby');
        
        trackAccessibility('focus_change', {
          element_type: element.tagName,
          has_aria_label: hasAriaLabel,
          has_aria_described_by: hasAriaDescribedBy,
          is_interactive: ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName),
        });
      }
    };

    // Rastrear preferências do usuário
    const trackUserPreferences = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

      trackAccessibility('user_preferences', {
        prefers_reduced_motion: prefersReducedMotion,
        prefers_high_contrast: prefersHighContrast,
        prefers_dark_mode: prefersDarkMode,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      });
    };

    // Adicionar listeners
    document.addEventListener('keydown', handleKeyboardNavigation);
    document.addEventListener('focusin', handleFocusChange);

    // Rastrear preferências iniciais
    trackUserPreferences();

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
      document.removeEventListener('focusin', handleFocusChange);
    };
  }, [trackAccessibility]);
};

// Componente Analytics Provider
const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  useAccessibilityTracking();

  return <>{children}</>;
};

export default AnalyticsProvider;
