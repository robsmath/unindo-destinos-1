"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
  minLoadTime?: number;
}

export default function LoadingScreen({ onComplete, minLoadTime = 3000 }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minLoadTime - elapsedTime);
          
          setTimeout(onComplete, Math.min(remainingTime, 600));
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete, startTime, minLoadTime]);

  return (    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-orange-500 to-primary flex items-center justify-center px-4"
    >
      <div className="text-center text-white max-w-sm w-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 md:mb-8"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="/images/logo/unindo-destinos-logo.png"
              alt="Unindo Destinos Logo"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl md:text-2xl font-bold mb-4"
        >
          Unindo Destinos
        </motion.h2>

        <div className="w-full max-w-64 h-2 bg-white/20 rounded-full mx-auto mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${count}%` }}
            transition={{ ease: "easeOut" }}
            className="h-full bg-white rounded-full shadow-sm"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-medium mb-2"
        >
          {count}%
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/80 text-sm md:text-base"
        >
          Preparando sua aventura...
        </motion.p>
      </div>
    </motion.div>
  );
}
