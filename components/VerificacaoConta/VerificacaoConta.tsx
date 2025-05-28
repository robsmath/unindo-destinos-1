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
import { Loader2, Mail, Phone, CheckCircle2, Shield } from "lucide-react";

const VerificacaoConta = () => {
  const router = useRouter();

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="flex justify-center items-center h-screen relative z-10">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 max-w-lg w-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="bg-gradient-to-r from-primary/10 to-orange-500/10 p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Verificação de Conta
              </span>
            </h1>
            <p className="text-gray-600">
              Confirme seu e-mail e telefone para continuar
            </p>
          </motion.div>

          <div className="p-8 space-y-8">
            {!emailVerificado && (
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Confirmação de E-mail
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <motion.button
                    onClick={handleReenviarEmail}
                    disabled={loadingReenviarEmail}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loadingReenviarEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {loadingReenviarEmail
                      ? "Enviando..."
                      : emailCodigoEnviado
                      ? "Reenviar Código"
                      : "Enviar Código"}
                  </motion.button>
                  
                  <input
                    type="text"
                    placeholder="Digite o código do e-mail"
                    value={codigoEmail}
                    onChange={(e) => setCodigoEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                  
                  <motion.button
                    onClick={handleVerificarEmail}
                    disabled={loadingConfirmarEmail}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loadingConfirmarEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {loadingConfirmarEmail ? "Confirmando..." : "Confirmar E-mail"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {!telefoneVerificado && (
              <motion.div
                className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200/50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Confirmação de Telefone
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <motion.button
                    onClick={handleReenviarSms}
                    disabled={loadingReenviarSms}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loadingReenviarSms ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    {loadingReenviarSms
                      ? "Enviando..."
                      : telefoneCodigoEnviado
                      ? "Reenviar Código"
                      : "Enviar Código"}
                  </motion.button>
                  
                  <input
                    type="text"
                    placeholder="Digite o código do SMS"
                    value={codigoTelefone}
                    onChange={(e) => setCodigoTelefone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                  
                  <motion.button
                    onClick={handleVerificarTelefone}
                    disabled={loadingConfirmarTelefone}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loadingConfirmarTelefone ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {loadingConfirmarTelefone ? "Confirmando..." : "Confirmar Telefone"}
                  </motion.button>
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
