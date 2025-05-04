"use client";

import { useEffect, useState } from "react";
import {
  getPreferenciasDoUsuario,
  salvarPreferenciasDoUsuario,
  atualizarPreferenciasDoUsuario,
} from "@/services/preferenciasService";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import PreferenciasForm from "@/components/Common/PreferenciasForm";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const MinhasPreferencias = () => {
  const { user } = useAuth();
  const [preferencias, setPreferencias] = useState<PreferenciasDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (user?.id) {
      carregarPreferencias(user.id);
    }
  }, [user]);

  const carregarPreferencias = async (usuarioId: number) => {
    setLoading(true);
    try {
      const prefs = await getPreferenciasDoUsuario(usuarioId);
      setPreferencias(
        prefs ?? {
          generoPreferido: "NAO_TENHO_PREFERENCIA",
          idadeMinima: null,
          idadeMaxima: null,
          valorMedioViagem: null,
          petFriendly: false,
          aceitaCriancas: false,
          aceitaFumantes: false,
          aceitaBebidasAlcoolicas: false,
          acomodacaoCompartilhada: false,
          aceitaAnimaisGrandePorte: false,
          estiloViagem: "NAO_TENHO_PREFERENCIA",
          tipoAcomodacao: "NAO_TENHO_PREFERENCIA",
          tipoTransporte: "NAO_TENHO_PREFERENCIA",
        }
      );
    } catch (err) {
      toast.error("Erro ao carregar preferências.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && "checked" in e.target ? (e.target as HTMLInputElement).checked : undefined;
  
    setPreferencias((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === "checkbox" ? checked : value === "" ? null : value,
          }
        : null
    );
  };
  

  const handleSubmit = async () => {
    if (!user?.id || !preferencias) return;

    setSalvando(true);
    try {
      const existente = await getPreferenciasDoUsuario(user.id);
      if (!existente) {
        await salvarPreferenciasDoUsuario(user.id, preferencias);
        toast.success("Preferências salvas com sucesso!");
      } else {
        await atualizarPreferenciasDoUsuario(user.id, preferencias);
        toast.success("Preferências atualizadas com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao salvar preferências.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading || !preferencias) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-600">Carregando preferências...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-4 px-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Minhas Preferências</h2>
      <PreferenciasForm preferencias={preferencias} handlePreferenceChange={handleChange} />
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={salvando}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar Preferências"}
        </button>
      </div>
    </div>
  );
};

export default MinhasPreferencias;
