"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  deletarRoteiroByViagemId,
  atualizarRoteiro,
  gerarRoteiroComIa,
  getRoteiroByViagemId,
} from "@/services/roteiroService";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [roteiroId, setRoteiroId] = useState<number | null>(null);

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
          setRoteiroId(roteiro.id);
          setObservacao(roteiro.observacao || "");
          setTipoViagem(roteiro.tipoViagem || "CONFORTAVEL");
          setValorEstimado(roteiro.valorEstimado || undefined);
          setDiasRoteiro(parseDiasFromDescricao(roteiro.descricao || ""));
        }
      } catch {
        // sem toast: caso normal se for a primeira vez
      }
    };

    carregarRoteiro();
  }, [viagemId, router]);

  const parseDiasFromDescricao = (descricao: string): { titulo: string; descricao: string }[] => {
    const regex = /###\s\*\*(Dia\s\d+:.*?\(\d{1,2}\sde\s\w+,\s\d{4}\))\*\*\n([\s\S]*?)(?=\n###\s\*\*Dia\s\d+:|\n?###|\Z)/g;
    const dias: { titulo: string; descricao: string }[] = [];
    let match;
  
    while ((match = regex.exec(descricao)) !== null) {
      const titulo = match[1].trim();         // Ex: Dia 1: Chegada em Sydney (30 de Abril, 2025)
      const descricaoDia = match[2].trim();   // Ex: - **Chegada no Aeroporto...**
      dias.push({ titulo, descricao: descricaoDia });
    }
  
    return dias;
  };
  

  const montarDescricaoFromDias = () => {
    return diasRoteiro.map((dia) => `### ${dia.titulo}\n${dia.descricao}`).join("\n\n");
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
        setDiasRoteiro(parseDiasFromDescricao(roteiroGerado.descricao || ""));
        setModoCriacao("MANUAL");

        toast.success("Roteiro gerado e preenchido com sucesso!", {
          icon: <CheckCircle2 className="text-green-600" />,
        });
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      const msg = message?.toLowerCase();

      if (msg?.includes("já existe um roteiro")) {
        try {
          const roteiro = await getRoteiroByViagemId(Number(viagemId));
          const tentativas = roteiro?.tentativasGeracaoRoteiro ?? 0;
          const restantes = Math.max(0, 3 - tentativas);

          toast(
            `Já existe um roteiro para esta viagem. Você ainda pode gerar automaticamente mais ${restantes} vez(es). Deseja substituir o roteiro atual?`,
            {
              icon: "💡",
              duration: 8000,
              action: {
                label: "Substituir",
                onClick: async () => {
                  try {
                    setLoading(true);
                    await deletarRoteiroByViagemId(Number(viagemId));
                    await gerarRoteiro();
                  } catch {
                    toast.error("Erro ao substituir o roteiro.", {
                      icon: <AlertTriangle className="text-red-600" />,
                    });
                  } finally {
                    setLoading(false);
                  }
                },
              },
            }
          );
        } catch {
          toast.warning("Já existe um roteiro gerado para esta viagem.", {
            icon: "💡",
          });
        }
      } else if (msg?.includes("limite máximo de 3 gerações")) {
        toast.error("Limite de 3 tentativas de geração atingido.", {
          icon: "🚫",
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

  return (
    <section className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/common/beach.jpg')" }}>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 m-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Cadastrar Roteiro</h2>

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
          </>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          {modoCriacao === "MANUAL" ? (
            <button onClick={salvarRoteiroManual}
              disabled={loading}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              Salvar Roteiro
            </button>
          ) : (
            <button onClick={gerarRoteiro}
              disabled={loading}
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? "Gerando..." : "Gerar Roteiro com IA"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CadastroRoteiro;
