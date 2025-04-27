"use client";

import { cadastrarViagem, editarViagem, getViagemById } from "@/services/viagemService";
import { salvarPreferenciasViagem } from "@/services/preferenciasService";
import { getPreferenciaByViagemId } from "@/services/preferenciasService";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImage } from "@/services/unsplashService";
import { ViagemDTO } from "@/models/ViagemDTO";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { toast } from "sonner";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import PreferenciasForm from "@/components/Common/PreferenciasForm";
import { useAuth } from "@/app/context/AuthContext";

interface CadastroViagemProps {
  viagemId?: string;
}

const CadastroViagem = ({ viagemId }: CadastroViagemProps) => {
  const { user } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [imagemDestino, setImagemDestino] = useState<string>("/images/common/beach.jpg");
  const [showPreferences, setShowPreferences] = useState(false);
  const [semPreferencias, setSemPreferencias] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Omit<ViagemDTO, "id" | "criadorViagemId">>({
    destino: "",
    dataInicio: "",
    dataFim: "",
    estilo: "AVENTURA",
    status: "PENDENTE",
  });

  const [preferencias, setPreferencias] = useState<PreferenciasDTO>({
    generoPreferido: "MASCULINO",
    faixaEtariaPreferida: "ADULTOS",
    petFriendly: false,
    aceitaCriancas: false,
    aceitaFumantes: false,
    aceitaBebidasAlcoolicas: false,
    acomodacaoCompartilhada: false,
    aceitaAnimaisGrandePorte: false,
    estiloViagem: "AVENTURA",
    tipoAcomodacao: "HOTEL",
    tipoTransporte: "AVIAO",
  });

  const router = useRouter();
  const id = viagemId ? Number(viagemId) : null;

  useEffect(() => {
    setHasMounted(true);
  
    const carregarViagem = async () => {
      if (id) {
        try {
          const viagem = await getViagemById(id);
          setForm({
            destino: viagem.destino,
            dataInicio: viagem.dataInicio,
            dataFim: viagem.dataFim,
            estilo: viagem.estilo,
            status: viagem.status,
          });
    
          const imagem = await getImage(viagem.destino);
          setImagemDestino(imagem || "/images/common/beach.jpg");
    
          const preferenciasSalvas = await getPreferenciaByViagemId(id);
            if (preferenciasSalvas !== null) {
              setPreferencias(preferenciasSalvas);
            } else {
              setSemPreferencias(true);
            }
        } catch (error) {
          console.error("Erro ao carregar viagem ou preferências para edição", error);
        }
      }
    };
     
    carregarViagem();
  }, [id]);
  

  if (!hasMounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement).value;
    setPreferencias((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.destino.trim()) {
      toast.error("O destino é obrigatório!", { position: "top-center" });
      return;
    }

    if (!form.dataInicio || !form.dataFim) {
      toast.error("As datas de início e fim são obrigatórias!", { position: "top-center" });
      return;
    }

    const hoje = new Date();
    const dataInicio = new Date(form.dataInicio);
    const dataFim = new Date(form.dataFim);

    hoje.setHours(0, 0, 0, 0);
    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(0, 0, 0, 0);

    if (dataInicio < hoje) {
      toast.error("A data de início não pode ser anterior à data atual!", { position: "top-center" });
      return;
    }

    if (dataFim < dataInicio) {
      toast.error("A data de fim não pode ser anterior à data de início!", { position: "top-center" });
      return;
    }

    if (!user?.id) {
      toast.error("Usuário não encontrado. Faça login novamente.", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      let viagemId: number;

      const viagemRequest = {
        ...form,
        criadorViagemId: user.id,
      };

      if (id) {
        await editarViagem(id, { ...viagemRequest, id });
        viagemId = id;
        toast.success("Viagem atualizada com sucesso!", { position: "top-center" });
      } else {
        const viagemSalva = await cadastrarViagem({ ...viagemRequest, id: 0 });
        viagemId = viagemSalva.id;

        if (!viagemId || viagemId === 0) {
          throw new Error("Erro ao cadastrar viagem: ID não retornado ou inválido.");
        }

        toast.success("Viagem cadastrada com sucesso!", { position: "top-center" });
      }

      await salvarPreferenciasViagem(viagemId, preferencias);
      toast.success("Preferências salvas com sucesso!", { position: "top-center" });

      router.push("/profile?tab=minhas-viagens");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar viagem ou preferências. Tente novamente.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const fetchImagemPaisagemDestino = async (destino: string) => {
    try {
      if (!destino) return null;
      const imagem = await getImage(destino);
      return imagem || "/images/common/beach.jpg";
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      return "/images/common/beach.jpg";
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white min-h-screen pt-40 pb-16 px-4">
      <div className="relative mx-auto max-w-c-1390 px-7.5">
        <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="w-full rounded-lg bg-white p-7.5 shadow-solid-8 md:w-3/5 lg:w-3/4 xl:p-15"
          >
            <h2 className="mb-2 text-3xl font-semibold text-black xl:text-sectiontitle2">
              {id ? "Editar Viagem" : "Cadastre sua viagem"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="destino"
                placeholder="Destino"
                value={form.destino}
                onChange={handleChange}
                onBlur={async (e) => {
                  const urlImagem = await fetchImagemPaisagemDestino(e.target.value);
                  setImagemDestino(urlImagem || "/images/common/beach.jpg");
                }}
                className="input mb-7.5"
              />

              <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between">
                <input
                  type="date"
                  name="dataInicio"
                  value={form.dataInicio}
                  onChange={handleChange}
                  className="input lg:w-1/2"
                />
                <input
                  type="date"
                  name="dataFim"
                  value={form.dataFim}
                  onChange={handleChange}
                  className="input lg:w-1/2"
                />
              </div>

              <select
                name="estilo"
                value={form.estilo}
                onChange={handleChange}
                className="input mb-7.5"
              >
                <option value="AVENTURA">Aventura</option>
                <option value="CULTURA">Cultura</option>
                <option value="RELAXAMENTO">Relaxamento</option>
                <option value="GASTRONOMIA">Gastronomia</option>
                <option value="ROMANTICA">Romântica</option>
                <option value="RELIGIOSA">Religiosa</option>
                <option value="COMPRAS">Compras</option>
                <option value="PRAIA">Praia</option>
                <option value="HISTORICA">Histórica</option>
                <option value="TECNOLOGIA">Tecnologia</option>
                <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
              </select>

              <div className="mb-7.5">
                <button
                  type="button"
                  className="flex items-center gap-2 font-semibold text-primary"
                  onClick={() => setShowPreferences(!showPreferences)}
                >
                  Preferências da Viagem {showPreferences ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                <AnimatePresence>
                  {showPreferences && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                    {semPreferencias && (
                      <div className="mb-4 rounded-lg bg-yellow-100 p-4 text-yellow-800 text-sm">
                        Nenhuma preferência cadastrada ainda para esta viagem. Você pode preenchê-las abaixo!
                      </div>
                    )}
                      <PreferenciasForm
                        preferencias={preferencias}
                        handlePreferenceChange={handlePreferenceChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 font-medium text-white transition-all duration-300
                    ${loading ? "bg-primary/70 animate-pulse" : "bg-primary hover:bg-primaryho"}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    id ? "Atualizar Viagem" : "Cadastrar viagem"
                  )}
                </button>

            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.1 }}
            className={`relative w-full md:w-2/5 lg:w-[26%] overflow-hidden rounded-lg transition-all duration-500`}
            style={{ height: showPreferences ? "1000px" : "540px" }}
          >
            <motion.img
              key={imagemDestino}
              src={imagemDestino}
              alt="Imagem do destino"
              className="object-cover w-full h-full rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CadastroViagem;
