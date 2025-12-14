import { useEffect, useState, useCallback } from 'react';
import { TelegramWebApp, TelegramUser, TelegramThemeParams } from './types';

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize the WebApp
      tg.ready();
      tg.expand();

      // Apply theme colors if available
      if (tg.themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
      }
      if (tg.themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
      }
      if (tg.themeParams.hint_color) {
        document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
      }
      if (tg.themeParams.button_color) {
        document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
      }
      if (tg.themeParams.button_text_color) {
        document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
      }
      if (tg.themeParams.secondary_bg_color) {
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
      }

      // Set header and background colors for Telegram
      tg.setHeaderColor('#0a0f1a');
      tg.setBackgroundColor('#0a0f1a');

      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Handle viewport changes
      const updateViewport = () => {
        // Telegram webview viewport handling
        const vh = tg.viewportHeight || window.innerHeight;
        document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
      };

      updateViewport();
      window.addEventListener('resize', updateViewport);

      // Enable closing confirmation (optional)
      tg.enableClosingConfirmation();

      return () => {
        window.removeEventListener('resize', updateViewport);
      };
    } else {
      // Not in Telegram environment
      setIsReady(true);
    }
  }, []);

  const sendData = useCallback((data: string) => {
    if (webApp) {
      webApp.sendData(data);
    }
  }, [webApp]);

  const close = useCallback(() => {
    if (webApp) {
      webApp.close();
    }
  }, [webApp]);

  const hapticFeedback = useCallback((type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'warning') => {
    if (webApp?.HapticFeedback) {
      switch (type) {
        case 'impact':
          webApp.HapticFeedback.impactOccurred(style as 'light' | 'medium' | 'heavy' || 'medium');
          break;
        case 'notification':
          webApp.HapticFeedback.notificationOccurred(style as 'error' | 'success' | 'warning' || 'success');
          break;
        case 'selection':
          webApp.HapticFeedback.selectionChanged();
          break;
      }
    }
  }, [webApp]);

  return {
    webApp,
    user,
    isReady,
    isTelegram: !!webApp,
    sendData,
    close,
    hapticFeedback,
  };
}
