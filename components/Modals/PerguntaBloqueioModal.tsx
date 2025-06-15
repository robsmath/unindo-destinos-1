"use client";

import { Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, HelpCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuarioNome: string;
  onBloquear: () => void;
  onNaoBloquear: () => void;
}

export default function PerguntaBloqueioModal({ 
  isOpen, 
  onClose, 
  usuarioNome, 
  onBloquear, 
  onNaoBloquear 
}: Props) {

  console.log("🔍 PerguntaBloqueioModal renderizado - isOpen:", isOpen, "usuarioNome:", usuarioNome);

  const handleBloquear = () => {
    onBloquear();
    onClose();
  };

  const handleNaoBloquear = () => {
    onNaoBloquear();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
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
                
                <div className="px-6 py-6">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    >
                      <HelpCircle className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Denúncia Enviada!
                    </h2>
                    <p className="text-sm text-gray-600 text-center mb-6">
                      Você deseja também bloquear{" "}
                      <span className="font-semibold text-gray-800">{usuarioNome}</span>{" "}
                      para evitar futuros contatos?
                    </p>

                    <div className="flex gap-3 w-full">
                      <motion.button
                        onClick={handleNaoBloquear}
                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Não
                      </motion.button>
                      <motion.button
                        onClick={handleBloquear}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Shield className="w-4 h-4" />
                        Sim, Bloquear
                      </motion.button>
                    </div>
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