"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import menuData from "./menuData";
import NavAuthenticated from "./NavAuthenticated";
import NavUnauthenticated from "./NavUnauthenticated";
import { useAuth } from "@/app/context/AuthContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const Header = () => {
  const { shouldReduceMotion } = useReducedMotion();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedItem, setFocusedItem] = useState(-1);
  const pathUrl = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleStickyMenu = () => {
      if (window.scrollY >= 80) {
        setStickyMenu(true);
      } else {
        setStickyMenu(false);
      }
    };
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!navigationOpen) return;
      
      switch (e.key) {
        case 'Escape':
          setNavigationOpen(false);
          setFocusedItem(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedItem(prev => (prev < menuData.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedItem(prev => (prev > 0 ? prev - 1 : menuData.length - 1));
          break;
        case 'Enter':
        case ' ':
          if (focusedItem >= 0 && menuData[focusedItem]?.path) {
            e.preventDefault();
            window.location.href = menuData[focusedItem].path;
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigationOpen, focusedItem]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (navigationOpen && !target.closest('header')) {
        setNavigationOpen(false);
        setFocusedItem(-1);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [navigationOpen]);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: shouldReduceMotion ? 0.3 : 0.8, ease: "easeOut" }
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.2 : 0.4 }
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0, y: -20 },
    animate: { opacity: 1, height: "auto", y: 0 },
    exit: { opacity: 0, height: 0, y: -20 },
    transition: { duration: shouldReduceMotion ? 0.2 : 0.4, ease: "easeInOut" }
  };  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={headerVariants}      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        stickyMenu
          ? "bg-white/80 backdrop-blur-xl py-1 sm:py-2 shadow-2xl border-b border-white/20 dark:bg-black/80 dark:border-white/10"
          : "bg-white/60 backdrop-blur-lg py-2 sm:py-4 dark:bg-black/60"
      }`}
      role="banner"
      aria-label="Navegação principal"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Pular para o conteúdo principal
      </a>

      {!shouldReduceMotion && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(234, 88, 12, 0.05) 0%, transparent 50%)`
          }}
          aria-hidden={true}
        />
      )}
      
      <div className="relative mx-auto flex max-w-c-1390 items-center justify-between px-4 md:px-8 2xl:px-0">
        <motion.div 
          className="flex items-center gap-4 relative"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, type: "spring", stiffness: 300 }}
        >
          <Link 
            href="/" 
            className="relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            aria-label="Unindo Destinos - Página inicial"
          >
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-orange-500/10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                aria-hidden={true}
              />
            )}
            <Image
              src="/images/logo/unindo-destinos-logo.png"
            alt="Unindo Destinos - Logo"
            width={120}
            height={35}
            className={`dark:hidden transition-all duration-300 relative z-10 w-20 sm:w-24 md:w-28 lg:w-[120px] h-auto ${
              shouldReduceMotion ? "" : "hover:scale-105"
            }`}
            priority
          />
          <Image
            src="/images/logo/unindo-destinos-logo.png"
            alt="Unindo Destinos - Logo"
            width={120}
            height={35}
            className={`hidden dark:block transition-all duration-300 relative z-10 w-20 sm:w-24 md:w-28 lg:w-[120px] h-auto ${
              shouldReduceMotion ? "" : "hover:scale-105"
            }`}
            priority
          />
        </Link>
      </motion.div>

      <nav 
        className="hidden xl:flex items-center gap-1"
        role="navigation"
        aria-label="Menu principal"
      >
        {menuData.map((menuItem, index) =>
          menuItem.path ? (
            <motion.div
              key={menuItem.id}
              variants={menuItemVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
              className="relative"
            >
              <Link
                href={menuItem.path}                  className={`relative px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-full group ${
                  pathUrl === menuItem.path
                    ? "text-white"
                    : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                }`}
              >
                {pathUrl === menuItem.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                  />
                )}
                
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                <span className="relative z-10">{menuItem.title}</span>
                
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: pathUrl === menuItem.path ? 0 : "70%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          ) : null
        )}
      </nav>
      <motion.div 
        className="flex items-center gap-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0.3 : 0.6 }}
      >
        {isAuthenticated ? (
          <NavAuthenticated />
        ) : (
          <NavUnauthenticated />
        )}
      </motion.div>

      <motion.button
        aria-label="Mobile Menu"
        className="block xl:hidden relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 focus:outline-none overflow-hidden group"
        onClick={() => setNavigationOpen(!navigationOpen)}
        whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
        whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ 
            scale: navigationOpen ? 1 : 0,
            rotate: navigationOpen ? 180 : 0 
          }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-5 h-4">
            <motion.span
              className="absolute left-0 w-5 h-0.5 bg-current rounded-full"
              animate={{
                rotate: navigationOpen ? 45 : 0,
                y: navigationOpen ? 8 : 2,
                scale: navigationOpen ? 0.8 : 1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute left-0 top-2 w-5 h-0.5 bg-current rounded-full"
              animate={{
                opacity: navigationOpen ? 0 : 1,
                x: navigationOpen ? 20 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute left-0 w-5 h-0.5 bg-current rounded-full"
              animate={{
                rotate: navigationOpen ? -45 : 0,
                y: navigationOpen ? -8 : 14,
                scale: navigationOpen ? 0.8 : 1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.button>
    </div>
    <AnimatePresence>
      {navigationOpen && (
        <motion.div
          variants={mobileMenuVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="xl:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl dark:bg-black/95 border-t border-white/20 dark:border-white/10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-orange-500/5 to-transparent" />
          
          <div className="relative container mx-auto px-4 py-8">
            <motion.div className="flex flex-col space-y-2">
              {menuData.map((menuItem, index) =>
                menuItem.path ? (
                  <motion.div
                    key={menuItem.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="relative"
                  >
                    <Link
                      href={menuItem.path}
                      className={`block text-lg font-medium transition-all duration-300 py-4 px-6 rounded-2xl relative group overflow-hidden ${
                        pathUrl === menuItem.path
                          ? "text-white"
                          : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                      }`}
                      onClick={() => setNavigationOpen(false)}
                    >
                      {pathUrl === menuItem.path ? (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-2xl"
                          layoutId="mobileActiveTab"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      
                      <span className="relative z-10 flex items-center">
                        <motion.span
                          className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"
                          whileHover={{ scale: 1.5 }}
                          transition={{ duration: 0.2 }}
                        />
                        {menuItem.title}
                      </span>
                    </Link>
                  </motion.div>
                ) : null
              )}
            </motion.div>
            
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/auth/signin"
                    className="flex items-center justify-center py-3 px-6 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    onClick={() => setNavigationOpen(false)}
                  >
                    <span className="flex items-center">
                      Entrar
                    </span>
                  </Link>
                  
                  <Link
                    href="/auth/signup"
                    className="flex items-center justify-center py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                    onClick={() => setNavigationOpen(false)}
                  >
                    <span className="flex items-center">
                      Criar Conta
                    </span>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.header>
);
};

export default Header;
