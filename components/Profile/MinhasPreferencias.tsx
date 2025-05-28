"use client";

import { useEffect, useState } from "react";
import { usePerfil } from "@/app/context/PerfilContext";
import { salvarPreferenciasDoUsuario, atualizarPreferenciasDoUsuario } from "@/services/preferenciasService";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import PreferenciasForm from "@/components/Common/PreferenciasForm";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const PREFERENCIAS_INICIAIS: PreferenciasDTO = {
  generoPreferido: "NAO_TENHO_PREFERENCIA",
  idadeMinima: 18,
  idadeMaxima: 60,
  valorMedioViagem: null,

  petFriendly: false,
  aceitaCriancas: false,
  aceitaFumantes: false,
  aceitaBebidasAlcoolicas: false,
  acomodacaoCompartilhada: false,
  estiloViagem: "NAO_TENHO_PREFERENCIA",
  tipoAcomodacao: "NAO_TENHO_PREFERENCIA",
  tipoTransporte: "NAO_TENHO_PREFERENCIA",
};

const MinhasPreferencias = () => {
  const { preferencias, carregarPreferencias } = usePerfil();
  const [preferenciasEditaveis, setPreferenciasEditaveis] = useState<PreferenciasDTO | null | undefined>(undefined);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (preferencias === undefined) return;
    setPreferenciasEditaveis(preferencias ?? PREFERENCIAS_INICIAIS);
  }, [preferencias]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setPreferenciasEditaveis((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === "checkbox" ? checked : value === "" ? null : value,
          }
        : null
    );
  };

  const handleSubmit = async () => {
    if (!preferenciasEditaveis) return;

    setSalvando(true);    try {
      const metodo = preferencias ? atualizarPreferenciasDoUsuario : salvarPreferenciasDoUsuario;
      await metodo(preferenciasEditaveis);
      await carregarPreferencias();
      toast.success("Preferências salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar preferências.");
    } finally {
      setSalvando(false);
    }
  };

  if (preferenciasEditaveis === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-600">Carregando preferências...</span>
      </div>
    );
  }

  return (
    <motion.div
      className="flex justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Minhas Preferências</h2>

        {!preferencias && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-6 text-center">
            Você ainda não cadastrou suas preferências. Preencha o formulário abaixo para configurá-las!
          </div>
        )}

        <PreferenciasForm
          preferencias={preferenciasEditaveis as PreferenciasDTO}
          handlePreferenceChange={handleChange}
        />

        <Button
          onClick={handleSubmit}
          disabled={salvando}
          className="w-full mt-6 text-base"
        >
          {salvando ? "Salvando..." : "Salvar Preferências"}
        </Button>
      </div>
    </motion.div>
  );
};

export default MinhasPreferencias;
