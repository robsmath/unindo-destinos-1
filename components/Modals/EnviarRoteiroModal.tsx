"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  enviarRoteiroPorEmail,
  getNomesParticipantes,
} from "@/services/roteiroService";
import { Loader2, Mail, Users, User, X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

interface EnviarRoteiroModalProps {
  aberto: boolean;
  onClose: () => void;
  roteiroId: number;
  viagemId: number;
  souCriador?: boolean;
}

const EnviarRoteiroModal = ({
  aberto,
  onClose,
  roteiroId,
  viagemId,
  souCriador = false,
}: EnviarRoteiroModalProps) => {
  const [destino, setDestino] = useState<"CRIADOR" | "PARTICIPANTES" | "OUTRO" | null>(null);
  const [emailOutro, setEmailOutro] = useState("");
  const [loading, setLoading] = useState(false);
  const [nomesParticipantes, setNomesParticipantes] = useState<string[]>([]);
  const [carregandoParticipantes, setCarregandoParticipantes] = useState(false);

  const { usuario } = useAuth();

  useEffect(() => {
    const carregarParticipantes = async () => {
      if (destino === "PARTICIPANTES") {
        try {
          setCarregandoParticipantes(true);
          const nomes = await getNomesParticipantes(viagemId);
          setNomesParticipantes(nomes);
        } catch {
          toast.error("Erro ao carregar participantes.");
        } finally {
          setCarregandoParticipantes(false);
        }
      }
    };

    carregarParticipantes();
  }, [destino, viagemId]);

  if (!aberto) return null;

  const isEmailValido = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEnviar = async () => {
    setLoading(true);
    let emailParaEnviar: string | null = null;

    if (destino === "OUTRO") {
      if (!isEmailValido(emailOutro)) {
        toast.error("E-mail inválido. Verifique o endereço digitado.");
        setLoading(false);
        return;
      }
      emailParaEnviar = emailOutro;
    } else if (destino === "CRIADOR") {
      if (!usuario?.email || !isEmailValido(usuario.email)) {
        toast.error("Seu e-mail não está disponível ou está inválido.");
        setLoading(false);
        return;
      }
      emailParaEnviar = usuario.email;
    } else if (destino === "PARTICIPANTES") {
      emailParaEnviar = "TODOS";
    }

    if (!emailParaEnviar) {
      toast.error("Selecione uma opção ou informe um e-mail válido.");
      setLoading(false);
      return;
    }

    try {
      await enviarRoteiroPorEmail(roteiroId, emailParaEnviar);
      toast.success("E-mail enviado com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao enviar e-mail.");
    } finally {
      setLoading(false);
      setDestino(null);
      setEmailOutro("");
      setNomesParticipantes([]);
    }
  };
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-10"></div>
              <div className="relative flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Enviar Roteiro
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-center">
              Escolha para quem deseja enviar este roteiro por e-mail
            </p>            <div className="space-y-4">
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                  destino === "CRIADOR"
                    ? "border-blue-500 bg-blue-50/80 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 bg-white/60"
                }`}
              >
                <input
                  type="radio"
                  name="destinoEmail"
                  value="CRIADOR"
                  checked={destino === "CRIADOR"}
                  onChange={() => setDestino("CRIADOR")}
                  className="sr-only"
                />
                <div className={`p-2 rounded-xl ${
                  destino === "CRIADOR" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  <User className="h-5 w-5" />
                </div>
                <span className="font-medium">Para o meu e-mail</span>
              </motion.label>

              {souCriador && (
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    destino === "PARTICIPANTES"
                      ? "border-purple-500 bg-purple-50/80 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="destinoEmail"
                    value="PARTICIPANTES"
                    checked={destino === "PARTICIPANTES"}
                    onChange={() => setDestino("PARTICIPANTES")}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-xl ${
                    destino === "PARTICIPANTES" 
                      ? "bg-purple-500 text-white" 
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Para todos os participantes da viagem</span>
                </motion.label>
              )}

              {souCriador && (
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    destino === "OUTRO"
                      ? "border-pink-500 bg-pink-50/80 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="destinoEmail"
                    value="OUTRO"
                    checked={destino === "OUTRO"}
                    onChange={() => setDestino("OUTRO")}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-xl ${
                    destino === "OUTRO" 
                      ? "bg-pink-500 text-white" 
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Para outro e-mail</span>
                </motion.label>
              )}

              {!souCriador && (
                <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Opção Limitada</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Como participante desta viagem, você pode enviar o roteiro apenas para o seu e-mail.
                  </p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {destino === "CRIADOR" && usuario?.email && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4">
                      <input
                        type="email"
                        value={usuario.email}
                        disabled
                        className="w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-gray-700 cursor-not-allowed"
                      />
                      <p className="text-sm text-blue-600 mt-2">
                        Este é o e-mail cadastrado na sua conta. Verifique se está correto.
                      </p>
                    </div>
                  </motion.div>
                )}

                {destino === "PARTICIPANTES" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="bg-purple-50/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-4">
                      {carregandoParticipantes ? (
                        <div className="flex items-center gap-3 justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                          <p className="text-purple-600">Carregando participantes...</p>
                        </div>
                      ) : nomesParticipantes.length > 0 ? (
                        <div className="max-h-36 overflow-y-auto">
                          <ul className="space-y-2">
                            {nomesParticipantes.map((nome, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-2 text-gray-700"
                              >
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                {nome}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-purple-600 italic text-center py-2">
                          Nenhum participante encontrado.
                        </p>
                      )}
                      <p className="text-sm text-purple-600 mt-3">
                        Os participantes acima receberão o roteiro por e-mail.
                      </p>
                    </div>
                  </motion.div>
                )}

                {destino === "OUTRO" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="bg-pink-50/80 backdrop-blur-sm border border-pink-200 rounded-2xl p-4">
                      <input
                        type="email"
                        placeholder="Digite o e-mail de destino"
                        value={emailOutro}
                        onChange={(e) => setEmailOutro(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          emailOutro && !isEmailValido(emailOutro)
                            ? "border-red-500 bg-red-50/80 focus:ring-red-200"
                            : "border-pink-200 bg-white/80 focus:ring-pink-200 focus:border-pink-500"
                        } focus:outline-none focus:ring-2`}
                      />
                      {emailOutro && !isEmailValido(emailOutro) && (
                        <p className="text-sm text-red-600 mt-2">
                          Por favor, insira um e-mail válido.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleEnviar}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Enviar Roteiro
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnviarRoteiroModal;
