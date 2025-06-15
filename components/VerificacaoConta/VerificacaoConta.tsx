"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  reenviarEmail,
  reenviarSms,
  verificarEmail,
  verificarTelefone,
} from "@/services/verificacaoService";
import { toast } from "sonner";
import { getUsuarioLogado } from "@/services/userService";
import { usePerfil } from "@/app/context/PerfilContext";
import { 
  Loader2, 
  Mail, 
  Phone, 
  CheckCircle,
  CheckCircle2, 
  Shield,
  Plane,
  MapPin,
  Globe,
  Heart,
  Star,
  User,
  UserCheck,
  Award
} from "lucide-react";

const VerificacaoConta = () => {
  const router = useRouter();
  const { carregarUsuario } = usePerfil();

  const [codigoEmail, setCodigoEmail] = useState("");
  const [codigoTelefone, setCodigoTelefone] = useState("");

  const [emailCodigoEnviado, setEmailCodigoEnviado] = useState(false);
  const [telefoneCodigoEnviado, setTelefoneCodigoEnviado] = useState(false);

  const [emailVerificado, setEmailVerificado] = useState<boolean>(false);
  const [telefoneVerificado, setTelefoneVerificado] = useState<boolean>(false);

  const [loadingReenviarEmail, setLoadingReenviarEmail] = useState(false);
  const [loadingConfirmarEmail, setLoadingConfirmarEmail] = useState(false);
  const [loadingReenviarSms, setLoadingReenviarSms] = useState(false);
  const [loadingConfirmarTelefone, setLoadingConfirmarTelefone] = useState(false);

  const [carregando, setCarregando] = useState(true);

  const verificarStatus = async () => {
    try {
      const usuario = await getUsuarioLogado();
      const emailOk = !!usuario.emailVerificado;
      const telefoneOk = !!usuario.telefoneVerificado;

      setEmailVerificado(emailOk);
      setTelefoneVerificado(telefoneOk);

      if (emailOk && telefoneOk) {
        router.replace("/profile?tab=dados-pessoais");
      }
    } catch {
      toast.error("Erro ao carregar dados do usuário.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    verificarStatus();
  }, []);

  const handleReenviarEmail = async () => {
    setLoadingReenviarEmail(true);
    try {
      await reenviarEmail();
      setEmailCodigoEnviado(true);
      toast.success("Código de e-mail enviado!");
    } catch {
      toast.error("Erro ao enviar código de e-mail.");
    } finally {
      setLoadingReenviarEmail(false);
    }
  };
  const handleVerificarEmail = async () => {
    setLoadingConfirmarEmail(true);
    try {
      await verificarEmail(codigoEmail);
      toast.success("E-mail confirmado com sucesso!");
      setEmailVerificado(true);
      setCodigoEmail("");

      await carregarUsuario(true);

      if (telefoneVerificado) {
        router.replace("/profile?tab=dados-pessoais");
      }
    } catch {
      toast.error("Erro ao confirmar e-mail.");
    } finally {
      setLoadingConfirmarEmail(false);
    }
  };

  const handleReenviarSms = async () => {
    setLoadingReenviarSms(true);
    try {
      await reenviarSms();
      setTelefoneCodigoEnviado(true);
      toast.success("Código de SMS enviado!");
    } catch {
      toast.error("Erro ao enviar código de SMS.");
    } finally {
      setLoadingReenviarSms(false);
    }
  };

    const handleVerificarTelefone = async () => {
    setLoadingConfirmarTelefone(true);
    try {
      await verificarTelefone(codigoTelefone);
      toast.success("Telefone confirmado com sucesso!");
      setTelefoneVerificado(true);
      setCodigoTelefone("");

      await carregarUsuario(true);

      if (emailVerificado) {
        router.replace("/profile?tab=dados-pessoais");
      }
    } catch {
      toast.error("Erro ao confirmar telefone.");
    } finally {
      setLoadingConfirmarTelefone(false);
    }
  };
  const handlePular = () => {
    router.push("/profile");
  };
  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100 relative overflow-hidden">
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
          <Shield className="w-7 h-7 text-blue-500/30 drop-shadow-lg" />
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
          <Mail className="w-9 h-9 text-primary/30 drop-shadow-lg" />
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
          <Phone className="w-6 h-6 text-green-500/30 drop-shadow-lg" />
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
          <UserCheck className="w-9 h-9 text-emerald-500/30 drop-shadow-lg" />
        </motion.div>

        <div className="flex justify-center items-center h-screen relative z-10 pt-20">
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700">Carregando verificação...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-primary/5 relative overflow-hidden">
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

        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full blur-xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

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
          <Shield className="w-8 h-8 text-blue-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <Mail className="w-7 h-7 text-green-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-48 left-40"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Phone className="w-6 h-6 text-orange-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-60 right-60"
          animate={{ 
            y: [0, -12, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        >
          <UserCheck className="w-8 h-8 text-emerald-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-64 right-40"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 12, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Award className="w-7 h-7 text-purple-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-36 right-64"
          animate={{ 
            y: [0, -18, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        >
          <CheckCircle className="w-6 h-6 text-teal-500/30 drop-shadow-lg" />
        </motion.div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-8 px-4 relative z-10">
        <motion.div
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-lg w-full overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.01, y: -2 }}
        >
          <motion.div
            className="bg-gradient-to-r from-primary/15 to-orange-500/15 p-8 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-orange-500/5"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="relative z-10 w-20 h-20 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 10px 25px rgba(234, 88, 12, 0.3)",
                  "0 15px 35px rgba(249, 115, 22, 0.4)",
                  "0 10px 25px rgba(234, 88, 12, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="h-10 w-10 text-white drop-shadow-lg" />
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
                Verificação de Conta
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Confirme seu e-mail e telefone para desbloquear todos os recursos
            </motion.p>
          </motion.div>          <div className="p-8 space-y-8">
            {!emailVerificado && (
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    animate={{ 
                      boxShadow: [
                        "0 4px 15px rgba(59, 130, 246, 0.3)",
                        "0 6px 20px rgba(99, 102, 241, 0.4)",
                        "0 4px 15px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mail className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Verificação de E-mail
                    </h2>
                    <p className="text-sm text-gray-600">
                      Confirme sua identidade por e-mail
                    </p>
                  </div>
                </div>
                  <div className="space-y-4">
                  <motion.button
                    onClick={handleReenviarEmail}
                    disabled={loadingReenviarEmail}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: loadingReenviarEmail ? 1 : 1.02, y: loadingReenviarEmail ? 0 : -1 }}
                    whileTap={{ scale: loadingReenviarEmail ? 1 : 0.98 }}
                  >
                    {loadingReenviarEmail ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {loadingReenviarEmail
                        ? "Enviando..."
                        : emailCodigoEnviado
                        ? "Reenviar Código"
                        : "Enviar Código"}
                    </span>
                  </motion.button>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Digite o código de 6 dígitos"
                      value={codigoEmail}
                      onChange={(e) => setCodigoEmail(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white/90 backdrop-blur-sm transition-all duration-300 text-center text-lg font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                      maxLength={6}
                    />
                    <motion.div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: codigoEmail.length === 6 ? 1 : 0,
                        scale: codigoEmail.length === 6 ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                  </div>
                  
                  <motion.button
                    onClick={handleVerificarEmail}
                    disabled={loadingConfirmarEmail || !codigoEmail}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: (loadingConfirmarEmail || !codigoEmail) ? 1 : 1.02, y: (loadingConfirmarEmail || !codigoEmail) ? 0 : -1 }}
                    whileTap={{ scale: (loadingConfirmarEmail || !codigoEmail) ? 1 : 0.98 }}
                  >
                    {loadingConfirmarEmail ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {loadingConfirmarEmail ? "Verificando..." : "Confirmar E-mail"}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}            {!telefoneVerificado && (
              <motion.div
                className="relative bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30" />
                  <div className="absolute top-2 left-2 w-20 h-20 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-xl" />
                  <div className="absolute bottom-2 right-2 w-16 h-16 bg-gradient-to-br from-teal-200/20 to-green-200/20 rounded-full blur-xl" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      animate={{ 
                        boxShadow: [
                          "0 4px 15px rgba(34, 197, 94, 0.3)",
                          "0 6px 20px rgba(16, 185, 129, 0.4)",
                          "0 4px 15px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Phone className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Verificação de Telefone
                      </h2>
                      <p className="text-sm text-gray-600">
                        Confirme sua identidade por SMS
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleReenviarSms}
                      disabled={loadingReenviarSms}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: loadingReenviarSms ? 1 : 1.02, y: loadingReenviarSms ? 0 : -1 }}
                      whileTap={{ scale: loadingReenviarSms ? 1 : 0.98 }}
                    >
                      {loadingReenviarSms ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Phone className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {loadingReenviarSms
                          ? "Enviando..."
                          : telefoneCodigoEnviado
                          ? "Reenviar Código"
                          : "Enviar Código"}
                      </span>
                    </motion.button>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Digite o código de 6 dígitos"
                        value={codigoTelefone}
                        onChange={(e) => setCodigoTelefone(e.target.value)}
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 bg-white/90 backdrop-blur-sm transition-all duration-300 text-center text-lg font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
                        maxLength={6}
                      />
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: codigoTelefone.length === 6 ? 1 : 0,
                          scale: codigoTelefone.length === 6 ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </motion.div>
                    </div>
                    
                    <motion.button
                      onClick={handleVerificarTelefone}
                      disabled={loadingConfirmarTelefone || !codigoTelefone}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: (loadingConfirmarTelefone || !codigoTelefone) ? 1 : 1.02, y: (loadingConfirmarTelefone || !codigoTelefone) ? 0 : -1 }}
                      whileTap={{ scale: (loadingConfirmarTelefone || !codigoTelefone) ? 1 : 0.98 }}
                    >
                      {loadingConfirmarTelefone ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {loadingConfirmarTelefone ? "Verificando..." : "Confirmar Telefone"}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                onClick={handlePular}
                className="text-primary hover:text-orange-500 font-medium underline-offset-4 hover:underline transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pular por enquanto
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerificacaoConta;
