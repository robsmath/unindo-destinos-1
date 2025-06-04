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
    icone: ShieldX,
    descricao: "Gerencie usuários que você bloqueou"
  },
  {
    id: "privacidade" as const,
    nome: "Privacidade",
    icone: Eye,
    descricao: "Configure suas preferências de privacidade"
  },
  {
    id: "notificacoes" as const,
    nome: "Notificações",
    icone: Bell,
    descricao: "Personalize suas notificações"
  },
  {
    id: "conta" as const,
    nome: "Conta",
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100">
      {/* Fundo Animado 3D */}
      <div className="absolute inset-0 z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-sky-100/20 via-orange-50/15 to-blue-50/25"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08), rgba(173, 216, 230, 0.12))",
              "linear-gradient(135deg, rgba(255, 165, 0, 0.08), rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08))",
              "linear-gradient(45deg, rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08), rgba(173, 216, 230, 0.12))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Partículas flutuantes */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -100, 0],
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

        {/* Ícones flutuantes */}
        <motion.div
          className="absolute top-32 right-16"
          animate={{ 
            y: [0, -20, 0],
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
            y: [0, -18, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <Shield className="w-9 h-9 text-green-500/30 drop-shadow-lg" />
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
            y: [0, 15, 0],
            rotate: [0, -8, 0]
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
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Bell className="w-8 h-8 text-indigo-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-36 right-64"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Lock className="w-9 h-9 text-teal-500/30 drop-shadow-lg" />
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
      </div>

      <div className="relative z-20 min-h-screen py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <motion.button
              onClick={() => router.back()}
              className="group w-10 h-10 bg-white/95 backdrop-blur-md border border-primary/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white hover:border-primary/20 flex items-center justify-center mb-6"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 text-primary transition-all duration-300" />
            </motion.button>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent mb-2">
              Configurações
            </h1>
            <p className="text-gray-600">
              Gerencie suas preferências e configurações de conta
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
                <nav className="space-y-2">
                  {abas.map((aba) => {
                    const Icon = aba.icone;
                    const isActive = abaAtiva === aba.id;
                    
                    return (
                      <motion.button
                        key={aba.id}
                        onClick={() => setAbaAtiva(aba.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-primary/10 to-orange-500/10 text-primary border border-primary/20"
                            : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-500"}`} />
                        <div>
                          <div className="font-medium text-sm">{aba.nome}</div>
                          <div className="text-xs text-gray-500">{aba.descricao}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Conteúdo Principal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={abaAtiva}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderConteudo()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 