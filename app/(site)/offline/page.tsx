"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Verificar status da conexão
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline) {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (isOnline) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* Offline Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <WifiOff className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>

        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Você está offline
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Não foi possível conectar à internet. Verifique sua conexão e tente novamente.
          </p>
          {isOnline && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium"
            >
              ✅ Conexão restaurada
            </motion.div>
          )}
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 text-left"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Dicas para voltar online:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Verifique se o Wi-Fi está ativado
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Tente alternar entre Wi-Fi e dados móveis
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Reinicie o roteador se necessário
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Verifique se não há problemas com seu provedor
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Button
            onClick={handleRetry}
            disabled={!isOnline}
            className="w-full flex items-center justify-center gap-2"
            variant="default"
          >
            <RefreshCw className="w-4 h-4" />
            {isOnline ? 'Tentar Novamente' : 'Aguardando conexão...'}
          </Button>

          <Button
            onClick={handleGoHome}
            disabled={!isOnline}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Home className="w-4 h-4" />
            Ir para Home
          </Button>
        </motion.div>

        {/* PWA Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-orange-500/10 dark:from-primary/5 dark:to-orange-500/5 rounded-lg"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 Dica do Unindo Destinos
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Algumas funcionalidades podem estar disponíveis offline. 
            Seus dados serão sincronizados automaticamente quando a conexão for restaurada.
          </p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            isOnline 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`} />
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </motion.div>

        {/* Auto-reload when online */}
        {isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400"
          >
            Recarregando automaticamente em 3 segundos...
          </motion.div>
        )}
      </motion.div>

      {/* Auto-reload script */}
      {isOnline && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                if (navigator.onLine) {
                  window.location.reload();
                }
              }, 3000);
            `
          }}
        />
      )}
    </div>
  );
}
