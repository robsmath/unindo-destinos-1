"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface NotificationOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface PushNotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Notificações não são suportadas neste navegador');
    }

    if (permission === 'granted') {
      return permission;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    return result;
  }, [isSupported, permission]);

  const showInAppNotification = useCallback((options: NotificationOptions) => {
    const { title, message, type = 'info', duration = 4000, persistent, action, icon } = options;

    const toastOptions = {
      duration: persistent ? Infinity : duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
      icon,
    };

    switch (type) {
      case 'success':
        return toast.success(title ? `${title}: ${message}` : message, toastOptions);
      case 'error':
        return toast.error(title ? `${title}: ${message}` : message, toastOptions);
      case 'warning':
        return toast.warning(title ? `${title}: ${message}` : message, toastOptions);
      default:
        return toast(title ? `${title}: ${message}` : message, toastOptions);
    }
  }, []);

  const showSystemNotification = useCallback(async (options: NotificationOptions): Promise<void> => {
    if (permission !== 'granted') {
      throw new Error('Permissão para notificações não foi concedida');
    }    const { title = 'Unindo Destinos', message, icon: iconProp = '/icons/icon-192x192.png' } = options;

    const notification = new Notification(title, {
      body: message,
      icon: typeof iconProp === 'string' ? iconProp : '/icons/icon-192x192.png',
      tag: 'unindo-destinos',
      requireInteraction: options.persistent,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.action) {
        options.action.onClick();
      }
    };

    if (!options.persistent && options.duration) {
      setTimeout(() => {
        notification.close();
      }, options.duration);
    }
  }, [permission]);

  const showNotification = useCallback(async (options: NotificationOptions) => {
    showInAppNotification(options);

    if (permission === 'granted' && document.hidden) {
      try {
        await showSystemNotification(options);
      } catch (error) {
        console.warn('Erro ao mostrar notificação do sistema:', error);
      }
    }
  }, [permission, showInAppNotification, showSystemNotification]);

  const subscribeToPush = useCallback(async (vapidKey?: string): Promise<PushSubscription | null> => {
    if (!isSupported || permission !== 'granted') {
      throw new Error('Push notifications não estão disponíveis');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey ? urlBase64ToUint8Array(vapidKey) : undefined,
      });

      setSubscription(sub);
      
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub),
      });

      return sub;
    } catch (error) {
      console.error('Erro ao configurar push notifications:', error);
      throw error;
    }
  }, [isSupported, permission]);

  const unsubscribeFromPush = useCallback(async (): Promise<void> => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        setSubscription(null);
        
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      } catch (error) {
        console.error('Erro ao cancelar push notifications:', error);
        throw error;
      }
    }
  }, [subscription]);

  const sendTestPushNotification = useCallback(async (data: PushNotificationData) => {
    if (!subscription) {
      throw new Error('Não há subscription ativa');
    }

    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          data,
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar push notification:', error);
      throw error;
    }
  }, [subscription]);

  const notificationPresets = {
    success: (message: string) => showNotification({
      type: 'success',
      message,
      duration: 3000,
    }),

    error: (message: string) => showNotification({
      type: 'error',
      message,
      duration: 5000,
    }),

    warning: (message: string) => showNotification({
      type: 'warning',
      message,
      duration: 4000,
    }),

    info: (message: string) => showNotification({
      type: 'info',
      message,
      duration: 4000,
    }),

    bookingConfirmed: () => showNotification({
      title: 'Reserva Confirmada',
      message: 'Sua reserva foi confirmada com sucesso!',
      type: 'success',
      duration: 5000,
      action: {
        label: 'Ver Detalhes',
        onClick: () => window.location.href = '/profile?tab=reservas',
      },
    }),

    tripReminder: (destination: string, date: string) => showNotification({
      title: 'Lembrete de Viagem',
      message: `Sua viagem para ${destination} é em ${date}!`,
      type: 'info',
      persistent: true,
      action: {
        label: 'Ver Roteiro',
        onClick: () => window.location.href = '/viagens',
      },
    }),

    newMessage: (sender: string) => showNotification({
      title: 'Nova Mensagem',
      message: `Você recebeu uma mensagem de ${sender}`,
      type: 'info',
      action: {
        label: 'Ver Mensagem',
        onClick: () => window.location.href = '/central-solicitacoes',
      },
    }),

    connectionRestored: () => showNotification({
      message: 'Conexão com a internet restaurada!',
      type: 'success',
      duration: 2000,
    }),

    connectionLost: () => showNotification({
      message: 'Você está offline. Algumas funcionalidades podem estar limitadas.',
      type: 'warning',
      duration: 3000,
    }),
  };

  return {
    permission,
    isSupported,
    subscription,
    isSubscribed: !!subscription,

    requestPermission,
    showNotification,
    showInAppNotification,
    showSystemNotification,

    subscribeToPush,
    unsubscribeFromPush,
    sendTestPushNotification,

    ...notificationPresets,
  };
}
  
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
