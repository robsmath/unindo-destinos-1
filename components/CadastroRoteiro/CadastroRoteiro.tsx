"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import {
  deletarRoteiroByViagemId,
  atualizarRoteiro,
  gerarRoteiroComIa,
  getRoteiroByViagemId,
} from "@/services/roteiroService";
import { Loader2, AlertTriangle, CheckCircle2, Pencil } from "lucide-react";

type TipoViagem = "ECONOMICA" | "CONFORTAVEL" | "LUXO";

const CadastroRoteiro = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viagemId = searchParams.get("viagemId");

  const [modoCriacao, setModoCriacao] = useState<"MANUAL" | "IA">("MANUAL");
  const [observacao, setObservacao] = useState("");
  const [tipoViagem, setTipoViagem] = useState<TipoViagem>("CONFORTAVEL");
  const [valorEstimado, setValorEstimado] = useState<number | undefined>();
  const [diasRoteiro, setDiasRoteiro] = useState<{ titulo: string; descricao: string }[]>([]);
  const [observacoesFinais, setObservacoesFinais] = useState<string>("");
  const [imagemDestino, setImagemDestino] = useState<string>("/images/common/beach.jpg");
  const [loading, setLoading] = useState(false);
  const [loadingTela, setLoadingTela] = useState(true);
  const [roteiroId, setRoteiroId] = useState<number | null>(null);
  const [roteiroInexistente, setRoteiroInexistente] = useState(false);

  useEffect(() => {
    const carregarRoteiro = async () => {
      if (!viagemId) {
        toast.error("Viagem ID não encontrado.");
        router.push("/viagens");
        return;
      }

      try {
        const roteiro = await getRoteiroByViagemId(Number(viagemId));
        if (roteiro) {
          setRoteiroInexistente(false);
          setRoteiroId(roteiro.id);
          setObservacao(roteiro.observacao || "");
          setTipoViagem(roteiro.tipoViagem || "CONFORTAVEL");
          setValorEstimado(roteiro.valorEstimado || undefined);
          const resultado = parseDescricaoComObservacoes(roteiro.descricao || "");
          setDiasRoteiro(resultado.dias);
          setObservacoesFinais(resultado.observacoesFinais);
        } else {
          setRoteiroInexistente(true);
        }
      } catch {
        setRoteiroInexistente(true);
      } finally {
        setLoadingTela(false);
      }
    };

    carregarRoteiro();
  }, [viagemId, router]);

  const parseDescricaoComObservacoes = (descricao: string): {
    dias: { titulo: string; descricao: string }[];
    observacoesFinais: string;
  } => {
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
      toast.error("ID do roteiro não encontrado. Recarregue a página.");
      return;
    }

    try {
      setLoading(true);
      await atualizarRoteiro(roteiroId, {
        observacao,
        valorEstimado,
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
      setLoading(false);
    }
  };

  const gerarRoteiro = async () => {
    try {
      if (!viagemId) return;
      setLoading(true);

      await gerarRoteiroComIa(Number(viagemId), { observacao, tipoViagem });

      const roteiroGerado = await getRoteiroByViagemId(Number(viagemId));
      if (roteiroGerado) {
        setRoteiroId(roteiroGerado.id);
        setObservacao(roteiroGerado.observacao || "");
        setValorEstimado(roteiroGerado.valorEstimado || undefined);
        setTipoViagem(roteiroGerado.tipoViagem || "CONFORTAVEL");

        const resultado = parseDescricaoComObservacoes(roteiroGerado.descricao || "");
        setDiasRoteiro(resultado.dias);
        setObservacoesFinais(resultado.observacoesFinais);
        setModoCriacao("MANUAL");
        setRoteiroInexistente(false);

        toast.success("Roteiro gerado e preenchido com sucesso!", {
          icon: <CheckCircle2 className="text-green-600" />,
        });
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message?.toLowerCase();

      if (msg?.includes("já existe um roteiro")) {
        try {
          const roteiro = await getRoteiroByViagemId(Number(viagemId));
          const tentativas = roteiro?.tentativasGeracaoRoteiro ?? 0;
          const restantes = Math.max(0, 3 - tentativas);
          const toastId = crypto.randomUUID();

          toast.custom((id) => (
            <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-md shadow-md max-w-sm text-sm">
              <span>
                Já existe um roteiro para esta viagem. Você ainda pode gerar automaticamente mais {restantes} vez(es).
                Deseja substituir o roteiro atual?
              </span>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={async () => {
                    toast.dismiss(id);
                    try {
                      setLoading(true);
                      await deletarRoteiroByViagemId(Number(viagemId));
                      await gerarRoteiro();
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
          ), { id: toastId, duration: 10000 });
        } catch {
          toast.warning("Já existe um roteiro gerado para esta viagem.", {
            icon: "💡",
          });
        }
      } else if (msg?.includes("limite máximo de 3 gerações")) {
        toast("Você atingiu o limite de 3 tentativas de geração automática para esta viagem. Para editar, use o modo manual.", {
          icon: "🚫",
          duration: 8000,
        });
      } else {
        toast.error("Erro ao gerar roteiro com IA.", {
          icon: "⚠️",
        });
      }
    } finally {
      setLoading(false);
    }
  };

const handleExportarPdf = () => {
  const elemento = document.getElementById("pdf-preview");
  if (!elemento) {
    toast.error("Erro ao exportar PDF: elemento não encontrado.");
    return;
  }

  const originalDisplay = elemento.style.display;
  elemento.style.display = "block";

  const options = {
    margin: 0.5,
    filename: "roteiro_viagem.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(options)
    .from(elemento)
    .save()
    .then(() => {
      elemento.style.display = originalDisplay || "none";
    })
    .catch(() => {
      toast.error("Falha ao gerar o PDF.");
      elemento.style.display = originalDisplay || "none";
    });
};


  const handleEnviarPorEmail = async () => {
    if (!roteiroId) return;
    const email = prompt("Digite o e-mail de destino:");
    if (!email || !email.includes("@")) {
      toast.error("E-mail inválido");
      return;
    }

    try {
      await fetch(`/roteiros/${roteiroId}/enviar-email?email=${email}`, {
        method: "POST",
      });
      toast.success("E-mail enviado com sucesso!");
    } catch {
      toast.error("Erro ao enviar e-mail");
    }
  };

  return (
    <section
      className={`min-h-screen bg-cover bg-center flex justify-center ${
        modoCriacao === "MANUAL" ? "pt-36 items-start" : "items-center"
      }`}
      style={{ backgroundImage: "url('/images/common/beach.jpg')" }}
    >
      {loadingTela ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 m-4">
          <h2 className="text-3xl font-bold mb-8 text-center flex justify-center items-center gap-2">
            Roteiro <Pencil className="h-6 w-6 text-gray-500" />
          </h2>

          {roteiroInexistente && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-6 border border-yellow-300 text-center">
              Nenhum roteiro foi cadastrado ainda para esta viagem. Você pode criá-lo abaixo!
            </div>
          )}

          <div className="mb-6">
            <label className="block font-semibold mb-2">Modo de Criação:</label>
            <select value={modoCriacao}
              onChange={(e) => setModoCriacao(e.target.value as "MANUAL" | "IA")}
              className="input w-full">
              <option value="MANUAL">Manual</option>
              <option value="IA">Gerar com IA</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Observação:</label>
            <textarea className="input w-full" value={observacao}
              onChange={(e) => setObservacao(e.target.value)} />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Tipo de Viagem:</label>
            <select className="input w-full"
              value={tipoViagem}
              onChange={(e) => setTipoViagem(e.target.value as TipoViagem)}>
              <option value="ECONOMICA">Econômica</option>
              <option value="CONFORTAVEL">Confortável</option>
              <option value="LUXO">Luxo</option>
            </select>
          </div>

          {modoCriacao === "MANUAL" && (
            <>
              <div className="mb-6">
                <label className="block font-semibold mb-2">Valor Estimado:</label>
                <input type="number"
                  className="input w-full"
                  value={valorEstimado ?? ""}
                  onChange={(e) => setValorEstimado(parseFloat(e.target.value))} />
              </div>

              <h3 className="text-2xl font-semibold mb-2">Dias do Roteiro:</h3>
              <p className="text-sm text-gray-600 italic mb-4">
                Todas as atividades abaixo são apenas sugestões e podem ser alteradas conforme sua preferência.
              </p>

              <AnimatePresence>
                {diasRoteiro.map((dia, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm mb-4 relative">
                    <h4 className="text-lg font-bold text-gray-700 mb-2">Dia {index + 1}</h4>
                    <input className="w-full border border-gray-300 rounded-md p-2 mb-3"
                      placeholder="Título do dia"
                      value={dia.titulo}
                      onChange={(e) => atualizarDia(index, "titulo", e.target.value)} />
                    <textarea className="w-full border border-gray-300 rounded-md p-2 resize-none"
                      placeholder="Descrição das atividades"
                      rows={4}
                      value={dia.descricao}
                      onChange={(e) => atualizarDia(index, "descricao", e.target.value)} />
                    <button type="button"
                      onClick={() => removerDia(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-semibold">
                      Remover
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button onClick={adicionarDia}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 mt-4">
                Adicionar Dia
              </button>

              <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-2">Observações Finais:</h3>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-4 whitespace-pre-line"
                  rows={6}
                  placeholder="Insira observações complementares do roteiro..."
                  value={observacoesFinais}
                  onChange={(e) => setObservacoesFinais(e.target.value)}
                />
              </div>
            </>
          )}
            {modoCriacao === "MANUAL" ? (
              <div className="flex flex-col md:flex-row flex-wrap gap-4 mt-8">
                <button
                  onClick={salvarRoteiroManual}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  Salvar Roteiro
                </button>

                <button
                  onClick={handleExportarPdf}
                  className="bg-gray-700 hover:bg-gray-800 text-white rounded-full px-6 py-3"
                >
                  Exportar como PDF
                </button>

                <button
                  onClick={handleEnviarPorEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3"
                >
                  Enviar por E-mail
                </button>
              </div>
            ) : (
              <div className="mt-8">
                <button
                  onClick={gerarRoteiro}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? "Gerando..." : "Gerar Roteiro com IA"}
                </button>
              </div>
            )}
        </div>
      )}

      {/* PDF invisível para exportação */}
      <div id="pdf-preview" className="hidden p-8 max-w-3xl mx-auto text-black bg-white">
        <img src="/images/logo/unindo-destinos-logo.png" alt="Unindo Destinos" className="w-32 mb-4" />
        <img src={imagemDestino} alt="Destino" className="w-full h-64 object-cover mb-6 rounded-md" />
        <h1 className="text-2xl font-bold mb-6">Roteiro de Viagem</h1>

        {diasRoteiro.map((dia, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-xl font-semibold mb-1">{dia.titulo}</h2>
            <pre className="whitespace-pre-wrap text-sm">{dia.descricao}</pre>
          </div>
        ))}

        {observacoesFinais && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Observações Finais</h2>
            <pre className="whitespace-pre-wrap text-sm">{observacoesFinais}</pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default CadastroRoteiro;
