"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypingEffectProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ 
  texts, 
  speed = 100, 
  deleteSpeed = 50, 
  pauseTime = 2000 
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        
        if (displayText === currentText) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span className="text-primary">
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-primary"
      >
        |
      </motion.span>
    </span>
  );
};

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Icons */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-[10%] text-4xl"
      >
        ✈️
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-32 right-[15%] text-3xl"
      >
        🌍
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-40 left-[20%] text-3xl"
      >
        🗺️
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 25, 0],
          rotate: [0, 15, 0]
        }}
        transition={{ 
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute bottom-32 right-[10%] text-4xl"
      >
        🎒
      </motion.div>

      {/* Gradient Orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-full blur-xl"
      />
      
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-primary/20 rounded-full blur-2xl"
      />
    </div>
  );
};

const EnhancedHero = () => {
  const typingTexts = [
    "novas aventuras",
    "companheiros de viagem",
    "destinos incríveis",
    "experiências únicas",
    "memórias inesquecíveis"
  ];

  return (
    <div className="relative">
      <FloatingElements />
      
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent">
            Conectando você com
          </span>
          <br />
          <TypingEffect texts={typingTexts} />
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 font-medium max-w-3xl mx-auto leading-relaxed"
        >
          Descubra o mundo através dos olhos de outros viajantes apaixonados. 
          Junte-se à maior comunidade de exploradores do Brasil.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(234, 88, 12, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 text-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Comece sua Jornada              <motion.svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                dangerouslySetInnerHTML={{ __html: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />' }}
              />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              borderColor: "rgb(234, 88, 12)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-300 text-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Explorar Destinos              <motion.svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ y: 5 }}
                transition={{ duration: 0.2 }}
                dangerouslySetInnerHTML={{ __html: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />' }}
              />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 border-2 border-white"
                />
              ))}
            </div>
            <span>+5.000 viajantes ativos</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⭐⭐⭐⭐⭐</span>
            <span>4.9/5 avaliação</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌍</span>
            <span>150+ países explorados</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedHero;
