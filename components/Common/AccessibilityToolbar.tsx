"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, Eye, Volume2, Navigation } from "lucide-react";

const AccessibilityToolbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('accessibility-prefs');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setFontSize(prefs.fontSize || 16);
      setHighContrast(prefs.highContrast || false);
      setReducedMotion(prefs.reducedMotion || false);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReducedMotion(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  useEffect(() => {
    const root = document.documentElement;
    
    root.style.fontSize = `${fontSize}px`;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      root.style.setProperty('--motion-reduce', 'none');
    } else {
      root.style.removeProperty('--motion-reduce');
    }

    const prefs = {
      fontSize,
      highContrast,
      reducedMotion,
    };
    localStorage.setItem('accessibility-prefs', JSON.stringify(prefs));
  }, [fontSize, highContrast, reducedMotion]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Abrir ferramentas de acessibilidade (Alt + A)"
        title="Ferramentas de Acessibilidade (Alt + A)"
      >
        <Eye className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed left-4 bottom-20 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80"
            role="dialog"
            aria-label="Ferramentas de Acessibilidade"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Acessibilidade
                </h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Fechar ferramentas de acessibilidade"
                >
                  ×
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamanho da Fonte
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decreaseFontSize}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                    aria-label="Diminuir fonte"
                  >
                    A-
                  </button>
                  <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {fontSize}px
                  </span>
                  <button
                    onClick={increaseFontSize}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                    aria-label="Aumentar fonte"
                  >
                    A+
                  </button>
                  <button
                    onClick={resetFontSize}
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 text-sm"
                    aria-label="Resetar tamanho da fonte"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={toggleHighContrast}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Alto Contraste
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={toggleReducedMotion}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Reduzir Animações
                  </span>
                </label>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Navegação por Teclado
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>• Tab: Navegar entre elementos</div>
                  <div>• Enter/Espaço: Ativar botões</div>
                  <div>• Esc: Fechar diálogos</div>
                  <div>• Alt + A: Abrir/fechar este painel</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setScreenReader(!screenReader);
                  announceToScreenReader(
                    screenReader 
                      ? "Modo leitor de tela desativado" 
                      : "Modo leitor de tela ativado. Use Tab para navegar e Enter para selecionar."
                  );
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
              >
                <Volume2 className="h-4 w-4" />
                <span className="text-sm">
                  {screenReader ? "Desativar" : "Ativar"} Modo Leitor de Tela
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .high-contrast {
          filter: contrast(150%) brightness(150%);
        }
        
        .high-contrast * {
          text-shadow: none !important;
          box-shadow: none !important;
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default AccessibilityToolbar;
