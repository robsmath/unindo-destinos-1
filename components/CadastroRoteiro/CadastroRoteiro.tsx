"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  deletarRoteiroByViagemId,
  atualizarRoteiro,
  gerarRoteiroComIa,
  getRoteiroByViagemId,
  baixarRoteiroPdf,
  clearRoteiroCache,
} from "@/services/roteiroService";
import { getViagemById, getParticipantesDaViagem } from "@/services/viagemService";
import LoadingOverlay from "@/components/Common/LoadingOverlay";
import EnviarRoteiroModal from "@/components/Modals/EnviarRoteiroModal";
import { usePerfil } from "@/app/context/PerfilContext";
import { formatarDataViagem } from "@/utils/dateUtils";
import { 
  Loader2, 
  CheckCircle2, 
  Pencil, 
  Mail, 
  Trash2, 
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Settings,
  Plus,
  Download,
  Send,
  Save,
  Wand2,
  Clock,
  FileText,
  Target
} from "lucide-react";
import { ViagemDTO } from "@/models/ViagemDTO";

type TipoViagem = "ECONOMICA" | "CONFORTAVEL" | "LUXO";

interface Props {
  viagemId: string;
}

const CadastroRoteiro: React.FC<Props> = ({ viagemId }) => {
  const router = useRouter();
  const { usuario } = usePerfil();

  const [loading, setLoading] = useState(false);
  const [loadingTela, setLoadingTela] = useState(true);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [valorEstimado, setValorEstimado] = useState("R$ 0,00");
  const [tipoViagem, setTipoViagem] = useState<TipoViagem>("CONFORTAVEL");
  const [roteiroId, setRoteiroId] = useState<number | null>(null);
  const [roteiroInexistente, setRoteiroInexistente] = useState(false);
  const [diasRoteiro, setDiasRoteiro] = useState([{ titulo: "", descricao: "" }]);
  const [observacoesFinais, setObservacoesFinais] = useState("");
  const [modoCriacao, setModoCriacao] = useState<"MANUAL" | "IA">("MANUAL");
  const [mostrarModalEmail, setMostrarModalEmail] = useState(false);
  const [viagem, setViagem] = useState<ViagemDTO | null>(null);
  const [souCriador, setSouCriador] = useState(false);
  const [limiteGeracaoAtingido, setLimiteGeracaoAtingido] = useState(false);
  const [viagemOwnerId, setViagemOwnerId] = useState<number | undefined>(undefined);
  const [usuarioTemAcesso, setUsuarioTemAcesso] = useState<boolean | null>(null);
  const [ehParticipante, setEhParticipante] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Cache-Control';
      meta.content = 'no-cache, no-store, must-revalidate';
      document.head.appendChild(meta);
      
      const pragma = document.createElement('meta');
      pragma.httpEquiv = 'Pragma';
      pragma.content = 'no-cache';
      document.head.appendChild(pragma);

      const expires = document.createElement('meta');
      expires.httpEquiv = 'Expires';
      expires.content = '0';
      document.head.appendChild(expires);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!viagemId) return;
      
      try {
        setLoadingTela(true);
        
        if (typeof window !== 'undefined') {
          const refreshKey = `fresh_data_${viagemId}`;
          const shouldRefresh = !sessionStorage.getItem(refreshKey);
          
          if (shouldRefresh) {
            sessionStorage.setItem(refreshKey, 'true');
            await clearRoteiroCache(Number(viagemId));
          }
        }
        
        const [viagemData, participantes] = await Promise.all([
          getViagemById(Number(viagemId)),
          getParticipantesDaViagem(Number(viagemId))
        ]);
        
        setViagem(viagemData);
        setViagemOwnerId(viagemData.criadorViagemId);
        
        const usuarioEhCriador = viagemData.criadorViagemId === usuario?.id;
        const usuarioEhParticipante = participantes.some(p => p.id === usuario?.id);
        
        setSouCriador(usuarioEhCriador);
        setEhParticipante(usuarioEhParticipante);
        setUsuarioTemAcesso(usuarioEhCriador || usuarioEhParticipante);
        const roteiro = await getRoteiroByViagemId(Number(viagemId));
        if (roteiro) {
          setRoteiroId(roteiro.id);
          setObservacao(roteiro.observacao || "");
          setValorEstimado(
            roteiro.valorEstimado
              ? new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(roteiro.valorEstimado)
              : "R$ 0,00"
          );
          setTipoViagem(roteiro.tipoViagem || "CONFORTAVEL");
          
          if (roteiro.tentativasGeracaoRoteiro && roteiro.tentativasGeracaoRoteiro >= 3) {
            setLimiteGeracaoAtingido(true);
          }
          
          const resultado = parseDescricaoComObservacoes(roteiro.descricao || "");
          setDiasRoteiro(resultado.dias);
          setObservacoesFinais(resultado.observacoesFinais);
          setRoteiroInexistente(false);
        } else {
          setRoteiroInexistente(true);
          // Inicializa com um dia vazio para criação manual
          setDiasRoteiro([{ titulo: "", descricao: "" }]);
          setObservacoesFinais("");
        }
      } catch (error) {
        console.error("Erro ao carregar dados da viagem:", error);
        
        if (error?.response?.status === 404) {
          setRoteiroInexistente(true);
        } else if (error?.response?.status === 403) {
          setUsuarioTemAcesso(false);
        } else {
          toast.error("Erro ao carregar dados da viagem");
          setRoteiroInexistente(true);
        }
      } finally {
        setLoadingTela(false);
      }
    };

    fetchData();
  }, [viagemId, usuario]);

  const parseDescricaoComObservacoes = (descricao: string) => {
    const linhas = descricao.split("\n");
    const dias: { titulo: string; descricao: string }[] = [];
    let observacoesFinais = "";
    let diaAtual: { titulo: string; descricao: string } | null = null;
    let dentroObservacoes = false;

    for (const linha of linhas) {
      if (linha.startsWith("#### ")) {
        if (diaAtual) dias.push(diaAtual);
        diaAtual = { titulo: linha.replace("#### ", ""), descricao: "" };
        dentroObservacoes = false;
      } else if (linha.startsWith("### Observações Finais:")) {
        if (diaAtual) {
          dias.push(diaAtual);
          diaAtual = null;
        }
        dentroObservacoes = true;
      } else if (dentroObservacoes) {
        observacoesFinais += linha + "\n";
      } else if (diaAtual && linha.trim()) {
        diaAtual.descricao += linha + "\n";
      }
    }

    if (diaAtual) dias.push(diaAtual);

    dias.forEach((dia) => {
      dia.descricao = dia.descricao.trim();
    });

    if (dias.length === 0) {
      dias.push({ titulo: "", descricao: "" });
    }

    return { dias, observacoesFinais: observacoesFinais.trim() };
  };

  const montarDescricaoFromDias = () => {
    const blocosDias = diasRoteiro
      .map((dia) => `#### ${dia.titulo}\n${dia.descricao}`)
      .join("\n\n");

    const blocoObs = observacoesFinais ? `\n\n### Observações Finais:\n${observacoesFinais}` : "";

    return blocosDias + blocoObs;
  };

  const adicionarDia = () => {
    setDiasRoteiro([...diasRoteiro, { titulo: "", descricao: "" }]);
  };

  const removerDia = (index: number) => {
    const novosDias = [...diasRoteiro];
    novosDias.splice(index, 1);
    setDiasRoteiro(novosDias);
  };

  const atualizarDia = (index: number, field: "titulo" | "descricao", value: string) => {
    const novosDias = [...diasRoteiro];
    novosDias[index][field] = value;
    setDiasRoteiro(novosDias);
  };

  const formatarValor = (valor: string) => {
    const numeroLimpo = valor.replace(/\D/g, "");
    const numeroFormatado = (parseFloat(numeroLimpo) / 100).toFixed(2);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(numeroFormatado));
  };

  const salvarRoteiroManual = async () => {
    if (!roteiroId) {
      toast.error("ID do roteiro não encontrado.");
      return;
    }

    try {
      setLoadingSalvar(true);
      const valorEmNumero = parseFloat(valorEstimado.replace(/\D/g, "")) / 100;
      await atualizarRoteiro(roteiroId, {
        observacao,
        valorEstimado: valorEmNumero,
        tipoViagem,
        descricao: montarDescricaoFromDias(),
      });
      toast.success("Roteiro atualizado com sucesso!", {
        icon: <CheckCircle2 className="text-green-600" />,
      });
    } catch {
      toast.error("Erro ao atualizar o roteiro.", {
        icon: <AlertTriangle className="text-red-600" />,
      });
    } finally {
      setLoadingSalvar(false);
    }
  };

  const criarRoteiroManual = async () => {
    if (!viagemId) return;

    // Validação: verifica se há pelo menos um dia com título ou descrição
    const temConteudo = diasRoteiro.some(dia => dia.titulo.trim() || dia.descricao.trim());
    if (!temConteudo) {
      toast.error("Adicione pelo menos um dia com título ou descrição para criar o roteiro.", {
        icon: <AlertTriangle className="text-red-600" />,
      });
      return;
    }

    try {
      setLoadingSalvar(true);
      const valorEmNumero = parseFloat(valorEstimado.replace(/\D/g, "")) / 100;
      
      // Primeiro cria um roteiro básico via IA apenas para gerar o registro
      await gerarRoteiroComIa(Number(viagemId), { 
        observacao: "Roteiro criado manualmente", 
        tipoViagem
      });

      // Busca o roteiro criado
      const roteiro = await getRoteiroByViagemId(Number(viagemId));
      if (roteiro) {
        setRoteiroId(roteiro.id);
        
        // Agora atualiza com os dados manuais do usuário
        await atualizarRoteiro(roteiro.id, {
          observacao,
          valorEstimado: valorEmNumero,
          tipoViagem,
          descricao: montarDescricaoFromDias(),
        });
        
        setRoteiroInexistente(false);
        toast.success("Roteiro criado com sucesso!", {
          icon: <CheckCircle2 className="text-green-600" />,
        });
      }
    } catch (error: any) {
      console.error("Erro ao criar roteiro:", error);
      toast.error("Erro ao criar o roteiro. Tente novamente.", {
        icon: <AlertTriangle className="text-red-600" />,
      });
    } finally {
      setLoadingSalvar(false);
    }
  };

  const gerarComIA = async () => {
    if (!viagemId) return;
    
    if (roteiroId) {
      const toastId = Math.random().toString();
      toast.custom(
        (id) => (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="text-amber-600 h-5 w-5" />
              <h3 className="font-semibold text-gray-900">Roteiro já existe</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Já existe um roteiro cadastrado. Deseja substituí-lo pelo novo roteiro gerado pela IA?
            </p>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  toast.dismiss(id);                  try {
                    setLoading(true);
                    await deletarRoteiroByViagemId(Number(viagemId));
                    await gerarRoteiroComIa(Number(viagemId), { observacao, tipoViagem });
                    const roteiro = await getRoteiroByViagemId(Number(viagemId));
                    if (roteiro) {
                      setRoteiroId(roteiro.id);
                      setObservacao(roteiro.observacao || "");
                      setValorEstimado(
                        roteiro.valorEstimado
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(roteiro.valorEstimado)
                          : "R$ 0,00"                      );
                      setTipoViagem(roteiro.tipoViagem || "CONFORTAVEL");
                      
                      if (roteiro.tentativasGeracaoRoteiro && roteiro.tentativasGeracaoRoteiro >= 3) {
                        setLimiteGeracaoAtingido(true);
                      }
                      
                      const resultado = parseDescricaoComObservacoes(roteiro.descricao || "");
                      setDiasRoteiro(resultado.dias);
                      setObservacoesFinais(resultado.observacoesFinais);
                      setModoCriacao("MANUAL");
                      setRoteiroInexistente(false);
                      toast.success("Roteiro gerado e preenchido com sucesso!");
                    }} catch (error: any) {
                    console.error("Erro ao substituir roteiro:", error);
                    if (error?.response?.data?.message?.includes("Limite máximo de 3 gerações de roteiro atingido")) {
                      setLimiteGeracaoAtingido(true);
                      toast.error("Limite máximo de 3 gerações atingido para esta viagem. Você só pode editar o roteiro manualmente agora.", {
                        icon: <AlertTriangle className="text-red-600" />,
                        duration: 6000,
                      });
                    } else if (error?.response?.status !== 404) { 
                      toast.error("Erro ao substituir o roteiro.");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Substituir
              </button>
              <button
                onClick={() => toast.dismiss(id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        ),
        { id: toastId, duration: 10000 }
      );

      return;
    }

    setLoading(true);    try {
      await gerarRoteiroComIa(Number(viagemId), { observacao, tipoViagem });

      const roteiroGerado = await getRoteiroByViagemId(Number(viagemId));
      if (roteiroGerado) {
        setRoteiroId(roteiroGerado.id);
        setObservacao(roteiroGerado.observacao || "");
        setValorEstimado(
          roteiroGerado.valorEstimado
            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                roteiroGerado.valorEstimado
              )
            : "R$ 0,00"
        );        setTipoViagem(roteiroGerado.tipoViagem || "CONFORTAVEL");
        
        if (roteiroGerado.tentativasGeracaoRoteiro && roteiroGerado.tentativasGeracaoRoteiro >= 3) {
          setLimiteGeracaoAtingido(true);
        }
        
        const resultado = parseDescricaoComObservacoes(roteiroGerado.descricao || "");
        setDiasRoteiro(resultado.dias);
        setObservacoesFinais(resultado.observacoesFinais);
        setModoCriacao("MANUAL");
        setRoteiroInexistente(false);

        toast.success("Roteiro gerado e preenchido com sucesso!", {
          icon: <CheckCircle2 className="text-green-600" />,
        });
      }} catch (error: any) {
      console.error("Erro ao gerar roteiro:", error);
      if (error?.response?.data?.message?.includes("Limite máximo de 3 gerações de roteiro atingido")) {
        setLimiteGeracaoAtingido(true);
        toast.error("Limite máximo de 3 gerações atingido para esta viagem. Você só pode editar o roteiro manualmente agora.", {
          icon: <AlertTriangle className="text-red-600" />,
          duration: 6000,
        });
      } else if (error?.response?.status !== 404) {
        toast.error("Erro ao gerar o roteiro. Tente novamente.", {
          icon: <AlertTriangle className="text-red-600" />,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const forcarLimpezaCompleta = async () => {
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove = [
          `roteiro_cache_${viagemId}`,
          `fresh_data_${viagemId}`,
          `roteiro_data_${viagemId}`
        ];
        
        keysToRemove.forEach(key => {
          sessionStorage.removeItem(key);
          localStorage.removeItem(key);
        });
        
        await clearRoteiroCache(Number(viagemId));
        
        setTimeout(() => {
          window.location.reload();
        }, 100);
        
      } catch (error) {
        console.error('Erro ao limpar cache:', error);
        toast.error('Erro ao limpar cache');
      }
    }
  };

  const baixarPdf = async () => {
    if (!roteiroId) {
      toast.error("ID do roteiro não encontrado.");
      return;
    }

    try {
      setLoadingPdf(true);
      const blob = await baixarRoteiroPdf(roteiroId);
      
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `roteiro-${viagem?.destino || 'viagem'}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      toast.error("Erro ao baixar o PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  if (usuarioTemAcesso === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-red-100">
        <motion.div
          className="text-center space-y-6 p-8 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Acesso Negado
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Você não tem permissão para acessar este roteiro. 
              Apenas o criador da viagem e participantes podem visualizar.
            </p>
          </div>

          <motion.button
            onClick={() => router.push("/profile?tab=viagens")}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minhas Viagens
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (usuarioTemAcesso === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Verificando permissões...
            </h2>
            <p className="text-gray-600">
              Aguarde enquanto verificamos se você tem acesso a este roteiro.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {(loading || loadingPdf || loadingEmail) && (
          <LoadingOverlay
            isVisible={loading || loadingPdf || loadingEmail}
            message={
              loading 
                ? "Gerando roteiro..."
                : loadingPdf 
                ? "Gerando PDF..."
                : "Enviando roteiro..."
            }
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 -z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(249, 115, 22, 0.08), rgba(251, 146, 60, 0.12), rgba(234, 88, 12, 0.08))",
              "linear-gradient(135deg, rgba(234, 88, 12, 0.08), rgba(249, 115, 22, 0.12), rgba(251, 146, 60, 0.08))",
              "linear-gradient(45deg, rgba(249, 115, 22, 0.08), rgba(251, 146, 60, 0.12), rgba(234, 88, 12, 0.08))"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-full"
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
      </div>

      <div className="relative min-h-screen overflow-hidden">        
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(234, 88, 12, 0.08), rgba(251, 146, 60, 0.12), rgba(249, 115, 22, 0.08))",
                "linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(234, 88, 12, 0.12), rgba(251, 146, 60, 0.08))",
                "linear-gradient(45deg, rgba(234, 88, 12, 0.08), rgba(251, 146, 60, 0.12), rgba(249, 115, 22, 0.08))"
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
            <MapPin className="w-8 h-8 text-red-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-20"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          >
            <Calendar className="w-7 h-7 text-blue-500/30 drop-shadow-lg" />
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
            <Target className="w-6 h-6 text-purple-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute bottom-40 right-24"
            animate={{ 
              y: [0, 12, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <FileText className="w-7 h-7 text-green-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute top-64 right-40"
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Clock className="w-6 h-6 text-orange-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute top-36 right-64"
            animate={{ 
              y: [0, -18, 0],
              rotate: [0, -12, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Settings className="w-8 h-8 text-gray-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-48"
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8
            }}          >
            <Wand2 className="w-6 h-6 text-pink-500/30 drop-shadow-lg" />
          </motion.div>
        </div>

        <div className="relative z-20 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => router.back()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-2xl transition-all duration-200 shadow-lg border border-white/30"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700" />
                </motion.button>
                
                <div className="flex items-center gap-3">                  <motion.div 
                    className="p-3 bg-gradient-to-r from-orange-500 to-primary rounded-2xl shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <div>
                    <motion.h1 
                      className="text-2xl font-bold text-gray-900"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Roteiro de Viagem
                    </motion.h1>
                    <motion.p
                      className="text-sm text-gray-600"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {viagem?.destino || "Planeje sua aventura"}
                    </motion.p>
                  </div>
                </div>
              </div>
              
              {!roteiroInexistente && (
                <motion.div 
                  className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-2xl text-sm font-medium shadow-lg border ${
                    souCriador 
                      ? "bg-green-100/80 text-green-700 border-green-200/50"
                      : "bg-blue-100/80 text-blue-700 border-blue-200/50"
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {souCriador ? "Roteiro Criado" : "Visualizando Roteiro"}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {loadingTela ? (
              <motion.div 
                key="loading"
                className="flex flex-col items-center justify-center h-[400px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="relative mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}                >
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500/20 to-primary/20 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>
                <motion.p 
                  className="text-lg font-medium text-gray-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Carregando roteiro...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {roteiroInexistente ? (
                  <motion.div 
                    className="bg-amber-50/80 backdrop-blur-xl border border-amber-200/50 rounded-3xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="p-3 bg-amber-100/80 backdrop-blur-sm rounded-2xl shadow-sm"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Sparkles className="w-6 h-6 text-amber-600" />
                      </motion.div>
                      <div>
                        <motion.h3 
                          className="font-semibold text-amber-900 mb-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          Pronto para começar?
                        </motion.h3>
                        <motion.p 
                          className="text-amber-700"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          Nenhum roteiro foi cadastrado para esta viagem ainda. Você pode criar manualmente dia por dia ou gerar automaticamente com IA!
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="bg-emerald-50/80 backdrop-blur-xl border border-emerald-200/50 rounded-3xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="p-3 bg-emerald-100/80 backdrop-blur-sm rounded-2xl shadow-sm"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </motion.div>
                      <div>                        <motion.h3 
                          className="font-semibold text-emerald-900 mb-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          {souCriador ? "Roteiro criado com sucesso!" : "Visualizando roteiro da viagem"}
                        </motion.h3>
                        <motion.p 
                          className="text-emerald-700"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          {souCriador 
                            ? "Seu roteiro personalizado está pronto. Você pode editá-lo, baixar em PDF ou compartilhar com outros participantes."
                            : "Como participante desta viagem, você pode visualizar o roteiro, baixar em PDF e enviar para seu e-mail. Apenas o criador da viagem pode fazer edições."
                          }
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                )}                
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                  <motion.div 
                    className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-primary px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-white" />
                        <h2 className="text-base sm:text-lg font-semibold text-white">Configurações do Roteiro</h2>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-6">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Wand2 className="w-4 h-4" />
                          Modo de Criação
                        </label>
                        <div className="grid grid-cols-2 gap-3">                          <motion.button
                            onClick={() => setModoCriacao("MANUAL")}
                            disabled={!souCriador}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              modoCriacao === "MANUAL"
                                ? "border-primary bg-orange-50 text-primary"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            } ${!souCriador ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Pencil className="w-5 h-5" />
                              <span className="font-medium">Manual</span>
                            </div>
                          </motion.button>
                          
                          <motion.button
                            onClick={() => setModoCriacao("IA")}
                            disabled={!souCriador}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              modoCriacao === "IA"
                                ? "border-orange-400 bg-orange-50 text-orange-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            } ${!souCriador ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              <span className="font-medium">IA</span>
                            </div>
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <FileText className="w-4 h-4" />
                          Observação para IA
                        </label>
                        <textarea
                          value={observacao}
                          onChange={(e) => setObservacao(e.target.value)}
                          disabled={!souCriador}
                          placeholder="Descreva suas preferências para o roteiro..."
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none h-24 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>                      
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Target className="w-4 h-4" />
                          Tipo de Viagem
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {(["ECONOMICA", "CONFORTAVEL", "LUXO"] as TipoViagem[]).map((tipo) => {
                            const labels = {
                              ECONOMICA: "Econômica",
                              CONFORTAVEL: "Confortável", 
                              LUXO: "Luxo"
                            };
                            
                            return (
                              <motion.button
                                key={tipo}
                                onClick={() => setTipoViagem(tipo)}
                                disabled={!souCriador}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 sm:p-2 rounded-xl border-2 transition-all duration-200 text-center ${
                                  tipoViagem === tipo
                                    ? "border-primary bg-orange-50 text-primary"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                } ${!souCriador ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                <span className="font-medium text-sm">{labels[tipo]}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <DollarSign className="w-4 h-4" />
                          Valor Estimado
                        </label>
                        <input
                          type="text"
                          value={valorEstimado}
                          onChange={(e) => setValorEstimado(formatarValor(e.target.value))}
                          disabled={!souCriador || modoCriacao === "IA"}
                          placeholder="R$ 0,00"
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>                      
                      {souCriador && (
                        <div className="flex flex-col gap-3 pt-4">
                          {limiteGeracaoAtingido && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                              <div className="flex items-center gap-2 text-amber-800">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                  Limite de gerações atingido (3/3)
                                </span>
                              </div>
                              <p className="text-sm text-amber-700 mt-1">
                                Você não pode mais gerar roteiros com IA para esta viagem. Use a edição manual.
                              </p>
                            </div>
                          )}
                          
                          <div className="flex gap-3">
                            {modoCriacao === "IA" ? (
                              <motion.button
                                onClick={gerarComIA}
                                disabled={loading || limiteGeracaoAtingido}
                                whileHover={!limiteGeracaoAtingido ? { scale: 1.02 } : {}}
                                whileTap={!limiteGeracaoAtingido ? { scale: 0.98 } : {}}
                                className={`flex-1 flex items-center justify-center gap-3 rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                                  limiteGeracaoAtingido 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                                } disabled:opacity-50`}
                              >
                                {loading ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : limiteGeracaoAtingido ? (
                                  <AlertTriangle className="h-5 w-5" />
                                ) : (
                                  <Sparkles className="h-5 w-5" />
                                )}
                                {loading ? "Gerando..." : limiteGeracaoAtingido ? "Limite Atingido" : "Gerar com IA"}
                              </motion.button>
                            ) : (
                                <motion.button
                                  onClick={roteiroInexistente ? criarRoteiroManual : salvarRoteiroManual}
                                  disabled={loadingSalvar}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}                                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50"
                                >
                                  {loadingSalvar ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                  ) : (
                                    <Save className="h-5 w-5" />
                                  )}
                                  {loadingSalvar ? "Salvando..." : roteiroInexistente ? "Criar Roteiro" : "Salvar Roteiro"}
                                </motion.button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {viagem && (
                      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Informações da Viagem
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-gray-600">Destino:</span>
                            <p className="font-medium text-gray-900">{viagem.destino}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Data de Início:</span>
                            <p className="font-medium text-gray-900">
                              {formatarDataViagem(viagem.dataInicio)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Data de Fim:</span>
                            <p className="font-medium text-gray-900">
                              {formatarDataViagem(viagem.dataFim)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!roteiroInexistente && (
                      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Settings className="w-5 h-5 text-primary" />
                          Ações do Roteiro
                        </h3>                        <div className="space-y-3">
                          <motion.button
                            onClick={baixarPdf}
                            disabled={loadingPdf}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3 sm:px-4 py-3 font-medium transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                          >
                            {loadingPdf ? (
                              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                            {loadingPdf ? "Baixando..." : "Baixar PDF"}
                          </motion.button>                          <motion.button
                            onClick={() => setMostrarModalEmail(true)}
                            disabled={loadingEmail}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-primary hover:bg-orange-600 text-white rounded-xl px-3 sm:px-4 py-3 font-medium transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                          >
                            {loadingEmail ? (
                              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                            {loadingEmail ? "Enviando..." : "Enviar por Email"}
                          </motion.button>
                        </div>
                      </div>
                    )}                   
                    <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 backdrop-blur-xl rounded-3xl border border-orange-100/50 p-6 shadow-lg">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Dicas
                      </h3>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p>Use a IA para gerar um roteiro base e depois edite manualmente</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p>Inclua horários e locais específicos nas descrições</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-300 rounded-full mt-2 flex-shrink-0"></div>
                          <p>Compartilhe o PDF com todos os participantes</p>
                        </div>
                        
                        {roteiroInexistente && (
                          <div className="mt-4 pt-3 border-t border-orange-200/50">
                            <p className="text-xs text-gray-500 mb-2">
                              Roteiro não aparece atualizado?
                            </p>
                            <motion.button
                              onClick={forcarLimpezaCompleta}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200"
                            >
                              <Settings className="h-3 w-3" />
                              Forçar Atualização
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {modoCriacao === "MANUAL" && souCriador && (
                  <motion.div 
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >                    <div className="bg-gradient-to-r from-orange-500 to-primary px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Pencil className="w-5 h-5 text-white" />
                          <h2 className="text-base sm:text-lg font-semibold text-white">Editor de Roteiro</h2>
                        </div>
                        <motion.button
                          onClick={adicionarDia}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all duration-200 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">Adicionar Dia</span>
                          <span className="sm:hidden">Adicionar</span>
                        </motion.button>                      </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-6">
                      <div className="space-y-4">
                        <AnimatePresence>
                          {diasRoteiro.map((dia, index) => (                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200/50"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                    index % 3 === 0 ? "bg-primary" : 
                                    index % 3 === 1 ? "bg-orange-400" : "bg-orange-300"
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <h4 className="font-medium text-gray-900">
                                    Dia {index + 1}
                                  </h4>
                                </div>
                                {diasRoteiro.length > 1 && (
                                  <motion.button
                                    onClick={() => removerDia(index)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                )}
                              </div>
                              
                              <div className="space-y-4">
                                <input
                                  type="text"
                                  value={dia.titulo}
                                  onChange={(e) => atualizarDia(index, "titulo", e.target.value)}
                                  placeholder="Título do dia (ex: Dia 1 - Centro Histórico)"
                                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                                />
                                <textarea
                                  value={dia.descricao}
                                  onChange={(e) => atualizarDia(index, "descricao", e.target.value)}
                                  placeholder="Descrição detalhada do dia..."
                                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none h-32 sm:h-40 text-sm sm:text-base"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <FileText className="w-4 h-4" />
                          Observações Finais
                        </label>                        <textarea
                          value={observacoesFinais}
                          onChange={(e) => setObservacoesFinais(e.target.value)}
                          placeholder="Observações gerais sobre a viagem..."
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none h-24"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>      
      <AnimatePresence>
        {mostrarModalEmail && roteiroId !== null && (
          <EnviarRoteiroModal
            aberto={mostrarModalEmail}
            onClose={() => setMostrarModalEmail(false)}
            roteiroId={roteiroId}
            viagemId={Number(viagemId)}
            souCriador={souCriador}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CadastroRoteiro;
