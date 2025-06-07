"use client";

import { useEffect, useState } from "react";

export const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar preferência de movimento reduzido
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    // Detectar mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    const handleResize = () => {
      checkMobile();
    };

    mediaQuery.addEventListener("change", handleMotionChange);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { 
    shouldReduceMotion: shouldReduceMotion || isMobile, // Reduzir movimento em mobile também
    isMobile 
  };
}; 