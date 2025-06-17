"use client";

import { Fragment, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { FaTimes, FaPaw, FaEdit, FaBirthdayCake, FaVenus, FaMars } from "react-icons/fa";
import { Heart, Calendar, Dog } from "lucide-react";
import { PetDTO } from "@/models/PetDTO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  pet: PetDTO | null;
  isOpen: boolean;
  onClose: () => void;
  isOwner?: boolean;
}

const formatarDataNascimento = (data?: string) => {
  if (!data) return null;
  
  try {
    const date = new Date(data);
    const hoje = new Date();
    const idade = hoje.getFullYear() - date.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = date.getMonth();
    
    let idadeFinal = idade;
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < date.getDate())) {
      idadeFinal--;
    }
    
    return {
      data: date.toLocaleDateString('pt-BR'),
      idade: idadeFinal
    };
  } catch {
    return null;
  }
};

const obterPorteFormatado = (porte?: string) => {
  if (!porte) return "Não informado";
  
  switch (porte.toLowerCase()) {
    case 'pequeno':
    case 'small':
      return 'Pequeno';
    case 'medio':
    case 'médio':
    case 'medium':
      return 'Médio';
    case 'grande':
    case 'large':
      return 'Grande';
    default:
      return porte;
  }
};

export default function PetDetalhesModal({ pet, isOpen, onClose, isOwner = true }: Props) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  if (!pet) return null;

  const infoNascimento = formatarDataNascimento(pet.dataNascimento);

  const handleEditar = () => {
    onClose();
    router.push(`/pets/editar/${pet.id}`);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <DialogPanel className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  aria-label="Fechar"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                <div className="flex flex-col p-6 sm:p-8">
                  <motion.div 
                    className="flex flex-col items-center text-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative mb-4">
                      {pet.foto && !imageError ? (
                        <div className="relative">
                          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-full p-1 w-32 h-32 mx-auto">
                            <div className="bg-white rounded-full p-1 w-full h-full">
                              <img
                                src={pet.foto}
                                alt={pet.nome}
                                onError={() => setImageError(true)}
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-full p-1 w-32 h-32 mx-auto">
                            <div className="bg-white rounded-full p-1 w-full h-full">
                              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center">
                                <FaPaw className="w-16 h-16 text-primary" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {pet.nome}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                      {pet.raca && (
                        <div className="flex items-center gap-1">
                          <Dog className="w-4 h-4" />
                          <span>{pet.raca}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        {pet.sexo === 'MACHO' ? (
                          <FaMars className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FaVenus className="w-4 h-4 text-pink-500" />
                        )}
                        <span>{pet.sexo === 'MACHO' ? 'Macho' : 'Fêmea'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{obterPorteFormatado(pet.porte)}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {infoNascimento && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaBirthdayCake className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-gray-800">Nascimento e Idade</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Data: {infoNascimento.data}</p>
                          <p>Idade: {infoNascimento.idade} {infoNascimento.idade === 1 ? 'ano' : 'anos'}</p>
                        </div>
                      </div>
                    )}

                    {pet.descricao && pet.descricao.trim() && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium text-gray-800">Descrição</span>
                        </div>
                        <p className="text-sm text-gray-600 italic">"{pet.descricao}"</p>
                      </div>
                    )}

                    {pet.observacao && pet.observacao.trim() && (
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-gray-800">Observações Especiais</span>
                        </div>
                        <p className="text-sm text-gray-600">{pet.observacao}</p>
                      </div>
                    )}

                    {(!pet.descricao || !pet.descricao.trim()) && (!pet.observacao || !pet.observacao.trim()) && (
                      <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <FaPaw className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Nenhuma descrição ou observação especial adicionada ainda.
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {isOwner && (
                    <motion.div 
                      className="mt-6 pt-4 border-t border-gray-200/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={handleEditar}
                        className="w-full bg-gradient-to-r from-primary to-orange-500 text-white hover:scale-105 transition-all duration-200 flex items-center gap-2 py-3"
                      >
                        <FaEdit className="w-4 h-4" />
                        Editar Informações
                      </Button>
                    </motion.div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
