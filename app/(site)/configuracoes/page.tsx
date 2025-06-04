"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Users, 
  Key, 
  Eye, 
  Bell, 
  Lock, 
  FileText,
  ArrowLeft,
  ShieldX,
  Unlock,
  Settings,
  Camera,
  Globe,
  Map,
  Compass,
  Luggage,
  Heart
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { UsuarioBloqueadoDTO } from "@/models/UsuarioBloqueadoDTO";
import { listarUsuariosBloqueados, desbloquearUsuario } from "@/services/usuarioBloqueadoService";
import { toast } from "sonner";
import Image from "next/image";

type AbaAtiva = "bloqueados" | "privacidade" | "notificacoes" | "conta";

const abas = [
  {
    id: "bloqueados" as const,
    nome: "Usuários Bloqueados",
    nomeMobile: "Bloq.",
    icone: ShieldX,
    descricao: "Gerencie usuários que você bloqueou"
  },
  {
    id: "privacidade" as const,
    nome: "Privacidade",
    nomeMobile: "Priv.",
    icone: Eye,
    descricao: "Configure suas preferências de privacidade"
  },
  {
    id: "notificacoes" as const,
    nome: "Notificações",
    nomeMobile: "Notif.",
    icone: Bell,
    descricao: "Personalize suas notificações"
  },
  {
    id: "conta" as const,
    nome: "Conta",
    nomeMobile: "Conta",
    icone: Key,
    descricao: "Configurações da conta e segurança"
  },
];

export default function ConfiguracoesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("bloqueados");
  const [usuariosBloqueados, setUsuariosBloqueados] = useState<UsuarioBloqueadoDTO[]>([]);
  const [carregandoBloqueados, setCarregandoBloqueados] = useState(false);
  const [desbloqueandoId, setDesbloqueandoId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (abaAtiva === "bloqueados") {
      carregarUsuariosBloqueados();
    }
  }, [abaAtiva]);

  const carregarUsuariosBloqueados = async () => {
    setCarregandoBloqueados(true);
    try {
      const bloqueados = await listarUsuariosBloqueados();
      setUsuariosBloqueados(bloqueados);
    } catch (error) {
      console.error("Erro ao carregar usuários bloqueados:", error);
      toast.error("Erro ao carregar usuários bloqueados");
    } finally {
      setCarregandoBloqueados(false);
    }
  };

  const handleDesbloquear = async (usuarioId: number, nome: string) => {
    setDesbloqueandoId(usuarioId);
    try {
      await desbloquearUsuario(usuarioId);
      toast.success(`${nome} foi desbloqueado com sucesso!`);
      // Remove da lista local
      setUsuariosBloqueados(prev => prev.filter(u => u.bloqueadoId !== usuarioId));
    } catch (error) {
      console.error("Erro ao desbloquear usuário:", error);
      toast.error("Erro ao desbloquear usuário");
    } finally {
      setDesbloqueandoId(null);
    }
  };

  if (isAuthenticated === false) {
    return null;
  }

  const renderBloqueados = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Usuários Bloqueados
        </h3>
        <p className="text-sm text-gray-600">
          Gerencie os usuários que você bloqueou. Você pode desbloqueá-los a qualquer momento.
        </p>
      </div>

      {carregandoBloqueados ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Carregando usuários bloqueados...</p>
          </div>
        </div>
      ) : usuariosBloqueados.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum usuário bloqueado
          </h4>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Você não bloqueou nenhum usuário ainda. Quando bloquear alguém, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {usuariosBloqueados.map((usuario, index) => (
            <motion.div
              key={usuario.bloqueadoId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={usuario.fotoPerfil || "/images/user/avatar.png"}
                    alt={usuario.nome}
                    width={48}
                    height={48}
                    className="rounded-full object-cover ring-2 ring-gray-100"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{usuario.nome}</h4>
                  <p className="text-sm text-gray-500">{usuario.email}</p>
                </div>
              </div>

              <motion.button
                onClick={() => handleDesbloquear(usuario.bloqueadoId, usuario.nome)}
                disabled={desbloqueandoId === usuario.bloqueadoId}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                whileHover={desbloqueandoId !== usuario.bloqueadoId ? { scale: 1.02 } : {}}
                whileTap={desbloqueandoId !== usuario.bloqueadoId ? { scale: 0.98 } : {}}
              >
                {desbloqueandoId === usuario.bloqueadoId ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Desbloquear
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPrivacidade = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configurações de Privacidade
        </h3>
        <p className="text-sm text-gray-600">
          Configure quem pode te ver e interagir com você na plataforma.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-semibold text-amber-800">Em desenvolvimento</h4>
              <p className="text-sm text-amber-700">
                As configurações de privacidade estarão disponíveis em breve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificacoes = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Preferências de Notificação
        </h3>
        <p className="text-sm text-gray-600">
          Escolha quando e como você quer ser notificado.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-semibold text-amber-800">Em desenvolvimento</h4>
              <p className="text-sm text-amber-700">
                As configurações de notificação estarão disponíveis em breve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConta = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configurações da Conta
        </h3>
        <p className="text-sm text-gray-600">
          Gerencie sua conta e configurações de segurança.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-semibold text-amber-800">Em desenvolvimento</h4>
              <p className="text-sm text-amber-700">
                As configurações da conta estarão disponíveis em breve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConteudo = () => {
    switch (abaAtiva) {
      case "bloqueados":
        return renderBloqueados();
      case "privacidade":
        return renderPrivacidade();
      case "notificacoes":
        return renderNotificacoes();
      case "conta":
        return renderConta();
      default:
        return renderBloqueados();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05))",
              "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05))",
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -90, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Animated icons */}
        <motion.div
          className="absolute top-32 right-16"
          animate={{ 
            y: [0, -18, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Settings className="w-8 h-8 text-orange-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <Shield className="w-7 h-7 text-green-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-48 left-40"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 8, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Key className="w-6 h-6 text-purple-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-24"
          animate={{ 
            y: [0, 12, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Eye className="w-7 h-7 text-red-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-64 right-40"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Bell className="w-6 h-6 text-indigo-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-36 right-64"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Lock className="w-8 h-8 text-teal-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-48"
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8
          }}
        >
          <Users className="w-6 h-6 text-pink-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-72 left-24"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          <FileText className="w-5 h-5 text-cyan-500/30 drop-shadow-lg" />
        </motion.div>

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{ y: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-500/15 to-primary/15 rounded-full blur-2xl pointer-events-none"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 mb-4">
              <Settings className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Configurações</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent mb-4 leading-tight">
              Configurações
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Gerencie suas preferências, privacidade e configurações da conta
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-2 mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {abas.map((aba) => {
                const IconeAba = aba.icone;
                return (
                  <motion.button
                    key={aba.id}
                    onClick={() => setAbaAtiva(aba.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 min-w-0 ${
                      abaAtiva === aba.id
                        ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: abaAtiva !== aba.id ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconeAba className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm lg:text-base">
                      <span className="hidden sm:inline">{aba.nome}</span>
                      <span className="sm:hidden">{aba.nomeMobile}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8"
          >
            {renderConteudo()}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 