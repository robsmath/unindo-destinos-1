"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/services/authService";
import { useAuth } from "@/app/context/AuthContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { 
  Loader2, 
  Plane, 
  MapPin, 
  Compass, 
  Camera, 
  Heart, 
  Globe,
  Map,
  Luggage,
  Bus,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

const Signin = () => {
  const { shouldReduceMotion } = useReducedMotion();
  const [data, setData] = useState({
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect || "/profile");
    }
  }, [isAuthenticated, router, redirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await signIn(data.email, data.senha);
      
      login(response.token, {
        id: response.usuario.id!,
        nome: response.usuario.nome,
        email: response.usuario.email,
        fotoPerfil: response.usuario.fotoPerfil,
      });
      
      toast.success("Login realizado com sucesso!");
      
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      if (error.response?.status === 403) {
        setError("Conta não verificada. Verifique seu e-mail antes de fazer login.");
      } else if (error.response?.status === 401) {
        setError("E-mail ou senha inválidos. Verifique suas credenciais.");
      } else if (error.response?.status === 400) {
        setError("E-mail ou senha inválidos. Verifique suas credenciais.");
      } else if (error.response?.status >= 500) {
        setError("Erro no servidor. Tente novamente mais tarde.");
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        const serverMessage = error.response?.data?.message;
        if (serverMessage && serverMessage.toLowerCase().includes('credenciais')) {
          setError("E-mail ou senha inválidos. Verifique suas credenciais.");
        } else if (serverMessage) {
          setError(serverMessage);
        } else {
          setError("E-mail ou senha inválidos. Verifique suas credenciais.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100 flex flex-col">
      <div className="absolute inset-0 z-10">
        {shouldReduceMotion ? (
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100/15 via-orange-50/10 to-blue-50/20" />
        ) : (
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(45deg, rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08), rgba(173, 216, 230, 0.12))"
            }}
          />
        )}

        {!shouldReduceMotion && Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              translateY: [0, -60, 0],
              translateX: [0, Math.random() * 15 - 7.5, 0],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}

        {shouldReduceMotion ? (
          <>
            <div className="absolute top-24 right-20">
              <Plane className="w-7 h-7 text-orange-500/20 drop-shadow-lg" />
            </div>
            <div className="absolute top-32 left-16">
              <MapPin className="w-8 h-8 text-blue-500/20 drop-shadow-lg" />
            </div>
            <div className="absolute bottom-48 left-20">
              <Compass className="w-9 h-9 text-green-500/20 drop-shadow-lg" />
            </div>
            <div className="absolute top-48 left-40">
              <Camera className="w-6 h-6 text-purple-500/20 drop-shadow-lg" />
            </div>
          </>
        ) : (
          <>
            <motion.div
              className="absolute top-24 right-20"
              animate={{ 
                translateY: [0, -15, 0],
                rotate: [0, 8, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            >
              <Plane className="w-7 h-7 text-orange-500/30 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute top-32 left-16"
              animate={{ 
                translateY: [0, 12, 0],
                rotate: [0, -12, 0]
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
                repeatType: "reverse"
              }}
            >
              <MapPin className="w-8 h-8 text-blue-500/30 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute bottom-48 left-20"
              animate={{ 
                translateY: [0, -18, 0],
                rotate: [0, 15, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
                repeatType: "reverse"
              }}
            >
              <Compass className="w-9 h-9 text-green-500/30 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute top-48 left-40"
              animate={{ 
                translateY: [0, -10, 0],
                translateX: [0, 8, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
                repeatType: "reverse"
              }}
            >
              <Camera className="w-6 h-6 text-purple-500/30 drop-shadow-lg" />
            </motion.div>
          </>
        )}

        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute bottom-40 right-24"
              animate={{ 
                translateY: [0, 15, 0],
                rotate: [0, -8, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
                repeatType: "reverse"
              }}
            >
              <Map className="w-7 h-7 text-red-500/30 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute top-64 right-40"
              animate={{ 
                translateY: [0, -12, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
                repeatType: "reverse"
              }}
            >
              <Luggage className="w-8 h-8 text-indigo-500/30 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute bottom-56 right-48"
              animate={{ 
                translateY: [0, 8, 0],
                translateX: [0, -6, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
                repeatType: "reverse"
              }}
            >
              <Bus className="w-7 h-7 text-yellow-500/30 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute top-36 right-64"
              animate={{ 
                translateY: [0, -20, 0],
                rotate: [0, 180, 0]
              }}
              transition={{ 
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            >
              <Globe className="w-9 h-9 text-teal-500/30 drop-shadow-lg" />
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-48"
              animate={{ 
                translateY: [0, -8, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
                repeatType: "reverse"
              }}
            >
              <Heart className="w-5 h-5 text-pink-500/30 drop-shadow-lg" />
            </motion.div>
          </>
        )}
      </div>

      {loading && (
        <motion.div 
          className="fixed inset-0 bg-white/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="text-center p-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 flex items-center justify-center"
              >
                <Loader2 className="w-12 h-12 text-primary" />
              </motion.div>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">Entrando em sua conta...</p>
            <p className="text-sm text-gray-600">Aguarde um momento</p>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-20 flex-1 flex items-center justify-center p-4 pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto my-4 sm:my-6 md:my-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-3xl" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-5">
                  <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent">
                    Bem-vindo de volta
                  </span>
                </h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  Entre em sua conta e continue sua jornada
                </p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7"
                >
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      required
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 text-sm sm:text-base md:text-lg"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>

                  <div className="relative group">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={data.senha}
                        onChange={(e) => setData({ ...data, senha: e.target.value })}
                        required
                        className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6 pr-12 sm:pr-14 md:pr-16 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 text-sm sm:text-base md:text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 md:right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                  >
                    <p className="text-red-700 text-sm font-medium text-center">{error}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-right"
                >
                  <Link 
                    href="/auth/recuperar-senha" 
                    className="text-primary hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base md:text-lg font-medium hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 sm:py-4 md:py-5 lg:py-6 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg md:text-xl lg:text-2xl relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10">
                    {loading ? "Entrando..." : "Entrar"}
                  </span>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center pt-4 sm:pt-5 md:pt-6 lg:pt-8 border-t border-gray-200/50"
                >
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl">
                    Não tem uma conta?{" "}
                    <Link 
                      href="/auth/signup" 
                      className="text-primary hover:text-orange-500 transition-colors duration-200 font-semibold hover:underline text-sm sm:text-base md:text-lg lg:text-xl"
                    >
                      Cadastre-se aqui
                    </Link>
                  </p>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Signin;