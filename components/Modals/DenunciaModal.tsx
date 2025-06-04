"use client";

import { Fragment, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { motion } from "framer-motion";
import { X, AlertTriangle, Send, Upload, FileImage } from "lucide-react";
import { MotivoDenuncia, motivosDenunciaOptions } from "@/models/MotivoDenuncia";
import { DenunciaDTO } from "@/models/DenunciaDTO";
import { registrarDenuncia } from "@/services/denunciaService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  usuarioNome: string;
  onDenunciaEnviada?: () => void;
}

export default function DenunciaModal({ 
  isOpen, 
  onClose, 
  usuarioId, 
  usuarioNome, 
  onDenunciaEnviada 
}: Props) {
  const [motivo, setMotivo] = useState<MotivoDenuncia | "">("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setMotivo("");
    setDescricao("");
    setFoto(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo deve ter no máximo 5MB");
        return;
      }
      
      setFoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo || !descricao.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    
    try {
      const denunciaData: DenunciaDTO = {
        motivo: motivo as MotivoDenuncia,
        descricao: descricao.trim(),
        denunciadoId: usuarioId,
        foto: foto ? `upload_${Date.now()}.jpg` : undefined,
      };

      await registrarDenuncia(denunciaData);
      
      toast.success("Denúncia enviada com sucesso!");
      handleClose();
      onDenunciaEnviada?.();
      
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      toast.error("Erro ao enviar denúncia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = motivo && descricao.trim();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl transition-all">
                
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4">
                  <motion.button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    >
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </motion.div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Denunciar Usuário
                    </h2>
                    <p className="text-sm text-gray-600 text-center">
                      Você está denunciando <span className="font-semibold text-gray-800">{usuarioNome}</span>
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pb-6">
                  <div className="space-y-4">
                    
                    {/* Motivo */}
                    <div>
                      <label htmlFor="motivo" className="block text-sm font-semibold text-gray-700 mb-2">
                        Motivo da denúncia *
                      </label>
                      <select
                        id="motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value as MotivoDenuncia)}
                        className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm"
                        required
                      >
                        <option value="">Selecione um motivo</option>
                        {motivosDenunciaOptions.map((opcao) => (
                          <option key={opcao.value} value={opcao.value}>
                            {opcao.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Descrição */}
                    <div>
                      <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-2">
                        Descrição detalhada *
                      </label>
                      <textarea
                        id="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows={4}
                        maxLength={500}
                        placeholder="Descreva detalhadamente o que aconteceu..."
                        className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                        required
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {descricao.length}/500 caracteres
                      </div>
                    </div>

                    {/* Upload de foto (opcional) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Anexar evidência (opcional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                          id="foto-upload"
                        />
                        <label
                          htmlFor="foto-upload"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                        >
                          {foto ? (
                            <>
                              <FileImage className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">
                                {foto.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Clique para anexar uma imagem
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                      {foto && (
                        <button
                          type="button"
                          onClick={() => setFoto(null)}
                          className="text-xs text-red-600 hover:text-red-700 mt-1"
                        >
                          Remover arquivo
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      type="submit"
                      disabled={!isFormValid || loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
                      whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar Denúncia
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 