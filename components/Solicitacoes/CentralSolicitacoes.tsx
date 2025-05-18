"use client";

import { useEffect, useState } from "react";
import {
  getMinhasSolicitacoes,
  aprovarSolicitacao,
  recusarSolicitacao,
  cancelarSolicitacao,
} from "@/services/solicitacaoService";
import { SolicitacaoParticipacaoDTO } from "@/models/SolicitacaoParticipacaoDTO";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ViagemDetalhesModal from "@/components/Viagens/ViagemDetalhesModal";
import PerfilUsuarioModal from "@/components/EncontrePessoas/PerfilUsuarioModal";

const CentralSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoParticipacaoDTO[]>([]);
  const [respostaId, setRespostaId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [perfilAbertoId, setPerfilAbertoId] = useState<number | null>(null);
  const [viagemAbertaId, setViagemAbertaId] = useState<number | null>(null);
  const [carregandoViagem, setCarregandoViagem] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    try {
      const resultado = await getMinhasSolicitacoes();
      setSolicitacoes(resultado);
    } catch {
      toast.error("Erro ao carregar solicitações");
    } finally {
      setCarregando(false);
    }
  };

  const aceitar = async (s: SolicitacaoParticipacaoDTO) => {
    setRespostaId(s.id);
    try {
      await aprovarSolicitacao(s.viagemId, s.outroUsuarioId);
      toast.success("Solicitação aprovada!");
      carregar();
    } catch {
      toast.error("Erro ao aprovar solicitação");
    } finally {
      setRespostaId(null);
    }
  };

  const recusar = async (s: SolicitacaoParticipacaoDTO) => {
    setRespostaId(s.id);
    try {
      await recusarSolicitacao(s.id);
      toast.success("Solicitação recusada.");
      carregar();
    } catch {
      toast.error("Erro ao recusar solicitação");
    } finally {
      setRespostaId(null);
    }
  };

  const cancelar = async (s: SolicitacaoParticipacaoDTO) => {
    setRespostaId(s.id);
    try {
      await cancelarSolicitacao(s.id);
      toast.success("Solicitação cancelada.");
      carregar();
    } catch {
      toast.error("Erro ao cancelar solicitação");
    } finally {
      setRespostaId(null);
    }
  };

  const getPrimeiroUltimoNome = (nome: string) => {
    const partes = nome.trim().split(" ");
    return partes.length > 1 ? `${partes[0]} ${partes[partes.length - 1]}` : partes[0];
  };

  const renderMensagem = (s: SolicitacaoParticipacaoDTO) => {
    const nome = getPrimeiroUltimoNome(s.outroUsuarioNome);
    const dataInicio = new Date(s.dataInicio).toLocaleDateString();
    const dataFim = new Date(s.dataFim).toLocaleDateString();

    switch (s.tipo) {
      case "CONVITE_RECEBIDO":
        return <>🎟️ <strong>{nome}</strong> te convidou para <strong>{s.destino}</strong> de {dataInicio} até {dataFim}</>;
      case "CONVITE_ENVIADO":
        return <>📤 Convite enviado para <strong>{nome}</strong> — <strong>{s.destino}</strong> de {dataInicio} até {dataFim}</>;
      case "SOLICITACAO_RECEBIDA":
        return <>📬 <strong>{nome}</strong> solicitou participar de <strong>{s.destino}</strong> de {dataInicio} até {dataFim}</>;
      case "SOLICITACAO_ENVIADA":
        return <>⏳ Você solicitou participar de <strong>{s.destino}</strong> de {dataInicio} até {dataFim}</>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Central de Solicitações</h2>

      {carregando ? (
        <div className="text-center py-10 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          Carregando solicitações...
        </div>
      ) : solicitacoes.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma solicitação no momento.</p>
      ) : (
        <ul className="space-y-4">
          {solicitacoes.map((s) => (
            <li key={s.id} className="border rounded-lg p-4 shadow-sm flex justify-between items-center flex-wrap">
              <div className="text-sm">
                <p className="font-semibold">{getPrimeiroUltimoNome(s.outroUsuarioNome)}</p>
                <p className="text-gray-600 text-xs">{s.outroUsuarioEmail}</p>
                <p className="mt-1">{renderMensagem(s)}</p>

                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => setPerfilAbertoId(s.outroUsuarioId)}
                        className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 font-medium transition"
                    >
                        Ver perfil
                    </button>
                    <button
                        onClick={() => {
                        setCarregandoViagem(true);
                        setViagemAbertaId(s.viagemId);
                        }}
                        className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 font-medium transition"
                    >
                        Ver viagem
                    </button>
                    </div>
              </div>

              <div className="flex flex-col gap-2 text-sm min-w-[100px] text-right">
                {["CONVITE_RECEBIDO", "SOLICITACAO_RECEBIDA"].includes(s.tipo) && (
                  <>
                    <button
                      onClick={() => aceitar(s)}
                      disabled={respostaId === s.id}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => recusar(s)}
                      disabled={respostaId === s.id}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Recusar
                    </button>
                  </>
                )}

                {["CONVITE_ENVIADO", "SOLICITACAO_ENVIADA"].includes(s.tipo) && (
                  <button
                    onClick={() => cancelar(s)}
                    disabled={respostaId === s.id}
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de perfil do outro usuário envolvido */}
      {perfilAbertoId && (
        <PerfilUsuarioModal
          usuarioId={perfilAbertoId}
          isOpen={!!perfilAbertoId}
          onClose={() => setPerfilAbertoId(null)}
        />
      )}

      {/* Modal de detalhes da viagem relacionada */}
      {viagemAbertaId && (
        <ViagemDetalhesModal
          viagemId={viagemAbertaId}
          open={!!viagemAbertaId}
          onClose={() => {
            setViagemAbertaId(null);
            setCarregandoViagem(false);
          }}
        />
      )}
    </div>
  );
};

export default CentralSolicitacoes;
