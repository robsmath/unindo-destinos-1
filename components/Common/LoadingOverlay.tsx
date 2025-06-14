"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MapPin, Plane, Clock, CheckCircle } from "lucide-react";

const frases = [
  { text: "Gerando seu roteiro de viagem...", icon: Plane, color: "from-blue-500 to-cyan-500" },
  { text: "Analisando preferências...", icon: Clock, color: "from-purple-500 to-pink-500" },
  { text: "Buscando melhores destinos...", icon: MapPin, color: "from-orange-500 to-red-500" },
  { text: "Finalizando detalhes...", icon: CheckCircle, color: "from-green-500 to-emerald-500" },
];

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay = ({ isVisible, message }: LoadingOverlayProps) => {
  const [fraseAtual, setFraseAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFraseAtual((prev) => (prev + 1) % frases.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  if (!isVisible) return null;

  const fraseInfo = frases[fraseAtual];
  const IconeAtual = fraseInfo.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b)",
            "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6)",
            "linear-gradient(135deg, #ec4899, #f59e0b, #3b82f6, #8b5cf6)",
            "linear-gradient(180deg, #f59e0b, #3b82f6, #8b5cf6, #ec4899)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ opacity: 0.05 }}
      />
      
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col items-center justify-center text-center min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={fraseAtual}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6, damping: 12 }}
            className="mb-8 flex justify-center"
          >
            <div className={`p-4 rounded-3xl bg-gradient-to-r ${fraseInfo.color} shadow-xl`}>
              <IconeAtual className="h-10 w-10 text-white" />
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="relative mb-8 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-gray-200">
            <div className={`w-full h-full border-4 border-t-transparent rounded-full bg-gradient-to-r ${fraseInfo.color}`}></div>
          </div>
        </motion.div>

        <div className="flex justify-center space-x-3 mb-8">
          {frases.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === fraseAtual 
                  ? `bg-gradient-to-r ${fraseInfo.color} shadow-lg` 
                  : "bg-gray-300"
              }`}
              animate={index === fraseAtual ? { 
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              } : { 
                scale: 1,
                opacity: 0.5
              }}
              transition={{ 
                duration: 1, 
                repeat: index === fraseAtual ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="mb-8 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={fraseAtual}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center w-full"
            >
              <h2 className={`text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r ${fraseInfo.color} bg-clip-text text-transparent`}>
                {message || fraseInfo.text}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {message ? "Por favor, aguarde..." : "Estamos preparando a melhor experiência!"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${fraseInfo.color}`}
            animate={{ 
              x: ["-100%", "100%"] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: "50%" }}
          />
        </div>

        <motion.p
          key={fraseAtual}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm text-gray-500 font-medium"
        >
          Processando...
        </motion.p>
      </div>      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + (i * 0.5),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            style={{
              left: `${15 + (i * 12)}%`,
              top: `${25 + (i * 10)}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
