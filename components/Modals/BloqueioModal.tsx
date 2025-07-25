"use client";

import { Fragment, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { motion } from "framer-motion";
import { X, Shield, ShieldX, AlertTriangle } from "lucide-react";
import { bloquearUsuario } from "@/services/usuarioBloqueadoService";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number;
  usuarioNome: string;
  onUsuarioBloqueado?: () => void;
}

export default function BloqueioModal({ 
  isOpen, 
  onClose, 
  usuarioId, 
  usuarioNome, 
  onUsuarioBloqueado 
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleBloquear = async () => {
    setLoading(true);
    
    try {
      await bloquearUsuario(usuarioId);
      
      toast.success(`${usuarioNome} foi bloqueado com sucesso!`);
      onClose();
      onUsuarioBloqueado?.();
      
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
      toast.error("Erro ao bloquear usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                
                <div className="relative px-6 pt-6 pb-4">
                  <motion.button
                    onClick={onClose}
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
                      <ShieldX className="w-8 h-8 text-red-600" />
                    </motion.div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Bloquear Usuário
                    </h2>
                    <p className="text-sm text-gray-600 text-center">
                      Tem certeza que deseja bloquear{" "}
                      <span className="font-semibold text-gray-800">{usuarioNome}</span>?
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-amber-800 mb-1">
                          O que acontece ao bloquear?
                        </h4>
                        <ul className="text-xs text-amber-700 space-y-1">
                          <li>• O usuário não poderá mais te contatar</li>
                          <li>• Vocês não aparecerão nas buscas um do outro</li>
                          <li>• Conversas existentes ficarão ocultas</li>
                          <li>• Ele será removido de todas as suas viagens</li>
                          <li>• Você será removido de todas as viagens dele</li>
                          <li>• Você pode desbloqueá-lo a qualquer momento</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      onClick={handleBloquear}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Bloquear
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 