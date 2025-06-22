"use client";

import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings } from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useUnreadGroupMessages } from "@/hooks/useUnreadGroupMessages";
import ChatDropdown from "@/components/Chat/ChatDropdown";

interface TokenPayload {
  sub: string;
  name?: string;
}

const NavAuthenticated = () => {
  const { token, usuario, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const { hasUnreadMessages } = useUnreadMessages(5000);
  const { hasUnreadGroupMessages } = useUnreadGroupMessages(10000);
  const [chatDropdownOpen, setChatDropdownOpen] = useState(false);

  const isValidToken = (token: unknown): token is string => {
    return typeof token === "string" && token.trim() !== "";
  };

  useEffect(() => {
    if (usuario?.nome) {
      const nome = usuario.nome.split(" ")[0];
      setFirstName(nome);
      return;
    }

    if (isValidToken(token)) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);

        if (decoded.name) {
          const nome = decoded.name.split(" ")[0];
          setFirstName(nome);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, [token, usuario]);

  return (
    <div className="relative flex items-center gap-4">
      {firstName && (
        <motion.span 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden text-base font-medium text-gray-700 dark:text-gray-300 xl:block"
        >
          Olá, <span className="text-primary font-semibold">{firstName}</span>
        </motion.span>
      )}

      <div className="relative">
        <ChatDropdown 
          isOpen={chatDropdownOpen}
          onClose={() => setChatDropdownOpen(false)}
          onToggle={() => setChatDropdownOpen(!chatDropdownOpen)}
          hasUnreadMessages={hasUnreadMessages || hasUnreadGroupMessages}
        />
      </div>

      <motion.button
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative flex items-center focus:outline-none group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <Image
            src={usuario?.fotoPerfil?.startsWith("http") ? usuario.fotoPerfil : "/images/user/avatar.png"}
            alt="Avatar"
            width={44}
            height={44}
            className="rounded-full object-cover aspect-square ring-2 ring-gray-200 group-hover:ring-primary transition-all duration-300 shadow-lg sm:w-9 sm:h-9 md:w-11 md:h-11"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white/95 backdrop-blur-lg shadow-2xl ring-1 ring-black/5 z-50 dark:bg-black/95 dark:ring-white/10 overflow-hidden"
          >
            <div className="py-2">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-orange-500/10 hover:text-primary transition-all duration-300 dark:text-gray-200 dark:hover:bg-gray-800/50 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  Perfil
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
              >
                <Link
                  href="/configuracoes"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all duration-300 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors dark:bg-blue-900/20">
                    <Settings className="w-4 h-4 text-blue-500" />
                  </div>
                  Configurações
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 transition-all duration-300 dark:text-gray-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors dark:bg-red-900/20">
                    <LogOut className="w-4 h-4 text-red-500" />
                  </div>
                  Sair
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavAuthenticated;
