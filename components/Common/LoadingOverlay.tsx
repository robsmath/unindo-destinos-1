"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MapPin, Plane, Clock, CheckCircle } from "lucide-react";

const frases = [
  { text: "Gerando seu roteiro de viagem...", icon: Plane, color: "from-blue-500 to-cyan-500" },
  { text: "Isso pode levar alguns segundos...", icon: Clock, color: "from-purple-500 to-pink-500" },
  { text: "Aguarde mais um pouquinho...", icon: Loader2, color: "from-orange-500 to-red-500" },
  { text: "Está quase pronto!", icon: CheckCircle, color: "from-green-500 to-emerald-500" },
];

const LoadingOverlay = () => {
  const [fraseAtual, setFraseAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFraseAtual((prev) => (prev + 1) % frases.length);
    }, 2500);
    return () => clearInterval(intervalo);
  }, []);

  const fraseInfo = frases[fraseAtual];
  const IconeAtual = fraseInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center px-4"
    >
      {/* Fundo animado com gradiente */}
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
        style={{ opacity: 0.1 }}
      />

      {/* Container principal */}
      <div className="relative z-10 max-w-md w-full">
        {/* Ícone animado */}
        <motion.div
          key={fraseAtual}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <div className={`p-6 rounded-3xl bg-gradient-to-r ${fraseInfo.color} shadow-2xl`}>
            <IconeAtual className="h-12 w-12 text-white animate-pulse" />
          </div>
        </motion.div>

        {/* Spinner principal */}
        <motion.div
          className="relative mb-8 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-20 border-4 border-transparent rounded-full">
            <div className={`w-full h-full border-4 border-t-transparent rounded-full bg-gradient-to-r ${fraseInfo.color} animate-spin`}></div>
          </div>
        </motion.div>

        {/* Pontos de progresso */}
        <div className="flex justify-center space-x-2 mb-8">
          {frases.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === fraseAtual 
                  ? `bg-gradient-to-r ${fraseInfo.color} shadow-lg scale-125` 
                  : "bg-gray-300"
              }`}
              animate={index === fraseAtual ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Texto da frase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={fraseAtual}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${fraseInfo.color} bg-clip-text text-transparent`}>
              {fraseInfo.text}
            </h2>
            <p className="text-gray-600 text-lg">
              Estamos preparando a melhor experiência para você!
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Barra de progresso animada */}
        <div className="mt-8 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${fraseInfo.color} rounded-full`}
            initial={{ width: "0%" }}
            animate={{ width: `${((fraseAtual + 1) / frases.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Percentual */}
        <motion.p
          key={fraseAtual}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 mt-3 font-medium"
        >
          {Math.round(((fraseAtual + 1) / frases.length) * 100)}% concluído
        </motion.p>
      </div>

      {/* Efeitos de partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
