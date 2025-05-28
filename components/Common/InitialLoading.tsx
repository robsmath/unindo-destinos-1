"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, MapPin, Users, Star } from 'lucide-react';

interface InitialLoadingProps {
  onLoadingComplete: () => void;
  showProgress?: boolean;
  showTips?: boolean;
}

const InitialLoading = ({ 
  onLoadingComplete, 
  showProgress = true, 
  showTips = true 
}: InitialLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const loadingTips = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: "Descubra Novos Destinos",
      description: "Explore lugares incríveis ao redor do mundo"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Conecte-se com Viajantes",
      description: "Encontre companheiros de viagem e compartilhe experiências"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Planeje sua Aventura",
      description: "Crie roteiros personalizados e organize sua viagem perfeita"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Experiências Únicas",
      description: "Descubra atividades e lugares especiais recomendados por outros viajantes"
    }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onLoadingComplete, 500);
          }, 800);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [onLoadingComplete]);

  useEffect(() => {
    if (!showTips) return;

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 2000);

    return () => clearInterval(tipInterval);
  }, [showTips, loadingTips.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-white to-orange-500/5 dark:from-gray-900 dark:via-black dark:to-gray-800"
        >
          {/* Logo animado */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              {/* Círculo de fundo animado */}
              <motion.div
                className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-primary to-orange-500 rounded-full opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Logo */}
              <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-2xl">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Plane className="h-12 w-12 text-primary" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-2">
              Unindo Destinos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Preparando sua experiência de viagem...
            </p>
          </motion.div>

          {/* Barra de progresso */}
          {showProgress && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-72 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Carregando...</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </motion.div>
          )}

          {/* Dicas de carregamento */}
          {showTips && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="max-w-md text-center"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center space-y-3"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full text-primary">
                    {loadingTips[currentTip].icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {loadingTips[currentTip].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {loadingTips[currentTip].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pontos de carregamento animados */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8 flex space-x-1"
          >
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
          </motion.div>

          {/* Fallback para carregamento muito lento */}
          {progress < 30 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
              onClick={() => {
                setProgress(100);
              }}
              className="absolute bottom-4 right-4 px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Pular carregamento
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoading;
