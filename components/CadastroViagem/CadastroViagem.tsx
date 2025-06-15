"use client";

import { cadastrarViagem, editarViagem, getViagemById } from "@/services/viagemService";
import { salvarPreferenciasViagem, getPreferenciaByViagemId } from "@/services/preferenciasService";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getImage } from "@/services/unsplashService";
import { ViagemDTO } from "@/models/ViagemDTO";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { toast } from "sonner";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { 
  Loader2, 
  ArrowLeft,
  Plane, 
  MapPin, 
  Calendar,
  Heart,
  Settings,
  Save,
  Route,
  Camera,
  Globe,
  Map,
  Compass,
  Luggage,
  MessageCircle
} from "lucide-react";
import PreferenciasForm from "@/components/Common/PreferenciasForm";
import { useAuth } from "@/app/context/AuthContext";
import paisesTraduzidos from "@/models/paisesTraduzidos";
import OwnershipGuard from "@/components/Common/OwnershipGuard";

interface CadastroViagemProps {
  viagemId?: string;
}

const CadastroViagem = ({ viagemId }: CadastroViagemProps) => {
  const { usuario } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [imagemDestino, setImagemDestino] = useState<string>("/images/common/beach.jpg");
  const [showPreferences, setShowPreferences] = useState(false);
  const [semPreferencias, setSemPreferencias] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cidadeInternacional, setCidadeInternacional] = useState("");
  const [consultaImagem, setConsultaImagem] = useState<{ [key: number]: string }>({});
  const [paisSelecionado, setPaisSelecionado] = useState("");
  const [voyageOwner, setVoyageOwner] = useState<number | undefined>(undefined);

  const [form, setForm] = useState<Omit<ViagemDTO, "id" | "criadorViagemId">>({
    destino: "",
    dataInicio: "",
    dataFim: "",
    estilo: "AVENTURA",
    status: "RASCUNHO",
    descricao: "",
    categoriaViagem: "NACIONAL",
    numeroMaximoParticipantes: undefined,
    imagemUrl: undefined
  });
  
  const [preferencias, setPreferencias] = useState<PreferenciasDTO>({
    generoPreferido: "MASCULINO",
    petFriendly: false,
    aceitaCriancas: false,
    aceitaFumantes: false,
    aceitaBebidasAlcoolicas: false,
    acomodacaoCompartilhada: false,
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
        const imagemFinal = urlImagem || "/images/common/beach.jpg";
        setImagemDestino(imagemFinal);
        setForm((prev) => ({
          ...prev,
          imagemUrl: urlImagem
        }));
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
          
          setVoyageOwner(viagem.criadorViagemId);
          
          setForm({
            destino: viagem.destino,
            dataInicio: viagem.dataInicio,
            dataFim: viagem.dataFim,
            estilo: viagem.estilo,
            status: viagem.status,
            categoriaViagem: viagem.categoriaViagem ?? "NACIONAL",
            descricao: viagem.descricao || "",
            numeroMaximoParticipantes: viagem.numeroMaximoParticipantes,
            imagemUrl: viagem.imagemUrl
          });

          if (viagem.categoriaViagem === "NACIONAL") {
            const [cidadeSalva, estadoSalvo] = viagem.destino.split(" - ");
            if (cidadeSalva && estadoSalvo) {
              setEstado(estadoSalvo.trim());
              setCidade(cidadeSalva.trim());
            }
          } else if (viagem.categoriaViagem === "INTERNACIONAL") {
            const [cidadeParte, paisParte] = viagem.destino.split(" - ").map((s) => s.trim());
          
            const paisIngles = Object.keys(paisesTraduzidos).find(
              (key) => paisesTraduzidos[key] === paisParte
            );
          
            setCidadeInternacional(cidadeParte || "");
            setPaisSelecionado(paisIngles || "");
          
            setForm(prev => ({
              ...prev,
              categoriaViagem: "INTERNACIONAL",
              destino: `${cidadeParte} - ${paisesTraduzidos[paisIngles || ""] || paisParte}`,
            }));
          }
          if (viagem.imagemUrl) {
            setImagemDestino(viagem.imagemUrl);
          } else {
            const descricaoCustom = localStorage.getItem(`imagemCustom-${viagem.id}`);
            const imagem = await getImage(descricaoCustom || viagem.destino, viagem.categoriaViagem);
            const imagemFinal = imagem || "/images/common/beach.jpg";
            setImagemDestino(imagemFinal);
            if (imagem) {
              setForm(prev => ({ ...prev, imagemUrl: imagem }));
            }
          }

          const preferenciasSalvas = await getPreferenciaByViagemId(id);
          if (preferenciasSalvas !== null) {
            setPreferencias(preferenciasSalvas);
            setSemPreferencias(false);
          } else {
            setSemPreferencias(true);
          }
        } catch (error) {
          console.error("Erro ao carregar viagem:", error);
          toast.error("Erro ao carregar dados da viagem.");
          router.push("/profile?tab=viagens");
        }
      }
    };
    carregarViagem();
  }, [id, router]);
  

  if (!hasMounted) return null;  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | undefined = value;
    
    if (name === "numeroMaximoParticipantes") {
      if (value === "" || value === "0") {
        processedValue = undefined;
      } else {
        processedValue = parseInt(value, 10);
      }
    }
    
    setForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleParticipantesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      const processedValue = value === "" ? undefined : parseInt(value, 10);
      setForm((prev) => ({
        ...prev,
        numeroMaximoParticipantes: processedValue,
      }));
    }
  };
  const handleDescricaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      descricao: value,
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    
    setPreferencias((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    }));

    if (semPreferencias) {
      setSemPreferencias(false);
    }
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

    if (!usuario) {
      toast.error("Usuário não autenticado. Faça login novamente.", { position: "top-center" });
      return;
    }
    
    setLoading(true);      try {
        let viagemId: number;

        const viagemRequest = { ...form };

        if (id) {
          const viagemAtualizada = await editarViagem(id, { ...viagemRequest, id });
          viagemId = id;
          
          setForm(prev => ({ ...prev, status: viagemAtualizada.status }));
          
          toast.success("Viagem atualizada com sucesso!", { position: "top-center" });
        } else {
          const viagemSalva = await cadastrarViagem({ ...viagemRequest, id: 0 });
          viagemId = viagemSalva.id;

          if (!viagemId || viagemId === 0) {
            throw new Error("Erro ao cadastrar viagem: ID não retornado ou inválido.");
          }

          setForm(prev => ({ ...prev, status: viagemSalva.status }));

          toast.success("Viagem cadastrada com sucesso!", { position: "top-center" });
        }       
        try {
          await salvarPreferenciasViagem(viagemId, preferencias);
          toast.success("Preferências salvas com sucesso!", { position: "top-center" });
        } catch (prefError) {
          toast.warning("Viagem salva, mas houve um problema ao salvar as preferências.");
        }

        router.push("/profile?tab=viagens");
      } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar viagem ou preferências. Tente novamente.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };  const fetchImagemPaisagemDestino = async (destino: string, categoriaViagem: string): Promise<string> => {
    try {
      const descricaoCustom = id ? localStorage.getItem(`imagemCustom-${id}`) : null;
      const imagem = await getImage(descricaoCustom || destino, categoriaViagem);
      return imagem || "/images/common/beach.jpg";
    } catch (error) {
      console.warn("Erro ao buscar imagem:", error);
      return "/images/common/beach.jpg";
    }
  };
  
  const content = (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100">
      <div className="absolute inset-0 z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-sky-100/20 via-orange-50/15 to-blue-50/25"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08), rgba(173, 216, 230, 0.12))",
              "linear-gradient(135deg, rgba(255, 165, 0, 0.08), rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08))",
              "linear-gradient(45deg, rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08), rgba(173, 216, 230, 0.12))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -100, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.div
          className="absolute top-32 right-16"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Plane className="w-8 h-8 text-orange-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20"
          animate={{ 
            y: [0, -18, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <Compass className="w-9 h-9 text-green-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-48 left-40"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 8, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Camera className="w-6 h-6 text-purple-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-24"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Map className="w-7 h-7 text-red-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-64 right-40"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Luggage className="w-8 h-8 text-indigo-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-36 right-64"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Globe className="w-9 h-9 text-teal-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-48"
          animate={{ 
            y: [0, -8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8
          }}
        >
          <Heart className="w-6 h-6 text-pink-500/30 drop-shadow-lg" />
        </motion.div>
      </div>

      {loading && (
        <motion.div 
          className="fixed inset-0 bg-white/80 backdrop-blur-xl z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Salvando viagem...</p>
            <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
          </motion.div>
        </motion.div>
      )}      <div className="relative z-20 min-h-screen flex items-center justify-center p-4 pt-32">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 lg:max-w-4xl"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-3xl" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => router.push("/profile?tab=minhas-viagens")}
                      className="flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-white/90 transition-all duration-300 group"
                      title="Voltar"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                    </button>
                    
                    <h1 className="text-3xl md:text-4xl font-bold">
                      <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent">
                        {id ? "Editar Viagem" : "Nova Viagem"}
                      </span>
                    </h1>
                  </div>
                  
                  <p className="text-gray-600 text-lg">
                    {id ? "Atualize os detalhes da sua viagem" : "Planeje sua próxima aventura"}
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-800">Tipo de Viagem</h3>
                    </div>                    <div className="relative group">
                      <select
                        name="categoriaViagem"
                        value={form.categoriaViagem}
                        onChange={(e) => {
                          handleChange(e);
                          setEstado("");
                          setCidade("");
                          setForm(prev => ({ ...prev, destino: "" }));
                        }}
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
                      >
                        <option value="NACIONAL">Nacional</option>
                        <option value="INTERNACIONAL">Internacional</option>
                      </select>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>                    <p className="text-sm text-gray-500">Escolha se a viagem será dentro do Brasil ou para outro país.</p>                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-800">Destino</h3>
                    </div>                  
                    {form.categoriaViagem === "INTERNACIONAL" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <select
                            name="pais"
                            value={paisSelecionado}
                            onChange={(e) => {
                              const pais = e.target.value;
                              setPaisSelecionado(pais);
                              const cidade = cidadeInternacional.trim();
                              const paisTraduzido = paisesTraduzidos[pais] || pais;
                              const destino = cidade ? `${cidade} - ${paisTraduzido}` : paisTraduzido;
                              setForm(prev => ({ ...prev, destino }));
                            }}
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
                          >
                            <option value="">Selecione um país</option>
                            {paises.map((pais) => (
                              <option key={pais} value={pais}>
                                {paisesTraduzidos[pais] || pais}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        <div className="relative group">
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
                            placeholder="Ex: Londres, Paris, Roma..."
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>
                      </div>
                    )}                  
                    {form.categoriaViagem === "NACIONAL" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <select
                            value={estado}
                            onChange={(e) => {
                              const novoEstado = e.target.value;
                              setEstado(novoEstado);
                              setCidade("");
                              setForm(prev => ({ ...prev, destino: "" }));
                            }}
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
                          >
                            <option value="">Selecione um estado</option>
                            {estados.map((estado) => (
                              <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
                            ))}
                          </select>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        {estado && (
                          <div className="relative group">
                            <select
                              value={cidade}
                              onChange={(e) => {
                                const novaCidade = e.target.value;
                                setCidade(novaCidade);
                                setForm(prev => ({ ...prev, destino: `${novaCidade} - ${estado}` }));
                              }}
                              className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
                            >
                              <option value="">Selecione uma cidade</option>
                              {cidades.map((cidade) => (
                                <option key={cidade} value={cidade}>{cidade}</option>
                              ))}
                            </select>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                          </div>
                        )}
                      </div>
                    )}

                    {form.destino && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Destino Selecionado</span>
                        </div>
                        <p className="text-green-700 font-semibold">{form.destino}</p>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.6 }}
                    className="space-y-4"
                  >                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-800">Descrição da Viagem</h3>
                    </div>

                    <div className="relative group">
                      <textarea
                        name="descricao"
                        value={form.descricao}
                        onChange={handleDescricaoChange}
                        placeholder="Descreva brevemente a sua viagem, compartilhe detalhes interessantes ou expectativas..."
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 resize-none h-32"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>
                    <p className="text-sm text-gray-500">Uma breve descrição da sua viagem ajudará os outros viajantes a conhecer melhor o seu plano.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-800">Datas da Viagem</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                        <input
                          type="date"
                          name="dataInicio"
                          value={form.dataInicio}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 group-hover:bg-white/80"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      </div>

                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
                        <input
                          type="date"
                          name="dataFim"
                          value={form.dataFim}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 group-hover:bg-white/80"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      </div>                    </div>
                    <p className="text-sm text-gray-500">Defina o período da sua viagem.</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Luggage className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-800">Número de Participantes</h3>
                    </div>                    <div className="relative group">
                      <input
                        type="number"
                        name="numeroMaximoParticipantes"
                        value={form.numeroMaximoParticipantes || ""}
                        onChange={handleParticipantesChange}
                        placeholder="Número máximo de participantes (opcional)"
                        min="1"
                        max="50"
                        step="1"
                        className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>
                    <p className="text-sm text-gray-500">Defina quantas pessoas podem participar da sua viagem. Aceita apenas números inteiros de 1 a 50 (deixe em branco para sem limite).</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-gray-800">Estilo de Viagem</h3>
                      </div>

                      <div className="relative group">
                        <select 
                          name="estilo" 
                          value={form.estilo} 
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
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
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      </div>
                      <p className="text-sm text-gray-500">Qual o estilo principal da viagem.</p>
                    </div>

                    {/* Seção de Status da Viagem - apenas na edição */}
                    {id && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Settings className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold text-gray-800">Status da Viagem</h3>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                          <p className="text-sm text-blue-800 mb-3">
                            <span className="font-semibold">Status selecionado:</span>{" "}
                            {form.status === "CONFIRMADA"
                              ? "Confirmada ✅"
                              : form.status === "CANCELADA"
                              ? "Cancelada ❌"
                              : form.status === "PENDENTE"
                              ? "Pendente ⏳"
                              : "Rascunho ✍️"}
                          </p>
                          
                          <p className="text-xs text-blue-700 mb-3 italic">
                            💡 <strong>Importante:</strong> Apenas viagens <strong>PENDENTES</strong> e <strong>CONFIRMADAS</strong> aparecem nas buscas públicas para outros usuários. Viagens passam para "Pendente" automaticamente quando você gera um roteiro.
                          </p>

                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, status: "CONFIRMADA" }))}
                                className={`px-3 py-1.5 text-sm rounded-xl border font-medium transition-all duration-300 ${
                                  form.status === "CONFIRMADA"
                                    ? "border-green-600 bg-green-50 text-green-800"
                                    : "border-green-400 text-green-600 hover:bg-green-50"
                                }`}
                              >
                                ✅ {form.status === "CONFIRMADA" ? "✓" : ""} Confirmada
                              </button>

                              <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, status: "CANCELADA" }))}
                                className={`px-3 py-1.5 text-sm rounded-xl border font-medium transition-all duration-300 ${
                                  form.status === "CANCELADA"
                                    ? "border-red-600 bg-red-50 text-red-800"
                                    : "border-red-400 text-red-600 hover:bg-red-50"
                                }`}
                              >
                                ❌ {form.status === "CANCELADA" ? "✓" : ""} Cancelada
                              </button>
                            </div>
                            
                            <p className="text-xs text-gray-500">
                              • <strong>Pendente:</strong> Viagem com roteiro gerado, aparece nas buscas públicas (status automático)
                              <br />
                              • <strong>Confirmada:</strong> Viagem pronta para receber participantes, aparece nas buscas
                              <br />
                              • <strong>Cancelada:</strong> Viagem cancelada (ação irreversível)
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          Altere o status conforme necessário. Atenção: cancelar uma viagem é uma ação irreversível.
                        </p>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <button
                      type="button"
                      className="flex items-center gap-3 p-4 w-full bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-white/90 transition-all duration-300"
                      onClick={() => setShowPreferences(!showPreferences)}
                    >
                      <Settings className="h-5 w-5 text-primary" />
                      <span className="text-lg font-semibold text-gray-800 flex-1 text-left">
                        Preferências da Viagem
                      </span>
                      {showPreferences ? (
                        <FaChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <FaChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                    </button>

                    <AnimatePresence>
                      {showPreferences && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >                          <div className="p-6 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl">
                            {semPreferencias && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Heart className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-blue-900 font-semibold text-base mb-2">
                                      Preferências não cadastradas
                                    </h4>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                      Você ainda não possui preferências cadastradas para esta viagem. 
                                      <br />
                                      <strong>Configure suas preferências abaixo</strong> para encontrar companheiros de viagem ideais!
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                            <PreferenciasForm
                              preferencias={preferencias}
                              handlePreferenceChange={handlePreferenceChange}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6"
                  >
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-lg relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            {id ? "Atualizar Viagem" : "Cadastrar Viagem"}
                          </>
                        )}
                      </span>
                    </motion.button>

                    {id && (
                      <motion.button
                        type="button"
                        onClick={() => router.push(`/viagens/cadastrarRoteiro?viagemId=${id}`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                          initial={false}
                        />
                        <span className="relative z-10 flex items-center gap-3">
                          <Route className="h-5 w-5" />
                          Criar Roteiro
                        </span>
                      </motion.button>
                    )}
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-80 xl:w-96"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 relative overflow-hidden sticky top-8">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-3xl" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-800">Prévia do Destino</h3>
                </div>

                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100">
                  <motion.img
                    key={imagemDestino}
                    src={imagemDestino}
                    alt="Imagem do destino"
                    className="object-cover w-full h-full"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Personalizar imagem do destino
                  </label>
                  
                  <div className="relative group">
                    <input
                      type="text"
                      value={consultaImagem[1] || form.destino}
                      onChange={(e) =>
                        setConsultaImagem((prev) => ({ ...prev, 1: e.target.value }))
                      }
                      placeholder="Ex: Torre Eiffel - Paris - França"
                      className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 text-sm"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Digite uma nova descrição se quiser alterar a imagem automaticamente buscada para este destino.
                  </p>                  <motion.button
                    type="button"
                    onClick={async () => {
                      const descricaoFinal = consultaImagem[1] || form.destino;
                      if (id) localStorage.setItem(`imagemCustom-${id}`, descricaoFinal);
                      const novaImagem = await getImage(descricaoFinal, form.categoriaViagem);
                      const imagemFinal = novaImagem || "/images/common/beach.jpg";
                      setImagemDestino(imagemFinal);
                      // Atualizar o form com a nova URL da imagem
                      setForm((prev) => ({
                        ...prev,
                        imagemUrl: novaImagem || undefined // Salvar apenas URLs válidas, não a imagem padrão
                      }));
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Camera className="h-4 w-4" />
                      Buscar nova imagem
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  // Se for edição, aplicar o OwnershipGuard
  if (id) {
    return (
      <OwnershipGuard
        resourceOwnerId={voyageOwner}
        resourceType="viagem"
        resourceId={id}
        fallbackRoute="/profile?tab=viagens"
      >
        {content}
      </OwnershipGuard>
    );
  }

  return content;
};

export default CadastroViagem;
