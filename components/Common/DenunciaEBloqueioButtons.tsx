"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
  usuario: UsuarioBuscaDTO;
  onDenunciar: (usuario: { id: number; nome: string }) => void;
  onBloquear: (usuario: { id: number; nome: string }) => void;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  className?: string;
}

export default function DenunciaEBloqueioButtons({
  usuario,
  onDenunciar,
  onBloquear,
  size = "md",
  layout = "horizontal",
  className = "",
}: Props) {
  const { usuario: usuarioLogado } = useAuth();

  // Não mostrar os botões para o próprio usuário
  if (usuarioLogado?.id === usuario.id) {
    return null;
  }

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const containerClasses = layout === "horizontal" 
    ? "flex items-center gap-2" 
    : "flex flex-col gap-2";

  const handleDenunciar = () => {
    onDenunciar({
      id: usuario.id,
      nome: usuario.nome,
    });
  };

  const handleBloquear = () => {
    onBloquear({
      id: usuario.id,
      nome: usuario.nome,
    });
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Botão Denunciar */}
      <motion.button
        title="Denunciar usuário"
        onClick={handleDenunciar}
        className={`relative ${sizeClasses[size]} bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl flex items-center justify-center text-orange-600 hover:text-orange-700 transition-all duration-300 group/btn`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AlertTriangle className={iconSizes[size]} />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-600/0 group-hover/btn:from-orange-500/10 group-hover/btn:to-orange-600/10 transition-all duration-300" />
      </motion.button>

      {/* Botão Bloquear */}
      <motion.button
        title="Bloquear usuário"
        onClick={handleBloquear}
        className={`relative ${sizeClasses[size]} bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-300 group/btn`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Shield className={iconSizes[size]} />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover/btn:from-red-500/10 group-hover/btn:to-red-600/10 transition-all duration-300" />
      </motion.button>
    </div>
  );
} 