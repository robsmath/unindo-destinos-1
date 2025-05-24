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
import { Loader2, CheckCircle2, Pencil, Mail, Trash2, AlertTriangle } from "lucide-react";
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
              ? new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(roteiro.valorEstimado)
              : "R$ 0,00"
          );
          const resultado = parseDescricaoComObservacoes(roteiro.descricao || "");
          setDiasRoteiro(resultado.dias);
          setObservacoesFinais(resultado.observacoesFinais);
          setRoteiroInexistente(false);
        } else {
          setRoteiroInexistente(true);
        }
      } catch {
        setRoteiroInexistente(true);
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
            dias.push({
              titulo: tituloAtual,
              descricao: conteudoAtual.join("\n").trim(),
            });
          }
          tituloAtual = match[1].trim();
          conteudoAtual = [];
        } else if (isObs) {
          if (tituloAtual && conteudoAtual.length > 0) {
            dias.push({
              titulo: tituloAtual,
              descricao: conteudoAtual.join("\n").trim(),
            });
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
      dias.push({
        titulo: tituloAtual,
        descricao: conteudoAtual.join("\n").trim(),
      });
    }

    return {
      dias,
      observacoesFinais: observacoesFinais.trim(),
    };
  };

  const montarDescricaoFromDias = () => {
    const blocosDias = diasRoteiro
      .map((dia) => `#### ${dia.titulo}\n${dia.descricao}`)
      .join("\n\n");

    const blocoObs = observacoesFinais
      ? `\n\n### Observações Finais:\n${observacoesFinais}`
      : "";

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
                Já existe um roteiro para esta viagem. Deseja substituir o roteiro atual?{" "}
                Você ainda pode gerar automaticamente mais {Math.max(0, 3 - tentativas)} vez(es).
              </span>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={async () => {
                    toast.dismiss(id);
                    try {
                      setLoading(true);
                      await deletarRoteiroByViagemId(Number(viagemId));
                      await gerarRoteiroComIa(Number(viagemId), {
                        observacao,
                        tipoViagem,
                      });
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
            ? new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(roteiroGerado.valorEstimado)
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
  };
return (
  <>
    {loading && <LoadingOverlay />}

    <section
      className={`min-h-screen bg-cover bg-center flex justify-center ${
        modoCriacao === "MANUAL" ? "pt-36 items-start" : "items-center"
      }`}
      style={{ backgroundImage: "url('/images/common/beach.jpg')" }}
    >
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 m-4">
        {loadingTela ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative mb-8">
              <button
                onClick={() => router.back()}
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

              <h2 className="text-3xl font-bold text-center flex justify-center items-center gap-2">
                Roteiro <span className="text-2xl">🗺️</span>
              </h2>
            </div>

            {!souCriador && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-6 border border-yellow-300 text-center">
                Você é participante desta viagem. O roteiro está disponível apenas para visualização, exportação e envio por e-mail.
              </div>
            )}

            <div className="mb-6">
              <label className="block font-semibold mb-2">Modo de Criação:</label>
              <select
                value={modoCriacao}
                onChange={(e) => setModoCriacao(e.target.value as "MANUAL" | "IA")}
                className="input w-full"
                disabled={!souCriador}
              >
                <option value="MANUAL">Manual</option>
                <option value="IA">Gerar com IA</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Observação:</label>
              <textarea
                className="input w-full"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                disabled={!souCriador}
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Tipo de Viagem:</label>
              <select
                className="input w-full"
                value={tipoViagem}
                onChange={(e) => setTipoViagem(e.target.value as TipoViagem)}
                disabled={!souCriador}
              >
                <option value="ECONOMICA">Econômica</option>
                <option value="CONFORTAVEL">Confortável</option>
                <option value="LUXO">Luxo</option>
              </select>
            </div>

            {modoCriacao === "MANUAL" && (
              <>
                <div className="mb-6">
                  <label className="block font-semibold mb-2">Valor Estimado:</label>
                  <input
                    type="text"
                    className="input w-full"
                    value={valorEstimado}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const formatted = new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(parseFloat(raw) / 100 || 0);
                      setValorEstimado(formatted);
                    }}
                    disabled={!souCriador}
                  />
                </div>

                <h3 className="text-2xl font-semibold mb-2">Dias do Roteiro:</h3>

                <p className="text-sm text-gray-600 italic mb-4">
                  Todas as atividades abaixo são apenas sugestões e podem ser alteradas conforme sua preferência.
                </p>

                <AnimatePresence>
                  {diasRoteiro.map((dia, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm mb-4 relative"
                    >
                      <h4 className="text-lg font-bold text-gray-700 mb-2">📅 Dia {index + 1}</h4>
                      <input
                        className="w-full border border-gray-300 rounded-md p-2 mb-3"
                        placeholder="Título do dia"
                        value={dia.titulo}
                        onChange={(e) => atualizarDia(index, "titulo", e.target.value)}
                        disabled={!souCriador}
                      />
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2 resize-none"
                        placeholder="Descrição das atividades"
                        rows={4}
                        value={dia.descricao}
                        onChange={(e) => atualizarDia(index, "descricao", e.target.value)}
                        disabled={!souCriador}
                      />
                      {souCriador && (
                        <button
                          type="button"
                          onClick={() => removerDia(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                          title="Remover dia"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {souCriador && (
                  <button
                    onClick={adicionarDia}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 mt-4 flex items-center gap-2"
                  >
                    📅 Adicionar dia
                  </button>
                )}

                <div className="mt-10">
                  <h3 className="text-2xl font-semibold mb-2">Observações Finais:</h3>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-4 whitespace-pre-line"
                    rows={6}
                    placeholder="Insira observações complementares do roteiro..."
                    value={observacoesFinais}
                    onChange={(e) => setObservacoesFinais(e.target.value)}
                    disabled={!souCriador}
                  />
                </div>
              </>
            )}

            {/* Botões */}
            <div className="flex flex-col md:flex-row flex-wrap gap-4 mt-8 justify-center">
              {souCriador && modoCriacao === "MANUAL" && (
                <button
                  onClick={salvarRoteiroManual}
                  disabled={loadingSalvar}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
                >
                  {loadingSalvar ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  Salvar Roteiro
                </button>
              )}

              <button
                onClick={handleExportarPdf}
                disabled={loadingPdf}
                className="bg-gray-700 hover:bg-gray-800 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
              >
                {loadingPdf ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Pencil className="h-5 w-5" />
                )}
                Exportar como PDF
              </button>

              <button
                onClick={() => setMostrarModalEmail(true)}
                disabled={loadingEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
              >
                {loadingEmail ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
                Enviar por E-mail
              </button>

              {souCriador && modoCriacao === "IA" && (
                <button
                  onClick={gerarRoteiro}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? "Gerando..." : "Gerar Roteiro com IA"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>

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
