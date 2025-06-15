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
  Heart,
  Trash2,
  AlertTriangle,
  EyeOff,
  Loader2
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { UsuarioBloqueadoDTO } from "@/models/UsuarioBloqueadoDTO";
import { listarUsuariosBloqueados, desbloquearUsuario } from "@/services/usuarioBloqueadoService";
import { deletarConta, deletarContaComSenha, validarSenhaParaDeletar, getUsuarioLogado, atualizarVisibilidade } from "@/services/userService";
import { toast } from "sonner";
import Image from "next/image";
import { usePerfil } from "@/app/context/PerfilContext";

type AbaAtiva = "bloqueados" | "privacidade" | "conta";

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
    id: "conta" as const,
    nome: "Conta",
    nomeMobile: "Conta",
    icone: Key,
    descricao: "Configurações da conta e segurança"
  },
];

export default function ConfiguracoesPage() {
  const { isAuthenticated, logout } = useAuth();
  const { usuario, carregarUsuario } = usePerfil();
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("bloqueados");
  const [usuariosBloqueados, setUsuariosBloqueados] = useState<UsuarioBloqueadoDTO[]>([]);
  const [carregandoBloqueados, setCarregandoBloqueados] = useState(false);
  const [desbloqueandoId, setDesbloqueandoId] = useState<number | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  const [atualizandoVisibilidade, setAtualizandoVisibilidade] = useState(false);
  const [showInvisibilityModal, setShowInvisibilityModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (abaAtiva === "bloqueados") {
      carregarUsuariosBloqueados();
    } else if (abaAtiva === "privacidade" && !usuario) {
      carregarUsuario();
    }
  }, [abaAtiva, usuario, carregarUsuario]);

  const handleToggleVisibility = async (invisivel: boolean) => {
    if (invisivel && !usuario?.invisivel) {
      setShowInvisibilityModal(true);
      return;
    }
    
    setAtualizandoVisibilidade(true);
    try {
      await atualizarVisibilidade(invisivel);
      await carregarUsuario(true);
      toast.success(`Visibilidade ${invisivel ? 'desativada' : 'ativada'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar visibilidade:', error);
      toast.error('Erro ao atualizar visibilidade');
    } finally {
      setAtualizandoVisibilidade(false);
    }
  };

  const confirmInvisibility = async () => {
    if (atualizandoVisibilidade) return;
    
    try {
      setAtualizandoVisibilidade(true);
      await atualizarVisibilidade(true);
      await carregarUsuario(true);
      toast.success('Perfil configurado como invisível!');
      setShowInvisibilityModal(false);
    } catch (error: any) {
      console.error('Erro ao atualizar visibilidade:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao atualizar visibilidade';
      toast.error(errorMessage);
    } finally {
      setAtualizandoVisibilidade(false);
    }
  };

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

  const handleDesbloquear = async (id: number) => {
    setDesbloqueandoId(id);
    try {
      await desbloquearUsuario(id);
      setUsuariosBloqueados(prev => prev.filter(u => u.bloqueadoId !== id));
      toast.success("Usuário desbloqueado com sucesso!");
    } catch (error) {
      console.error("Erro ao desbloquear usuário:", error);
      toast.error("Erro ao desbloquear usuário");
    } finally {
      setDesbloqueandoId(null);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteStep(1);
    setShowDeleteModal(true);
  };

  const handleContinueDelete = () => {
    setDeleteStep(2);
    setSenha("");
    setConfirmarSenha("");
  };

  const handleConfirmDelete = async () => {
    if (!senha || !confirmarSenha) {
      toast.error("Por favor, digite a senha nos dois campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setDeletingAccount(true);
    try {
      await deletarContaComSenha(senha);
      
      toast.success("Conta deletada com sucesso!");
      logout(false);
      router.push("/");
    } catch (error: any) {
      console.error("Erro ao deletar conta:", error);
      if (error.response?.status === 401 || error.response?.status === 400) {
        toast.error("Senha incorreta. Tente novamente.");
      } else {
        const errorMessage = error?.response?.data?.message || "Erro ao deletar conta. Tente novamente.";
        toast.error(errorMessage);
      }
    } finally {
      setDeletingAccount(false);
    }
  };

  const resetDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setSenha("");
    setConfirmarSenha("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (isAuthenticated === false) {
    return null;
  }

  const renderBloqueados = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
          Usuários Bloqueados
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Gerencie os usuários que você bloqueou. Você pode desbloqueá-los a qualquer momento.
        </p>
      </div>

      {carregandoBloqueados ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs sm:text-sm text-gray-600">Carregando usuários bloqueados...</p>
          </div>
        </div>
      ) : usuariosBloqueados.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Nenhum usuário bloqueado
          </h4>
          <p className="text-sm text-gray-600 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Você não bloqueou nenhum usuário ainda. Quando bloquear alguém, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {usuariosBloqueados.map((usuario, index) => (
            <motion.div
              key={usuario.bloqueadoId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <Image
                    src={usuario.fotoPerfil || "/images/user/avatar.png"}
                    alt={usuario.nome}
                    width={40}
                    height={40}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-gray-100"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{usuario.nome}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{usuario.email}</p>
                </div>
              </div>

              <motion.button
                onClick={() => handleDesbloquear(usuario.bloqueadoId)}
                disabled={desbloqueandoId === usuario.bloqueadoId}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed text-sm flex-shrink-0 w-full sm:w-auto"
                whileHover={desbloqueandoId !== usuario.bloqueadoId ? { scale: 1.02 } : {}}
                whileTap={desbloqueandoId !== usuario.bloqueadoId ? { scale: 0.98 } : {}}
              >
                {desbloqueandoId === usuario.bloqueadoId ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span className="hidden sm:inline">Desbloquear</span>
                    <span className="sm:hidden">Desbloquear</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPrivacidade = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Configurações de Privacidade
          </h3>
          <p className="text-sm text-gray-600">
            Configure quem pode te ver e interagir com você na plataforma.
          </p>
        </div>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-2xl border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                {usuario?.invisivel ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Perfil Invisível
                </h4>
                <p className="text-xs text-gray-500">
                  Controle sua visibilidade no sistema
                </p>
              </div>
            </div>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => handleToggleVisibility(!usuario?.invisivel)}
                disabled={atualizandoVisibilidade}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                  usuario?.invisivel 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={usuario?.invisivel}
              >
                {atualizandoVisibilidade ? (
                  <Loader2 className="animate-spin w-4 h-4 text-white mx-auto" />
                ) : (
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      usuario?.invisivel ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>
                {usuario?.invisivel 
                  ? "Seu perfil está invisível. Você não aparece nas buscas de outros usuários."
                  : "Ao ativar essa opção, seu perfil e suas viagens não aparecerão para outros usuários nas buscas do sistema."
                }
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    );
  };

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
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-2">Zona de Perigo</h4>
              <h5 className="font-medium text-red-700 mb-3">Deletar Conta Permanentemente</h5>
              <p className="text-sm text-red-700 mb-4">
                Esta ação é <strong>irreversível</strong>. Ao deletar sua conta, você perderá:
              </p>
              <ul className="text-sm text-red-700 mb-6 ml-4 space-y-1">
                <li>• Todas as suas viagens criadas e participações</li>
                <li>• Todas as solicitações enviadas e recebidas</li>
                <li>• Seu histórico de avaliações e comentários</li>
                <li>• Todas as fotos e informações do perfil</li>
                <li>• Todas as conversas e mensagens</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleDeleteAccount}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar Minha Conta
                </motion.button>
                <div className="text-xs text-red-600 self-center">
                  Você precisará confirmar sua senha para continuar
                </div>
              </div>
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
      case "conta":
        return renderConta();
      default:
        return renderBloqueados();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5">
      <div className="absolute inset-0">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-2 mb-8"
          >
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {abas.map((aba) => {
                const IconeAba = aba.icone;
                return (
                  <motion.button
                    key={aba.id}
                    onClick={() => setAbaAtiva(aba.id)}
                    className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex-1 min-w-0 text-xs sm:text-sm lg:text-base ${
                      abaAtiva === aba.id
                        ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: abaAtiva !== aba.id ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconeAba className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">
                      <span className="hidden lg:inline">{aba.nome}</span>
                      <span className="lg:hidden">{aba.nomeMobile}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 lg:p-8"
          >
            {renderConteudo()}
          </motion.div>
        </div>
      </div>

      {/* Modal de Confirmação para Deletar Conta */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {deleteStep === 1 ? (
                // Primeiro passo: Aviso sobre a exclusão
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Confirmar Exclusão da Conta
                      </h3>
                      <p className="text-sm text-gray-600">
                        Esta ação não pode ser desfeita
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <h4 className="font-medium text-red-800 mb-2">⚠️ ATENÇÃO</h4>
                      <p className="text-sm text-red-700 mb-3">
                        Ao deletar sua conta, <strong>TUDO será perdido permanentemente</strong>:
                      </p>
                      <ul className="text-sm text-red-700 space-y-1 ml-4">
                        <li>• Suas viagens criadas serão canceladas</li>
                        <li>• Participações em viagens serão removidas</li>
                        <li>• Solicitações pendentes serão canceladas</li>
                        <li>• Histórico de avaliações será apagado</li>
                        <li>• Fotos e álbum serão deletados</li>
                        <li>• Conversas e mensagens serão perdidas</li>
                        <li>• Dados pessoais serão removidos</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">🚫 NÃO HÁ VOLTA</h4>
                      <p className="text-sm text-yellow-700">
                        Uma vez deletada, sua conta <strong>não poderá ser recuperada</strong>. 
                        Você precisará criar uma nova conta do zero se quiser usar nossa plataforma novamente.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={resetDeleteModal}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      onClick={handleContinueDelete}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continuar
                    </motion.button>
                  </div>
                </div>
              ) : (
                // Segundo passo: Confirmação da senha
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Digite sua Senha
                      </h3>
                      <p className="text-sm text-gray-600">
                        Para confirmar que é você mesmo
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-700 mb-4">
                      Digite sua senha atual <strong>duas vezes</strong> para confirmar a exclusão da conta:
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Senha atual
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                            placeholder="Digite sua senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirme sua senha
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                            placeholder="Digite sua senha novamente"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={resetDeleteModal}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      onClick={handleConfirmDelete}
                      disabled={deletingAccount || !senha || !confirmarSenha}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: deletingAccount ? 1 : 1.02 }}
                      whileTap={{ scale: deletingAccount ? 1 : 0.98 }}
                    >
                      {deletingAccount ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4" />
                          </motion.div>
                          Deletando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Deletar Conta
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvisibilityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInvisibilityModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 400,
                duration: 0.3
              }}
              className="relative w-full max-w-md mx-auto transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      Ficar Invisível
                    </h3>
                    <p className="text-sm text-gray-500">
                      Confirme sua escolha
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200/50">
                    <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2 text-sm">
                      <EyeOff className="w-4 h-4" />
                      O que acontece quando você fica invisível?
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                        Seu perfil não aparecerá nas buscas de outros usuários
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                        Suas viagens criadas também ficarão invisíveis
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                        Você ainda pode ver e participar de outras viagens
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                        Esta configuração pode ser alterada a qualquer momento
                      </li>
                    </ul>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Tem certeza de que deseja ativar o modo invisível? Esta ação pode ser desfeita a qualquer momento retornando a esta configuração.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={() => setShowInvisibilityModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 border border-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={confirmInvisibility}
                    disabled={atualizandoVisibilidade}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: atualizandoVisibilidade ? 1 : 1.02 }}
                    whileTap={{ scale: atualizandoVisibilidade ? 1 : 0.98 }}
                  >
                    {atualizandoVisibilidade ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Confirmando...
                      </>
                    ) : (
                      'Confirmar'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 