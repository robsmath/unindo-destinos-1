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
  };  const handleSubmit = async () => {
    if (!preferenciasEditaveis) return;

    setSalvando(true);    try {
      const metodo = preferencias ? atualizarPreferenciasDoUsuario : salvarPreferenciasDoUsuario;
      await metodo(preferenciasEditaveis);
      await carregarPreferencias(true); // Força o recarregamento das preferências
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
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Minhas Preferências
          </span>
        </h2>
        <p className="text-gray-600">Configure suas preferências para encontrar companheiros ideais</p>
      </div>

      {/* Alert for first time users */}
      {!preferencias && (
        <motion.div 
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Configure suas preferências</h3>
              <p className="text-amber-700">
                Você ainda não cadastrou suas preferências. Preencha o formulário abaixo para encontrar companheiros de viagem ideais!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form Container */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 p-6 border-b border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800">Configurações de Preferências</h3>
          <p className="text-sm text-gray-600 mt-1">Defina seus critérios para companheiros de viagem</p>
        </div>
        
        <div className="p-8">
          <PreferenciasForm
            preferencias={preferenciasEditaveis as PreferenciasDTO}
            handlePreferenceChange={handleChange}
          />

          {/* Save Button */}
          <motion.div className="mt-8 pt-6 border-t border-gray-200/50">
            <motion.button
              onClick={handleSubmit}
              disabled={salvando}
              className="group relative w-full bg-gradient-to-r from-primary to-orange-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: salvando ? 1 : 1.02, y: salvando ? 0 : -2 }}
              whileTap={{ scale: salvando ? 1 : 0.98 }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: '-100%' }}
                whileHover={salvando ? {} : { x: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                {salvando && <Loader2 className="animate-spin w-5 h-5" />}
                {salvando ? "Salvando preferências..." : "Salvar Preferências"}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MinhasPreferencias;
