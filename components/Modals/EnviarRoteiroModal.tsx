"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  enviarRoteiroPorEmail,
  getNomesParticipantes,
} from "@/services/roteiroService";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

interface EnviarRoteiroModalProps {
  aberto: boolean;
  onClose: () => void;
  roteiroId: number;
  viagemId: number;
}

const EnviarRoteiroModal = ({
  aberto,
  onClose,
  roteiroId,
  viagemId,
}: EnviarRoteiroModalProps) => {
  const [destino, setDestino] = useState<"CRIADOR" | "PARTICIPANTES" | "OUTRO" | null>(null);
  const [emailOutro, setEmailOutro] = useState("");
  const [loading, setLoading] = useState(false);
  const [nomesParticipantes, setNomesParticipantes] = useState<string[]>([]);
  const [carregandoParticipantes, setCarregandoParticipantes] = useState(false);

  const { usuario } = useAuth();

  useEffect(() => {
    const carregarParticipantes = async () => {
      if (destino === "PARTICIPANTES") {
        try {
          setCarregandoParticipantes(true);
          const nomes = await getNomesParticipantes(viagemId);
          setNomesParticipantes(nomes);
        } catch {
          toast.error("Erro ao carregar participantes.");
        } finally {
          setCarregandoParticipantes(false);
        }
      }
    };

    carregarParticipantes();
  }, [destino, viagemId]);

  if (!aberto) return null;

  const isEmailValido = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEnviar = async () => {
    setLoading(true);
    let emailParaEnviar: string | null = null;

    if (destino === "OUTRO") {
      if (!isEmailValido(emailOutro)) {
        toast.error("E-mail inválido. Verifique o endereço digitado.");
        setLoading(false);
        return;
      }
      emailParaEnviar = emailOutro;
    } else if (destino === "CRIADOR") {
      if (!usuario?.email || !isEmailValido(usuario.email)) {
        toast.error("Seu e-mail não está disponível ou está inválido.");
        setLoading(false);
        return;
      }
      emailParaEnviar = usuario.email;
    } else if (destino === "PARTICIPANTES") {
      emailParaEnviar = "TODOS";
    }

    if (!emailParaEnviar) {
      toast.error("Selecione uma opção ou informe um e-mail válido.");
      setLoading(false);
      return;
    }

    try {
      await enviarRoteiroPorEmail(roteiroId, emailParaEnviar);
      toast.success("E-mail enviado com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao enviar e-mail.");
    } finally {
      setLoading(false);
      setDestino(null);
      setEmailOutro("");
      setNomesParticipantes([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Para quem deseja enviar este roteiro?</h2>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="destinoEmail"
              value="CRIADOR"
              checked={destino === "CRIADOR"}
              onChange={() => setDestino("CRIADOR")}
            />
            Para o meu e-mail
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="destinoEmail"
              value="PARTICIPANTES"
              checked={destino === "PARTICIPANTES"}
              onChange={() => setDestino("PARTICIPANTES")}
            />
            Para todos os participantes da viagem
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="destinoEmail"
              value="OUTRO"
              checked={destino === "OUTRO"}
              onChange={() => setDestino("OUTRO")}
            />
            Para outro e-mail
          </label>

          {destino === "CRIADOR" && usuario?.email && (
            <div className="mt-2">
              <input
                type="email"
                value={usuario.email}
                disabled
                className="border border-gray-300 bg-gray-100 text-gray-700 px-3 py-2 w-full rounded cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                Este é o e-mail cadastrado na sua conta. Verifique se está correto.
              </p>
            </div>
          )}

          {destino === "PARTICIPANTES" && (
            <div className="mt-2">
              <div className="bg-gray-50 border border-gray-300 p-3 rounded text-sm max-h-36 overflow-y-auto">
                {carregandoParticipantes ? (
                  <p>Carregando participantes...</p>
                ) : nomesParticipantes.length > 0 ? (
                  <ul className="list-disc ml-5 text-gray-700">
                    {nomesParticipantes.map((nome, idx) => (
                      <li key={idx}>{nome}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhum participante encontrado.</p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Os nomes acima representam os participantes da viagem que receberão o roteiro por e-mail.
              </p>
            </div>
          )}

          {destino === "OUTRO" && (
            <div className="mt-2">
              <input
                type="email"
                placeholder="Digite o e-mail"
                value={emailOutro}
                onChange={(e) => setEmailOutro(e.target.value)}
                className={`border rounded px-3 py-2 w-full ${
                  emailOutro && !isEmailValido(emailOutro)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={handleEnviar}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnviarRoteiroModal;
