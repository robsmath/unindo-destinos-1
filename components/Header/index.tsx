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

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0, y: -20 },
    animate: { opacity: 1, height: "auto", y: 0 },
    exit: { opacity: 0, height: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeInOut" }
  };
  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={headerVariants}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        stickyMenu
          ? "bg-white/80 backdrop-blur-xl py-3 shadow-2xl border-b border-white/20 dark:bg-black/80 dark:border-white/10"
          : "bg-white/60 backdrop-blur-lg py-5 dark:bg-black/60"
      }`}
    >
      {/* Magical gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(234, 88, 12, 0.05) 0%, transparent 50%)`
        }}
      />
      
      <div className="relative mx-auto flex max-w-c-1390 items-center justify-between px-4 md:px-8 2xl:px-0">
        {/* Logo with enhanced animations */}
        <motion.div 
          className="flex items-center gap-4 relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <Link href="/" className="relative group">
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <Image
              src="/images/logo/unindo-destinos-logo.png"
              alt="logo"
              width={140}
              height={40}
              className="dark:hidden transition-all duration-300 hover:scale-105 relative z-10"
            />
            <Image
              src="/images/logo/unindo-destinos-logo.png"
              alt="logo dark"
              width={140}
              height={40}
              className="hidden dark:block transition-all duration-300 hover:scale-105 relative z-10"
            />
          </Link>
        </motion.div>

        {/* Enhanced Nav Menu */}
        <nav className="hidden xl:flex items-center gap-2">
          {menuData.map((menuItem, index) =>
            menuItem.path ? (
              <motion.div
                key={menuItem.id}
                variants={menuItemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Link
                  href={menuItem.path}
                  className={`relative px-6 py-3 text-base font-medium tracking-wide transition-all duration-300 rounded-full group ${
                    pathUrl === menuItem.path
                      ? "text-white"
                      : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  }`}
                >
                  {/* Active background */}
                  {pathUrl === menuItem.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full shadow-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Hover background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  <span className="relative z-10">{menuItem.title}</span>
                  
                  {/* Magic underline effect */}
                  <motion.div
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: pathUrl === menuItem.path ? 0 : "70%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ) : null
          )}
        </nav>        {/* Enhanced Auth Buttons */}
        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {isAuthenticated ? (
            <NavAuthenticated />
          ) : (
            <NavUnauthenticated />
          )}
        </motion.div>

        {/* Revolutionary Mobile Button */}
        <motion.button
          aria-label="Mobile Menu"
          className="block xl:hidden relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 focus:outline-none overflow-hidden group"
          onClick={() => setNavigationOpen(!navigationOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Magical background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ 
              scale: navigationOpen ? 1 : 0,
              rotate: navigationOpen ? 180 : 0 
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Animated hamburger lines */}
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
      </div>      {/* Revolutionary Mobile Menu */}
      <AnimatePresence>
        {navigationOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="xl:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl dark:bg-black/95 border-t border-white/20 dark:border-white/10 shadow-2xl"
          >
            {/* Background magic */}
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
                        {/* Active/Hover background */}
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
              
              {/* Mobile Auth Section */}
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
                      className="text-center py-3 px-6 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                      onClick={() => setNavigationOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-center py-3 px-6 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
                      onClick={() => setNavigationOpen(false)}
                    >
                      Criar Conta
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
