"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Lock } from "lucide-react";

interface OwnershipGuardProps {
  children: React.ReactNode;
  resourceOwnerId: number | undefined;
  resourceType: "viagem" | "pet" | "roteiro" | "usuario";
  resourceId: string | number;
  fallbackRoute?: string;
  loadingComponent?: React.ReactNode;
}

export default function OwnershipGuard({
  children,
  resourceOwnerId,
  resourceType,
  resourceId,
  fallbackRoute,
  loadingComponent
}: OwnershipGuardProps) {
  const { usuario } = useAuth();
  const router = useRouter();
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOwnership = () => {
      if (!usuario || !usuario.id) {
        // Usuário não logado
        setIsOwner(false);
        setIsLoading(false);
        return;
      }

      if (resourceOwnerId === undefined) {
        // Ainda carregando os dados do recurso
        return;
      }

      // Verificar se o usuário é o proprietário
      const userIsOwner = usuario.id === resourceOwnerId;
      setIsOwner(userIsOwner);
      setIsLoading(false);

      if (!userIsOwner) {
        // Não é o proprietário - mostrar erro e redirecionar
        const resourceMessages = {
          viagem: "Você não tem permissão para editar esta viagem. Apenas o criador pode fazer alterações.",
          pet: "Você não tem permissão para editar este pet. Apenas o dono pode fazer alterações.",
          roteiro: "Você não tem permissão para editar este roteiro. Apenas o criador pode fazer alterações.",
          usuario: "Você não tem permissão para editar os dados deste usuário."
        };

        toast.error(resourceMessages[resourceType], {
          duration: 6000,
        });

        toast.warning("Por segurança, você será redirecionado.", {
          duration: 4000,
        });

        // Redirecionar após um breve delay
        setTimeout(() => {
          if (fallbackRoute) {
            router.push(fallbackRoute);
          } else {
            const defaultRoutes = {
              viagem: "/profile?tab=viagens",
              pet: "/profile?tab=meus-pets",
              roteiro: "/profile?tab=viagens",
              usuario: "/profile"
            };
            router.push(defaultRoutes[resourceType]);
          }
        }, 2000);
      }
    };

    checkOwnership();
  }, [usuario, resourceOwnerId, resourceType, resourceId, router, fallbackRoute]);

  // Loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Verificando permissões...
            </h2>
            <p className="text-gray-600">
              Aguarde enquanto verificamos se você tem acesso a este recurso.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Access denied state
  if (isOwner === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-red-100">
        <motion.div
          className="text-center space-y-6 p-8 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Acesso Negado
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Você não tem permissão para acessar este recurso. 
              Apenas o proprietário pode realizar esta ação.
            </p>
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700 mb-1">Por que estou vendo isso?</p>
            <p>Por segurança, restringimos o acesso a recursos que pertencem a outros usuários.</p>
          </div>

          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Access granted - render children
  return <>{children}</>;
} 