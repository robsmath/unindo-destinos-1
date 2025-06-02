"use client";

import { useEffect, useState } from "react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import ParticipanteCard from "@/components/Viagens/ParticipanteCard";
import { useParams, useRouter } from "next/navigation";
import { getParticipantesDaViagem } from "@/services/viagemService";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeft, Users, Plane, Compass, Camera, Map, Luggage, Globe, Heart, MapPin, X } from "lucide-react";
import ChatPrivado from "@/components/Chat/ChatPrivado";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const ParticipantesViagem = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const router = useRouter();

  const [participantes, setParticipantes] = useState<UsuarioBuscaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [chatAberto, setChatAberto] = useState(false);
  const [participanteSelecionado, setParticipanteSelecionado] = useState<UsuarioBuscaDTO | null>(null);
    const { getUnreadCountForUser, markConversationAsRead } = useUnreadMessages(5000); // 5 segundos para atualização rápida

  const handleOpenChat = (participante: UsuarioBuscaDTO) => {
    setParticipanteSelecionado(participante);
    setChatAberto(true);
    // Marcar conversa como visualizada
    markConversationAsRead(participante.id);
  };

  const handleCloseChat = () => {
    setChatAberto(false);
    setParticipanteSelecionado(null);
  };

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const resultado = await getParticipantesDaViagem(Number(id));
        setParticipantes(resultado);
      } catch (err) {
        console.error("Erro ao carregar participantes:", err);
      } finally {
        setCarregando(false);
      }
    };

    fetchParticipantes();
  }, [id]);

  const criador = participantes.find((p) => p.criador);
  const usuarioEhCriador = criador?.id === usuario?.id;

  const participantesOrdenados = [...participantes].sort((a, b) => {
    if (a.criador === b.criador) return 0;
    return a.criador ? -1 : 1;
  });
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/10 to-primary/5 pointer-events-none"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(234, 88, 12, 0.03), rgba(249, 115, 22, 0.03), rgba(234, 88, 12, 0.03))",
              "linear-gradient(135deg, rgba(249, 115, 22, 0.03), rgba(234, 88, 12, 0.03), rgba(249, 115, 22, 0.03))",
              "linear-gradient(45deg, rgba(234, 88, 12, 0.03), rgba(249, 115, 22, 0.03), rgba(234, 88, 12, 0.03))",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating orbs */}
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

        {/* Floating travel icons */}
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
          <Plane className="w-8 h-8 text-orange-500/30 drop-shadow-lg" />
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
          className="absolute top-36 left-64"
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
            delay: 1.8
          }}
        >
          <Heart className="w-6 h-6 text-pink-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-80 right-80"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          <MapPin className="w-7 h-7 text-blue-500/30 drop-shadow-lg" />
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
          <Users className="w-8 h-8 text-emerald-500/30 drop-shadow-lg" />
        </motion.div>

        {/* Floating particles */}
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

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pt-24 pb-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white hover:border-primary/30"
            whileHover={{ scale: 1.02, x: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors duration-300" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300">
              Voltar
            </span>
          </motion.button>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-primary/20 shadow-md mb-6"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Participantes</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent mb-4"
          >
            Participantes da Viagem
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4"
          >
            Conheça todos os viajantes que farão parte desta aventura incrível
          </motion.p>
        </motion.div>{/* Loading State */}
        {carregando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 w-10 h-10 border-3 border-orange-500/20 border-b-orange-500 rounded-full"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-600 font-medium text-sm"
            >
              Carregando participantes...
            </motion.p>
          </motion.div>
        )}

        {/* Content */}
        {!carregando && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >            {participantes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Nenhum participante encontrado
                  </h3>
                  <p className="text-sm text-gray-600">
                    Esta viagem ainda não possui participantes cadastrados.
                  </p>
                </div>
              </motion.div>            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 justify-items-center">
                {participantesOrdenados.map((usuario, index) => (
                  <motion.div
                    key={usuario.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="w-full max-w-sm"
                  >                    <ParticipanteCard
                      participante={usuario}
                      viagemId={Number(id)}
                      usuarioEhCriador={usuarioEhCriador}
                      onOpenChat={handleOpenChat}
                      unreadCount={getUnreadCountForUser(usuario.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}</motion.div>
        )}
      </div>      {/* Modal do Chat */}
      <AnimatePresence>
        {chatAberto && participanteSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleCloseChat}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ChatPrivado 
                usuarioId={participanteSelecionado.id}
                onFechar={handleCloseChat}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ParticipantesViagem;
