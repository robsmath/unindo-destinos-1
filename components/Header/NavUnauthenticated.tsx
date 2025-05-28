"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NavUnauthenticated = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4">
      {pathname !== "/auth/signin" && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Link
            href="/auth/signin"
            className="relative group flex items-center justify-center rounded-full border-2 border-primary/30 px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-500 hover:border-primary hover:shadow-lg hover:shadow-primary/25 overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-black/50"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m0 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Entrar
            </span>
            
            {/* Magic hover background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"
              initial={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            />
          </Link>
        </motion.div>
      )}

      {pathname !== "/auth/signup" && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Link
            href="/auth/signup"
            className="relative group flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-500 hover:shadow-xl hover:shadow-primary/40 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Criar Conta
            </span>
            
            {/* Pulsing background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Sparkle effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 25}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}                />
              ))}
            </motion.div>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default NavUnauthenticated;
