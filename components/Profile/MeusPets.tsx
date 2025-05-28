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
      className="flex flex-col items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6">Meus Pets</h2>      {loading ? (
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      ) : !pets || pets.length === 0 ? (
        <div className="text-gray-500 mb-6">Você ainda não cadastrou nenhum pet.</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleEditarPet(pet.id!)}
            >
              {pet.foto ? (
                <img
                  src={pet.foto}
                  alt={pet.nome}
                  className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-xl"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gray-100 border-4 border-primary shadow-xl text-primary text-5xl">
                  <FaPaw />
                </div>
              )}
              <p className="mt-3 text-lg font-semibold text-center">{pet.nome}</p>
            </motion.div>
          ))}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={handleCadastrarPet}
        className="mt-10 flex items-center gap-2 bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-orange-600"
      >
        <span>🐾</span>
        Cadastrar Pet
      </motion.button>
    </motion.div>
  );
};

export default MeusPets;
