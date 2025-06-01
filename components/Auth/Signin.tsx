"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/services/authService";
import { useAuth } from "@/app/context/AuthContext";
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
  Bus
} from "lucide-react";
import { toast } from "sonner";

const Signin = () => {
  const [data, setData] = useState({
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      
      // Atualizar o contexto de autenticação com o token e dados do usuário
      login(response.token, {
        id: response.usuario.id!,
        nome: response.usuario.nome,
        email: response.usuario.email,
        fotoPerfil: response.usuario.fotoPerfil,
      });
      
      toast.success("Login realizado com sucesso!");
      
      // O redirecionamento será feito automaticamente pelo contexto de autenticação
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      if (error.response?.status === 403) {
        setError("Conta não verificada. Verifique seu e-mail antes de fazer login.");
      } else if (error.response?.status === 401) {
        setError("E-mail ou senha inválidos. Verifique suas credenciais.");
      } else {
        setError("Erro no servidor. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100">
      {/* Background with Simple Animated Icons */}
      <div className="absolute inset-0 z-10">
        {/* Animated Background Gradient */}
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

        {/* Simple Floating Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -80, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Travel Icons with Simple Animations */}
        <motion.div
          className="absolute top-24 right-20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Plane className="w-7 h-7 text-orange-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-32 left-16"
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, -12, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <MapPin className="w-8 h-8 text-blue-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-48 left-20"
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
          <Compass className="w-9 h-9 text-green-500/30 drop-shadow-lg" />
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
          <Camera className="w-6 h-6 text-purple-500/30 drop-shadow-lg" />
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
          <Map className="w-7 h-7 text-red-500/30 drop-shadow-lg" />
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
          <Luggage className="w-8 h-8 text-indigo-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-56 right-48"
          animate={{ 
            y: [0, 8, 0],
            x: [0, -6, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        >
          <Bus className="w-7 h-7 text-yellow-500/30 drop-shadow-lg" />
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
          <Globe className="w-9 h-9 text-teal-500/30 drop-shadow-lg" />
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
            delay: 3
          }}
        >
          <Heart className="w-5 h-5 text-pink-500/30 drop-shadow-lg" />
        </motion.div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <motion.div 
          className="fixed inset-0 bg-white/80 backdrop-blur-xl z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center mb-4"
              style={{ transformOrigin: 'center' }}
            >
              <Loader2 className="h-12 w-12 text-primary" />
            </motion.div>
            <p className="text-lg font-medium text-gray-700">Entrando em sua conta...</p>
            <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Glass Morphism Container */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-3xl" />
            
            <div className="relative z-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent">
                    Bem-vindo de volta
                  </span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Entre em sua conta e continue sua jornada
                </p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Modern Input Fields */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      required
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>

                  <div className="relative group">
                    <input
                      type="password"
                      placeholder="Digite sua senha"
                      value={data.senha}
                      onChange={(e) => setData({ ...data, senha: e.target.value })}
                      required
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                  >
                    <p className="text-red-700 text-sm font-medium text-center">{error}</p>
                  </motion.div>
                )}

                {/* Forgot Password Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-right"
                >
                  <Link 
                    href="/auth/recuperar-senha" 
                    className="text-primary hover:text-orange-500 transition-colors duration-200 text-sm font-medium hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-lg relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10">
                    {loading ? "Entrando..." : "Entrar"}
                  </span>
                </motion.button>

                {/* Sign Up Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center pt-6 border-t border-gray-200/50"
                >
                  <p className="text-gray-600">
                    Não tem uma conta?{" "}
                    <Link 
                      href="/auth/signup" 
                      className="text-primary hover:text-orange-500 transition-colors duration-200 font-semibold hover:underline"
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