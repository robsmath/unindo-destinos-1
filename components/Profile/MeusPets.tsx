"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getMeusPets } from "@/services/petService";
import { PetDTO } from "@/models/PetDTO";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FaPaw } from "react-icons/fa";
import { useTabData } from "./hooks/useTabData";

const MeusPets = () => {
  const router = useRouter();
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
      )}

      {/* Empty State */}
      {!loading && (!pets || pets.length === 0) && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPaw className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum pet cadastrado</h3>
            <p className="text-gray-500 mb-6">Cadastre seus pets para que outros viajantes saibam que você viaja com companheiros especiais!</p>
          </div>
        </motion.div>
      )}

      {/* Pets Grid */}
      {!loading && pets && pets.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              className="group bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => handleEditarPet(pet.id!)}
            >
              {/* Pet Photo */}
              <div className="relative mb-4">
                {pet.foto ? (
                  <div className="relative">
                    {/* Gradient Ring */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full p-1 mx-auto w-32 h-32">
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
                  <div className="relative">
                    {/* Gradient Ring */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full p-1 mx-auto w-32 h-32">
                      <div className="bg-white rounded-full p-1 w-full h-full">
                        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <FaPaw className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
                  {pet.nome}
                </h3>
                
                {/* Edit Indicator */}
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 group-hover:text-primary transition-colors duration-300">
                  <span className="w-2 h-2 bg-primary rounded-full group-hover:animate-pulse"></span>
                  Clique para editar
                </div>
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
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default MeusPets;
