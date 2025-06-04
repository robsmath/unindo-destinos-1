"use client";

import { useState, Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { motion } from "framer-motion";
import { X, User, Star, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { criarAvaliacao } from "@/services/avaliacaoService";
import { AvaliacaoRequestDTO } from "@/models/AvaliacaoRequestDTO";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import StarRating from "@/components/Common/StarRating";

interface ModalAvaliacaoProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioAvaliado: UsuarioBuscaDTO;
  viagemId: number;
  onAvaliacaoEnviada?: () => void;
}

export default function ModalAvaliacao({
  isOpen,
  onClose,
  usuarioAvaliado,
  viagemId,
  onAvaliacaoEnviada
}: ModalAvaliacaoProps) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async () => {
    if (nota === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas");
      return;
    }

    setEnviando(true);
    try {
      const dadosAvaliacao: AvaliacaoRequestDTO = {
        avaliadoId: usuarioAvaliado.id,
        viagemId,
        nota,
        comentario: comentario.trim() || undefined
      };

      await criarAvaliacao(dadosAvaliacao);
      toast.success("Avaliação enviada com sucesso!");
      
      // Reset form
      setNota(0);
      setComentario("");
      
      if (onAvaliacaoEnviada) {
        onAvaliacaoEnviada();
      }
      
      onClose();
    } catch (error: any) {
      const mensagemErro = error?.response?.data?.message || "Erro ao enviar avaliação";
      toast.error(mensagemErro);
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    if (!enviando) {
      setNota(0);
      setComentario("");
      onClose();
    }
  };

  const getNotaTexto = (nota: number) => {
    switch (nota) {
      case 1: return "Péssimo";
      case 2: return "Ruim";
      case 3: return "Regular";
      case 4: return "Bom";
      case 5: return "Excelente";
      default: return "";
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
                  <button
                    onClick={handleClose}
                    disabled={enviando}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Como foi viajar com {usuarioAvaliado.nome.split(" ")[0]}?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sua avaliação ajuda outros viajantes
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                  {/* Foto do usuário */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={usuarioAvaliado.fotoPerfil || "/images/user/avatar.png"}
                        alt={usuarioAvaliado.nome}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary/10 rounded-full p-2">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Avaliação por estrelas */}
                  <div className="text-center space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Dê uma nota para {usuarioAvaliado.nome.split(" ")[0]}
                    </label>
                    
                    <div className="flex justify-center">
                      <StarRating
                        rating={nota}
                        size="lg"
                        interactive={true}
                        onRatingChange={setNota}
                      />
                    </div>
                    
                    {nota > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-medium text-primary"
                      >
                        {getNotaTexto(nota)}
                      </motion.p>
                    )}
                  </div>

                  {/* Comentário opcional */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <MessageCircle className="w-4 h-4" />
                      Comentário (opcional)
                    </label>
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Conte um pouco sobre sua experiência..."
                      rows={4}
                      maxLength={500}
                      disabled={enviando}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {comentario.length}/500 caracteres
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={handleClose}
                    disabled={enviando}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  
                  <motion.button
                    onClick={handleSubmit}
                    disabled={enviando || nota === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={!enviando && nota > 0 ? { scale: 1.02 } : {}}
                    whileTap={!enviando && nota > 0 ? { scale: 0.98 } : {}}
                  >
                    {enviando ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        Enviar Avaliação
                      </>
                    )}
                  </motion.button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 