"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
    <span className="text-primary hero-typing-text">
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
  const { shouldReduceMotion } = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 md:top-20 left-[5%] md:left-[10%] text-2xl md:text-4xl hidden sm:block opacity-30">
          ✈️
        </div>
        <div className="absolute top-20 md:top-28 right-[2%] md:right-[8%] lg:right-[12%] text-xl md:text-3xl hidden sm:block opacity-30">
          🌍
        </div>
        <div className="absolute bottom-32 md:bottom-40 left-[10%] md:left-[20%] text-xl md:text-3xl hidden md:block opacity-30">
          🗺️
        </div>
        <div className="absolute bottom-24 md:bottom-32 right-[5%] md:right-[10%] text-2xl md:text-4xl hidden sm:block opacity-30">
          🎒
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ 
          translateY: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        className="absolute top-16 md:top-20 left-[5%] md:left-[10%] text-2xl md:text-4xl hidden sm:block"
      >
        ✈️
      </motion.div>
        <motion.div
        animate={{ 
          translateY: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
          repeatType: "reverse"
        }}
        className="absolute top-20 md:top-28 right-[2%] md:right-[8%] lg:right-[12%] text-xl md:text-3xl hidden sm:block z-10"
      >
        🌍
      </motion.div>
      
      <motion.div
        animate={{ 
          translateY: [0, -15, 0],
          translateX: [0, 10, 0]
        }}
        transition={{ 
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
          repeatType: "reverse"
        }}
        className="absolute bottom-32 md:bottom-40 left-[10%] md:left-[20%] text-xl md:text-3xl hidden md:block"
      >
        🗺️
      </motion.div>
      
      <motion.div
        animate={{ 
          translateY: [0, 25, 0],
          rotate: [0, 15, 0]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
          repeatType: "reverse"
        }}
        className="absolute bottom-24 md:bottom-32 right-[5%] md:right-[10%] text-2xl md:text-4xl hidden sm:block"
      >
        🎒
      </motion.div>

      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        className="absolute top-8 md:top-10 right-10 md:right-20 w-16 h-16 md:w-32 md:h-32 bg-gradient-to-br from-primary/15 to-orange-500/15 rounded-full blur-xl hidden sm:block"
      />
      
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
          repeatType: "reverse"
        }}
        className="absolute bottom-16 md:bottom-20 left-10 md:left-20 w-20 h-20 md:w-40 md:h-40 bg-gradient-to-br from-orange-500/15 to-primary/15 rounded-full blur-2xl hidden sm:block"
      />
    </div>
  );
};

const EnhancedHero = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { shouldReduceMotion } = useReducedMotion();
  
  const typingTexts = [
    "novas aventuras",
    "companheiros de viagem", 
    "destinos incríveis",
    "experiências únicas",
    "memórias inesquecíveis"
  ];
  const handleComeceJornada = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/auth/signin');
    }
  };

  const handleExplorarDestinos = () => {
    if (isAuthenticated) {
      router.push('/encontrar/viagens');
    } else {
      router.push('/auth/signin');
    }
  };

  const fadeInVariants = {
    initial: { opacity: 0, translateY: shouldReduceMotion ? 0 : 30 },
    animate: { 
      opacity: 1, 
      translateY: 0,
      transition: { duration: shouldReduceMotion ? 0.3 : 0.8 }
    }
  };

  return (
    <div className="relative w-full hero-section">
      <FloatingElements />
      
      <div className="relative z-10 text-center px-4 py-8 md:py-12 hero-main-content">
        <motion.h1
          variants={fadeInVariants}
          initial="initial"
          animate="animate"
          className="hero-main-title font-bold mb-4 md:mb-6 leading-tight max-w-5xl mx-auto hero-content"
        >
          <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent block mb-2 md:mb-0">
            Conectando você com
          </span>
          <div className="hero-typing-container">
            <div className="typing-effect-wrapper">
              <TypingEffect 
                texts={typingTexts} 
                speed={shouldReduceMotion ? 50 : 100}
                deleteSpeed={shouldReduceMotion ? 25 : 50}
              />
            </div>
          </div>
        </motion.h1>
        
        <motion.p
          variants={fadeInVariants}
          initial="initial"
          animate="animate"
          className="hero-description text-gray-600 mb-6 md:mb-8 font-medium max-w-4xl mx-auto leading-relaxed px-2 hero-content"
        >
          Descubra o mundo através dos olhos de outros viajantes apaixonados. 
          Junte-se à maior comunidade de exploradores do Brasil.
        </motion.p>
        
        <motion.div
          variants={fadeInVariants}
          initial="initial"
          animate="animate"
          className="hero-buttons-container px-4"
        >          <motion.button
            onClick={handleComeceJornada}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(234, 88, 12, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center px-6 sm:px-8 py-3 md:py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 text-base md:text-lg overflow-hidden w-full sm:w-auto justify-center hero-interactive"
          >
            <span className="relative z-10 flex items-center">
              Comece sua Jornada
              <motion.svg 
                className="ml-2 w-4 h-4 md:w-5 md:h-5" 
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
            onClick={handleExplorarDestinos}
            whileHover={{ 
              scale: 1.05,
              borderColor: "rgb(234, 88, 12)"
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center px-6 sm:px-8 py-3 md:py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-300 text-base md:text-lg overflow-hidden w-full sm:w-auto justify-center hero-interactive"
          >
            <span className="relative z-10 flex items-center">
              Explorar Destinos
              <motion.svg 
                className="ml-2 w-4 h-4 md:w-5 md:h-5" 
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-8 md:mt-12 hero-social-proof text-xs sm:text-sm text-gray-500 px-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1 md:-space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 border-2 border-white"
                />
              ))}
            </div>
            <span className="whitespace-nowrap">+5.000 viajantes ativos</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⭐⭐⭐⭐⭐</span>
            <span className="whitespace-nowrap">4.9/5 avaliação</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌍</span>
            <span className="whitespace-nowrap">150+ países explorados</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedHero;
