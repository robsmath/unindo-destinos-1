"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getMeusPets } from "@/services/petService";
import { PetDTO } from "@/models/PetDTO";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FaPaw, FaMars, FaVenus } from "react-icons/fa";
import { Dog, Heart } from "lucide-react";
import { useTabData } from "./hooks/useTabData";
import PetDetalhesModal from "@/components/Modals/PetDetalhesModal";

const MeusPets = () => {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState<PetDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: pets, loading, loadData } = useTabData<PetDTO[]>(async () => {
    try {
      return await getMeusPets();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar seus pets.");
      throw err;
    }
  }, 'pets'); // Adicionando cache key

  useEffect(() => {
    loadData();
  }, []);

  const handleCadastrarPet = () => {
    router.push("/pets/cadastrar");
  };

  const handleEditarPet = (id: number) => {
    router.push(`/pets/editar/${id}`);
  };

  const handleAbrirModal = (pet: PetDTO) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };

  const obterPorteFormatado = (porte?: string) => {
    if (!porte) return "Porte não informado";
    
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

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Meus Pets
          </span>
        </h2>
        <p className="text-gray-600">Gerencie o perfil dos seus companheiros de quatro patas</p>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Carregando seus pets...</p>
          </div>
        </motion.div>
      )}      {/* Empty State */}
      {!loading && (!pets || pets.length === 0) && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/30 p-8 lg:p-12 shadow-2xl max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaPaw className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Nenhum pet cadastrado</h3>            <p className="text-gray-600 mb-8 leading-relaxed">
              Cadastre seus companheiros de quatro patas para que outros viajantes saibam que você viaja em boa companhia!
            </p>
          </div>
        </motion.div>
      )}{/* Pets Grid */}
      {!loading && pets && pets.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              className="group bg-white/90 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:bg-white/95"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleAbrirModal(pet)}
            >
              {/* Pet Photo */}
              <div className="relative mb-6 flex justify-center">
                {pet.foto ? (
                  <div className="relative w-28 h-28">
                    {/* Gradient Ring */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full p-1">
                      <div className="bg-white rounded-full p-1 w-full h-full">
                        <img
                          src={pet.foto}
                          alt={pet.nome}
                          className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-28 h-28">
                    {/* Gradient Ring */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full p-1">
                      <div className="bg-white rounded-full p-1 w-full h-full">
                        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <FaPaw className="w-10 h-10 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                  {pet.nome}
                </h3>
                
                {/* Pet Details */}
                <div className="space-y-2">
                  {pet.raca && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Dog className="w-4 h-4 text-primary" />
                      <span>{pet.raca}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      {pet.sexo === 'MACHO' ? (
                        <FaMars className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FaVenus className="w-4 h-4 text-pink-500" />
                      )}
                      <span>{pet.sexo === 'MACHO' ? 'Macho' : 'Fêmea'}</span>
                    </div>
                    
                    {pet.porte && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{obterPorteFormatado(pet.porte)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Indicator */}
                <div className="pt-2 border-t border-gray-200/50">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500 group-hover:text-primary transition-colors duration-300">
                    <span className="w-2 h-2 bg-primary rounded-full group-hover:animate-pulse"></span>
                    Clique para ver detalhes
                  </div>
                </div>

                {/* Quick Edit Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditarPet(pet.id!);
                  }}
                  className="mt-3 w-full bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm py-2 px-4 rounded-2xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Editar rapidamente
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Pet Button */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleCadastrarPet}
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <span className="relative z-10 flex items-center gap-3">
            <FaPaw className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Cadastrar Novo Pet
          </span>        </motion.button>
      </motion.div>

      {/* Modal de Detalhes do Pet */}
      <PetDetalhesModal
        pet={selectedPet}
        isOpen={isModalOpen}
        onClose={handleFecharModal}
      />
    </motion.div>
  );
};

export default MeusPets;
