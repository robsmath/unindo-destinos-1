"use client";

import { motion } from "framer-motion";
import { Loader2, Plane, MapPin } from "lucide-react";

interface LoadingProps {
  type?: "default" | "travel" | "booking" | "search";
  message?: string;
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
}

const Loading = ({ 
  type = "default", 
  message, 
  size = "md",
  overlay = false 
}: LoadingProps) => {
  const getIcon = () => {
    switch (type) {
      case "travel":
        return <Plane className="h-8 w-8 text-primary" />;
      case "booking":
        return <MapPin className="h-8 w-8 text-primary" />;
      case "search":
        return <Loader2 className="h-8 w-8 text-primary animate-spin" />;
      default:
        return <Loader2 className="h-8 w-8 text-primary animate-spin" />;
    }
  };

  const getSize = () => {
    switch (size) {
      case "sm":
        return "h-16 w-16";
      case "lg":
        return "h-32 w-32";
      default:
        return "h-24 w-24";
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case "travel":
        return "Preparando sua viagem...";
      case "booking":
        return "Processando reserva...";
      case "search":
        return "Buscando destinos...";
      default:
        return "Carregando...";
    }
  };

  const loadingContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animação do ícone */}
      <motion.div
        className={`${getSize()} flex items-center justify-center bg-primary/10 rounded-full`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: type === "travel" ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {getIcon()}
      </motion.div>

      {/* Pontos de carregamento animados */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Mensagem */}
      <motion.p
        className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {getMessage()}
      </motion.p>

      {/* Barra de progresso opcional */}
      {type === "booking" && (
        <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-live="polite"
        aria-label={getMessage()}
      >
        {loadingContent}
      </motion.div>
    );
  }  return (    <div 
      className="flex items-center justify-center p-8"
      role="status" 
      aria-live={"polite" as "polite"} 
      aria-label={getMessage()}
    >
      {loadingContent}
    </div>
  );
};

export default Loading;
