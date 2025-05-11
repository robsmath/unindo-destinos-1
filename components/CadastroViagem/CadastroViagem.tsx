"use client";

import { cadastrarViagem, editarViagem, getViagemById } from "@/services/viagemService";
import { salvarPreferenciasViagem, getPreferenciaByViagemId } from "@/services/preferenciasService";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImage } from "@/services/googleImageService";
import { ViagemDTO } from "@/models/ViagemDTO";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { toast } from "sonner";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import PreferenciasForm from "@/components/Common/PreferenciasForm";
import { useAuth } from "@/app/context/AuthContext";
import paisesTraduzidos from "@/models/paisesTraduzidos";

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
  const [cidadeInternacional, setCidadeInternacional] = useState("");
  const [consultaImagem, setConsultaImagem] = useState<{ [key: number]: string }>({});

  const [form, setForm] = useState<Omit<ViagemDTO, "id" | "criadorViagemId">>({
    destino: "",
    dataInicio: "",
    dataFim: "",
    estilo: "AVENTURA",
    status: "PENDENTE",
    categoriaViagem: "NACIONAL"
  });
  
  const [preferencias, setPreferencias] = useState<PreferenciasDTO>({
    generoPreferido: "MASCULINO",
    petFriendly: false,
    aceitaCriancas: false,
    aceitaFumantes: false,
    aceitaBebidasAlcoolicas: false,
    acomodacaoCompartilhada: false,
    aceitaAnimaisGrandePorte: false,
    estiloViagem: "AVENTURA",
    tipoAcomodacao: "HOTEL",
    tipoTransporte: "AVIAO",
    idadeMinima: 18,
    idadeMaxima: 60,
    valorMedioViagem: 0,
  });
  
  const router = useRouter();
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [paises, setPaises] = useState<string[]>([]);
  const [estados, setEstados] = useState<{ id: number; sigla: string; nome: string }[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);

  const id = viagemId ? Number(viagemId) : null;
  
  useEffect(() => {
    const buscarImagem = async () => {
      if (form.destino) {
        const urlImagem = await fetchImagemPaisagemDestino(form.destino, form.categoriaViagem);
        setImagemDestino(urlImagem || "/images/common/beach.jpg");
      }
    };
    buscarImagem();
  }, [form.destino]);

  useEffect(() => {
    if (id) {
      const descricaoSalva = localStorage.getItem(`imagemCustom-${id}`);
      if (descricaoSalva) {
        setConsultaImagem((prev) => ({ ...prev, 1: descricaoSalva }));
      }
    }
  }, [id]);
  
  useEffect(() => {
    const fetchDados = async () => {
      if (form.categoriaViagem === "NACIONAL") {
        const estadosRes = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
        const estadosJson = await estadosRes.json();
        setEstados(estadosJson.map((e) => ({ id: e.id, sigla: e.sigla, nome: e.nome })));
      } else {
        const paisesRes = await fetch("https://restcountries.com/v3.1/all");
        const paisesJson = await paisesRes.json();
        setPaises(paisesJson.map((p) => p.name.common).sort());
      }
    };
    fetchDados();
    setCidades([]);
  }, [form.categoriaViagem]);

  useEffect(() => {
    const fetchCidades = async () => {
      if (form.categoriaViagem === "NACIONAL" && estado) {
        const estadosRes = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
        const estadosJson = await estadosRes.json();
        const estadoObj = estadosJson.find((e) => e.sigla === estado);
        const cidadesRes = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoObj.id}/municipios`);
        const cidadesJson = await cidadesRes.json();
        setCidades(cidadesJson.map((c) => c.nome));
      }
      
    };
    fetchCidades();
  }, [estado]);

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
            categoriaViagem: viagem.categoriaViagem ?? "NACIONAL",
          });
  
          if (viagem.categoriaViagem === "NACIONAL") {
            const [cidadeSalva, estadoSalvo] = viagem.destino.split(" - ");
            if (cidadeSalva && estadoSalvo) {
              setEstado(estadoSalvo.trim());
              setCidade(cidadeSalva.trim());
            }
          } else if (viagem.categoriaViagem === "INTERNACIONAL") {
            // Extrai cidade e país do destino
            const [cidadeParte, paisParte] = viagem.destino.split(" - ").map((s) => s.trim());
  
            // Encontra o nome original em inglês com base no nome em português
            const paisIngles = Object.keys(paisesTraduzidos).find(
              (key) => paisesTraduzidos[key] === paisParte
            );
  
            setCidadeInternacional(cidadeParte || "");
  
            // Atualiza o form com o destino já correto (sem sobrescrever o país traduzido)
            setForm(prev => ({
              ...prev,
              categoriaViagem: "INTERNACIONAL",
              destino: `${cidadeParte} - ${paisesTraduzidos[paisIngles || ""] || paisParte}`,
            }));
          }
  
          const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
          const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
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

    if (!user) {
      toast.error("Usuário não autenticado. Faça login novamente.", { position: "top-center" });
      return;
    }
    
    setLoading(true);

    try {
      let viagemId: number;

      const viagemRequest = { ...form };

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

  const fetchImagemPaisagemDestino = async (destino: string, categoriaViagem: string): Promise<string> => {
    try {
      const descricaoCustom = id ? localStorage.getItem(`imagemCustom-${id}`) : null;
      const imagem = await getImage(descricaoCustom || destino, categoriaViagem);
      return imagem || "/images/common/beach.jpg";
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      return "/images/common/beach.jpg";
    }
  };
  

  return (
      <section
        className="min-h-screen bg-cover bg-center pt-36 pb-16 px-4"
        style={{ backgroundImage: "url('/images/common/beach.jpg')" }}
      >
      <div className="relative mx-auto max-w-c-1390 px-7.5">

        <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="w-full rounded-lg bg-white p-7.5 shadow-solid-8 md:w-3/5 lg:w-3/4 xl:p-15"
          >
            <div className="relative mb-8">
              <button
                onClick={() => router.push("/profile?tab=minhas-viagens")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:scale-105 transition"
                title="Voltar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-3xl font-semibold text-center text-black">
                {id ? "Editar Viagem" : "Cadastre sua viagem"}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>

{/* Tipo de Viagem */}
<label className="block text-sm font-medium text-gray-700">Tipo de Viagem</label>
<select
  name="categoriaViagem"
  value={form.categoriaViagem}
  onChange={(e) => {
    handleChange(e);
    setEstado("");
    setCidade("");
    setForm(prev => ({ ...prev, destino: "" }));
  }}
  className="input mb-1"
>
  <option value="NACIONAL">Nacional</option>
  <option value="INTERNACIONAL">Internacional</option>
</select>

<p className="text-xs text-gray-500 mb-4">Escolha se a viagem será dentro do Brasil ou para outro país.</p>

{/* País + Cidade/Estado (para internacional) */}
{form.categoriaViagem === "INTERNACIONAL" && (
  <>
    {/* País */}
    <label className="block text-sm font-medium text-gray-700">País</label>
    <select
      name="pais"
      value={form.destino.split(" - ").pop() || ""}
      onChange={(e) => {
        const pais = e.target.value;
        const cidade = cidadeInternacional.trim();
        const paisTraduzido = paisesTraduzidos[pais] || pais;
        const destino = cidade ? `${cidade} - ${paisTraduzido}` : paisTraduzido;
        setForm(prev => ({ ...prev, destino }));
      }}
      className="input mb-1"
    >
      <option value="">Selecione um país</option>
      {paises.map((pais) => (
        <option key={pais} value={pais}>
          {paisesTraduzidos[pais] || pais}
        </option>
      ))}
    </select>
    <p className="text-xs text-gray-500 mb-4">Escolha o país de destino da viagem.</p>

    {/* Cidade/Estado digitado */}
    <label className="block text-sm font-medium text-gray-700">Cidade ou estado</label>
    <input
      type="text"
      value={cidadeInternacional}
      onChange={(e) => {
        const cidade = e.target.value;
        setCidadeInternacional(cidade);
        const paisIngles = paises.find(p => (paisesTraduzidos[p] || p) === form.destino.split(" - ").pop()?.trim());
        const paisTraduzido = paisesTraduzidos[paisIngles || ""] || "";
        const destino = cidade ? `${cidade} - ${paisTraduzido}` : paisTraduzido;
        setForm(prev => ({ ...prev, destino }));
      }}
      className="input mb-1"
      placeholder="Ex: Londres, Paris, Roma..."
    />
    <p className="text-xs text-gray-500 mb-4">Digite a cidade ou estado de destino.</p>
  </>
)}


{/* Estado (para nacional) */}
{form.categoriaViagem === "NACIONAL" && (
  <>
    <label className="block text-sm font-medium text-gray-700">Estado</label>
    <select
      value={estado}
      onChange={(e) => {
        const novoEstado = e.target.value;
        setEstado(novoEstado);
        setCidade("");
        setForm(prev => ({ ...prev, destino: "" }));
      }}
      className="input mb-1"
    >
      <option value="">Selecione um estado</option>
      {estados.map((estado) => (
        <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
      ))}
    </select>
    <p className="text-xs text-gray-500 mb-4">Escolha o estado brasileiro para destino da viagem.</p>

    {estado && (
      <>
        <label className="block text-sm font-medium text-gray-700">Cidade</label>
        <select
          value={cidade}
          onChange={(e) => {
            const novaCidade = e.target.value;
            setCidade(novaCidade);
            setForm(prev => ({ ...prev, destino: `${novaCidade} - ${estado}` }));
          }}
          className="input mb-1"
        >
          <option value="">Selecione uma cidade</option>
          {cidades.map((cidade) => (
            <option key={cidade} value={cidade}>{cidade}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mb-4">Selecione a cidade de destino dentro do estado escolhido.</p>
      </>
    )}
  </>
)}

{/* Destino gerado automaticamente */}
{form.destino && (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">Destino</label>
    <input
      type="text"
      value={form.destino}
      readOnly
      className="input"
    />
    <p className="text-xs text-gray-500 mt-1">Este campo é preenchido automaticamente com base nas seleções acima.</p>
  </div>
)}

{/* Datas */}
<label className="block text-sm font-medium text-gray-700">Data de Início</label>
<input
  type="date"
  name="dataInicio"
  value={form.dataInicio}
  onChange={handleChange}
  className="input mb-1"
/>
<p className="text-xs text-gray-500 mb-4">Data em que a viagem começa.</p>

<label className="block text-sm font-medium text-gray-700">Data de Fim</label>
<input
  type="date"
  name="dataFim"
  value={form.dataFim}
  onChange={handleChange}
  className="input mb-1"
/>
<p className="text-xs text-gray-500 mb-4">Data prevista para o fim da viagem.</p>

{/* Estilo */}
<label className="block text-sm font-medium text-gray-700">Estilo de Viagem</label>
<select name="estilo" value={form.estilo} onChange={handleChange} className="input mb-1">
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
<p className="text-xs text-gray-500 mt-1 mb-4">Qual o estilo principal da viagem que você está planejando.</p>
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

              <div className="flex flex-row gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 font-medium text-white transition-all duration-300
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

                {id && (
                  <button
                    type="button"
                    onClick={() => router.push(`/viagens/cadastrarRoteiro?viagemId=${id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300"
                  >
                    Roteiro 🗺️
                  </button>
                )}
              </div>

            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative w-full md:w-[35%] lg:w-[32%] xl:w-[30%] overflow-hidden rounded-lg bg-white p-4 shadow-md flex flex-col transition-all duration-700"
            style={{
              height: showPreferences ? "760px" : "640px", 
              transition: "height 0.7s ease-in-out",
            }}
          >
            <div className="w-full h-[75%] mb-4">
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
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consulta personalizada de imagem
            </label>
            <input
              type="text"
              value={consultaImagem[1] || form.destino}
              onChange={(e) =>
                setConsultaImagem((prev) => ({ ...prev, 1: e.target.value }))
              }
              placeholder="Ex: Torre Eiffel - Paris - França"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Digite uma nova descrição se quiser alterar a imagem automaticamente buscada para este destino.
            </p>

            <button
              onClick={async () => {
                const descricaoFinal = consultaImagem[1] || form.destino;
                if (id) localStorage.setItem(`imagemCustom-${id}`, descricaoFinal);

                const novaImagem = await getImage(descricaoFinal, form.categoriaViagem);
                setImagemDestino(novaImagem || "/images/common/beach.jpg");
              }}
              className="mt-3 w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded hover:bg-blue-700 transition-all"
            >
              Buscar nova imagem
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CadastroViagem;
