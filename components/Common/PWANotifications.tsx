"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Wifi, WifiOff, RefreshCw, X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

const PWANotifications = () => {
  const { isInstallable, isOnline, isUpdateAvailable, installPWA, updatePWA } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      // Mostrar prompt de instalação após 10 segundos
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotice(true);
    } else {
      setShowOfflineNotice(false);
    }
  }, [isOnline]);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [isUpdateAvailable]);

  const handleInstall = async () => {
    await installPWA();
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    updatePWA();
    setShowUpdatePrompt(false);
  };

  return (
    <>
      <AnimatePresence>
        {/* Notificação de Instalação PWA */}
        {showInstallPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Instalar Unindo Destinos
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Instale nosso app para uma experiência ainda melhor, com acesso offline e notificações.
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={handleInstall}
                      className="px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                    >
                      Instalar
                    </button>
                    <button
                      onClick={() => setShowInstallPrompt(false)}
                      className="px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
                    >
                      Agora não
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Fechar notificação"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notificação de Status Offline */}
        {showOfflineNotice && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Você está offline. Algumas funcionalidades podem estar limitadas.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notificação de Atualização Disponível */}
        {showUpdatePrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Atualização Disponível
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    Uma nova versão do app está disponível com melhorias e correções.
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={handleUpdate}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Atualizar
                    </button>
                    <button
                      onClick={() => setShowUpdatePrompt(false)}
                      className="px-3 py-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm transition-colors"
                    >
                      Depois
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="flex-shrink-0 text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"
                  aria-label="Fechar notificação"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de Status de Conexão Fixo */}
      <div className="fixed top-4 right-4 z-40">
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-red-500 text-white p-2 rounded-full shadow-lg"
              title="Sem conexão"
            >
              <WifiOff className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PWANotifications;
