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
} from "@/services/roteiroService";
import { getViagemById } from "@/services/viagemService";
import LoadingOverlay from "@/components/Common/LoadingOverlay";
import EnviarRoteiroModal from "@/components/Modals/EnviarRoteiroModal";
import { usePerfil } from "@/app/context/PerfilContext";
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

  const [viagem, setViagem] = useState<ViagemDTO | null>(null);
  const [roteiroId, setRoteiroId] = useState<number | null>(null);

  const [modoCriacao, setModoCriacao] = useState<"MANUAL" | "IA">("MANUAL");
  const [observacao, setObservacao] = useState("");
  const [tipoViagem, setTipoViagem] = useState<TipoViagem>("CONFORTAVEL");
  const [valorEstimado, setValorEstimado] = useState<string>("R$ 0,00");
  const [diasRoteiro, setDiasRoteiro] = useState<{ titulo: string; descricao: string }[]>([]);
  const [observacoesFinais, setObservacoesFinais] = useState<string>("");

  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTela, setLoadingTela] = useState(true);
  const [roteiroInexistente, setRoteiroInexistente] = useState(false);
  const [mostrarModalEmail, setMostrarModalEmail] = useState(false);

  const souCriador = viagem?.criadorViagemId === usuario?.id;

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosViagem = await getViagemById(Number(viagemId));
        setViagem(dadosViagem);
      } catch {
        toast.error("Erro ao carregar dados da viagem.");
        router.push("/viagens");
        return;
      }

      try {
        const roteiro = await getRoteiroByViagemId(Number(viagemId));
        if (roteiro) {
          setRoteiroId(roteiro.id);
          setObservacao(roteiro.observacao || "");
          setTipoViagem(roteiro.tipoViagem || "CONFORTAVEL");
          setValorEstimado(
            roteiro.valorEstimado
              ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(roteiro.valorEstimado)
              : "R$ 0,00"
          );
          const resultado = parseDescricaoComObservacoes(roteiro.descricao || "");
          setDiasRoteiro(resultado.dias);
          setObservacoesFinais(resultado.observacoesFinais);
          setRoteiroInexistente(false);
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setRoteiroInexistente(true);
        } else {
          toast.error("Erro ao carregar roteiro.");
        }
      } finally {
        setLoadingTela(false);
      }

    };

    carregarDados();
  }, [viagemId, router]);

  const parseDescricaoComObservacoes = (descricao: string) => {
    const linhas = descricao.split("\n");
    const dias: { titulo: string; descricao: string }[] = [];
    let tituloAtual = "";
    let conteudoAtual: string[] = [];
    let observacoesFinais = "";
    let modo: "DIAS" | "OBS" = "DIAS";

    for (const linha of linhas) {
      if (modo === "DIAS") {
        const match = linha.match(/^####\s(Dia\s\d+:\s.*)/i);
        const isObs = /^###\s*Observações/i.test(linha);

        if (match) {
          if (tituloAtual && conteudoAtual.length > 0) {
            dias.push({ titulo: tituloAtual, descricao: conteudoAtual.join("\n").trim() });
          }
          tituloAtual = match[1].trim();
          conteudoAtual = [];
        } else if (isObs) {
          if (tituloAtual && conteudoAtual.length > 0) {
            dias.push({ titulo: tituloAtual, descricao: conteudoAtual.join("\n").trim() });
          }
          modo = "OBS";
        } else {
          conteudoAtual.push(linha);
        }
      } else if (modo === "OBS") {
        observacoesFinais += linha + "\n";
      }
    }

    if (modo === "DIAS" && tituloAtual && conteudoAtual.length > 0) {
      dias.push({ titulo: tituloAtual, descricao: conteudoAtual.join("\n").trim() });
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

  const gerarRoteiro = async () => {
    try {
      if (!viagemId) return;
      if (!souCriador) {
        toast.warning("Apenas o criador da viagem pode gerar um roteiro.");
        return;
      }

      const roteiroExistente = await getRoteiroByViagemId(Number(viagemId));

      if (roteiroExistente) {
        const tentativas = roteiroExistente.tentativasGeracaoRoteiro ?? 0;

        if (tentativas >= 3) {
          toast(
            "Você atingiu o limite de 3 tentativas de geração automática. Para editar, use o modo manual.",
            { icon: "🚫", duration: 8000 }
          );
          return;
        }

        const toastId = crypto.randomUUID();

        toast.custom(
          (id) => (
            <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-md shadow-md max-w-sm text-sm">
              <span>
                Já existe um roteiro para esta viagem. Deseja substituir o roteiro atual? Você ainda pode gerar
                automaticamente mais {Math.max(0, 3 - tentativas)} vez(es).
              </span>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={async () => {
                    toast.dismiss(id);
                    try {
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
                            : "R$ 0,00"
                        );
                        setTipoViagem(roteiro.tipoViagem || "CONFORTAVEL");
                        const resultado = parseDescricaoComObservacoes(roteiro.descricao || "");
                        setDiasRoteiro(resultado.dias);
                        setObservacoesFinais(resultado.observacoesFinais);
                        setModoCriacao("MANUAL");
                        setRoteiroInexistente(false);
                        toast.success("Roteiro gerado e preenchido com sucesso!");
                      }
                    } catch {
                      toast.error("Erro ao substituir o roteiro.");
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

      setLoading(true);
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
        );
        setTipoViagem(roteiroGerado.tipoViagem || "CONFORTAVEL");
        const resultado = parseDescricaoComObservacoes(roteiroGerado.descricao || "");
        setDiasRoteiro(resultado.dias);
        setObservacoesFinais(resultado.observacoesFinais);
        setModoCriacao("MANUAL");
        setRoteiroInexistente(false);

        toast.success("Roteiro gerado e preenchido com sucesso!");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message?.toLowerCase();

      if (msg?.includes("limite máximo de 3 gerações")) {
        toast(
          "Você atingiu o limite de 3 tentativas de geração automática. Para editar, use o modo manual.",
          { icon: "🚫", duration: 8000 }
        );
      } else {
        toast.error("Erro ao gerar roteiro com IA.", {
          icon: <AlertTriangle className="text-red-600" />,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportarPdf = async () => {
    if (!roteiroId) {
      toast.error("ID do roteiro não encontrado.");
      return;
    }

    setLoadingPdf(true);

    try {
      const blob = await baixarRoteiroPdf(roteiroId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "roteiro_viagem.pdf";
      link.click();
    } catch {
      toast.error("Erro ao exportar PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };  return (
    <>
      {loading && <LoadingOverlay />}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header moderno */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  title="Voltar"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Roteiro de Viagem</h1>
                    <p className="text-sm text-gray-500">Planeje sua aventura perfeita</p>
                  </div>
                </div>
              </div>
              
              {/* Status badge */}
              {!roteiroInexistente && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Roteiro Criado
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {loadingTela ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-2xl shadow-sm">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 font-medium">Carregando roteiro...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Alert cards */}
              {roteiroInexistente ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">Pronto para começar?</h3>
                      <p className="text-amber-700">
                        Nenhum roteiro foi cadastrado para esta viagem ainda. Crie o seu roteiro personalizado agora!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                !souCriador && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Modo Visualização</h3>
                        <p className="text-blue-700">
                          Você é participante desta viagem. O roteiro está disponível para visualização, exportação e envio por e-mail.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configurações principais */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Card de configurações */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-white" />
                        <h2 className="text-lg font-semibold text-white">Configurações do Roteiro</h2>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Modo de criação */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Wand2 className="w-4 h-4" />
                          Modo de Criação
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setModoCriacao("MANUAL")}
                            disabled={!souCriador || roteiroInexistente}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              modoCriacao === "MANUAL"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Pencil className="w-5 h-5" />
                              <span className="font-medium">Manual</span>
                            </div>
                          </button>
                          <button
                            onClick={() => setModoCriacao("IA")}
                            disabled={!souCriador || roteiroInexistente}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              modoCriacao === "IA"
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              <span className="font-medium">IA</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Observação */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <FileText className="w-4 h-4" />
                          Observações
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                          placeholder="Descreva suas preferências para o roteiro..."
                          value={observacao}
                          onChange={(e) => setObservacao(e.target.value)}
                          disabled={!souCriador || roteiroInexistente}
                          rows={3}
                        />
                      </div>

                      {/* Tipo de viagem */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Target className="w-4 h-4" />
                          Estilo de Viagem
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { valor: "ECONOMICA", label: "Econômica", cor: "green" },
                            { valor: "CONFORTAVEL", label: "Confortável", cor: "blue" },
                            { valor: "LUXO", label: "Luxo", cor: "purple" }
                          ].map(({ valor, label, cor }) => (
                            <button
                              key={valor}
                              onClick={() => setTipoViagem(valor as TipoViagem)}
                              disabled={!souCriador || roteiroInexistente}
                              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                tipoViagem === valor
                                  ? `border-${cor}-500 bg-${cor}-50 text-${cor}-700`
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <span className="font-medium text-sm">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {modoCriacao === "MANUAL" && (
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <DollarSign className="w-4 h-4" />
                            Valor Estimado
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="R$ 0,00"
                            value={valorEstimado}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              const formatted = new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(parseFloat(raw) / 100 || 0);
                              setValorEstimado(formatted);
                            }}
                            disabled={!souCriador || roteiroInexistente}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dias do roteiro - apenas no modo manual */}
                  {modoCriacao === "MANUAL" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-semibold text-white">Planejamento Diário</h2>
                          </div>
                          {souCriador && !roteiroInexistente && (
                            <button
                              onClick={adicionarDia}
                              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors duration-200"
                            >
                              <Plus className="w-4 h-4" />
                              Adicionar Dia
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Todas as atividades são sugestões e podem ser personalizadas
                        </p>

                        <div className="space-y-4">
                          <AnimatePresence>
                            {diasRoteiro.map((dia, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-xl p-6"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                      {index + 1}
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800">Dia {index + 1}</h4>
                                  </div>
                                  {souCriador && !roteiroInexistente && (
                                    <button
                                      onClick={() => removerDia(index)}
                                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                      title="Remover dia"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                
                                <div className="space-y-4">
                                  <input
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                    placeholder="Título do dia (ex: Chegada e Check-in)"
                                    value={dia.titulo}
                                    onChange={(e) => atualizarDia(index, "titulo", e.target.value)}
                                    disabled={!souCriador || roteiroInexistente}
                                  />
                                  <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white"
                                    placeholder="Descreva as atividades do dia..."
                                    rows={4}
                                    value={dia.descricao}
                                    onChange={(e) => atualizarDia(index, "descricao", e.target.value)}
                                    disabled={!souCriador || roteiroInexistente}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {/* Observações finais */}
                        <div className="mt-8 space-y-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FileText className="w-4 h-4" />
                            Observações Finais
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                            rows={4}
                            placeholder="Informações adicionais importantes para o roteiro..."
                            value={observacoesFinais}
                            onChange={(e) => setObservacoesFinais(e.target.value)}
                            disabled={!souCriador || roteiroInexistente}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar de ações */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Ações Disponíveis
                    </h3>
                    
                    <div className="space-y-3">
                      {souCriador && modoCriacao === "MANUAL" && !roteiroInexistente && (
                        <button
                          onClick={salvarRoteiroManual}
                          disabled={loadingSalvar}
                          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 shadow-sm"
                        >
                          {loadingSalvar ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Save className="h-5 w-5" />
                          )}
                          {loadingSalvar ? "Salvando..." : "Salvar Roteiro"}
                        </button>
                      )}

                      {souCriador && modoCriacao === "IA" && (
                        <button
                          onClick={gerarRoteiro}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 shadow-sm"
                        >
                          {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Wand2 className="h-5 w-5" />
                          )}
                          {loading ? "Gerando..." : "Gerar com IA"}
                        </button>
                      )}

                      {(!roteiroInexistente || (roteiroInexistente && !souCriador)) && (
                        <>
                          <button
                            onClick={handleExportarPdf}
                            disabled={loadingPdf}
                            className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200"
                          >
                            {loadingPdf ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Download className="h-5 w-5" />
                            )}
                            {loadingPdf ? "Exportando..." : "Baixar PDF"}
                          </button>

                          <button
                            onClick={() => setMostrarModalEmail(true)}
                            disabled={loadingEmail}
                            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 font-medium transition-all duration-200"
                          >
                            {loadingEmail ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Send className="h-5 w-5" />
                            )}
                            {loadingEmail ? "Enviando..." : "Enviar por Email"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card de informações */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      Dicas
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Use a IA para gerar um roteiro base e depois edite manualmente</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Inclua horários e locais específicos nas descrições</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Compartilhe o PDF com todos os participantes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {mostrarModalEmail && roteiroId && (
        <EnviarRoteiroModal
          aberto={mostrarModalEmail}
          onClose={() => setMostrarModalEmail(false)}
          roteiroId={roteiroId}
          viagemId={Number(viagemId)}
        />
      )}
    </>
  );
};

export default CadastroRoteiro;
