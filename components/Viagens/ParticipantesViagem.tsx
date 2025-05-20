"use client";

import { useEffect, useState } from "react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import ParticipanteCard from "@/components/Viagens/ParticipanteCard";
import { useParams } from "next/navigation";
import { getParticipantesDaViagem } from "@/services/viagemService";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ParticipantesViagem = () => {
  const { id } = useParams();
  const [participantes, setParticipantes] = useState<UsuarioBuscaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);

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

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover bg-center min-h-screen pt-32 pb-16 px-4">
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 py-8 bg-white rounded-2xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {carregando && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!carregando && (
          <>
            <h1 className="text-3xl font-bold text-center text-neutral-800 mb-8">
              Participantes da Viagem
            </h1>

            {participantes.length === 0 ? (
              <p className="text-center text-gray-600">Nenhum participante encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {participantes.map((usuario) => (
                  <ParticipanteCard key={usuario.id} participante={usuario} viagemId={Number(id)} />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
};

export default ParticipantesViagem;
