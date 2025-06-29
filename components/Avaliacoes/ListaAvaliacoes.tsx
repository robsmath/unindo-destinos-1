"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, MessageCircle, User, MapPin } from "lucide-react";
import { buscarAvaliacoesPorUsuario } from "@/services/avaliacaoService";
import { getViagemById } from "@/services/viagemService";
import { AvaliacaoDTO } from "@/models/AvaliacaoDTO";
import { ViagemDTO } from "@/models/ViagemDTO";
import StarRating from "@/components/Common/StarRating";
import { formatarDataViagem } from "@/utils/dateUtils";

interface ListaAvaliacoesProps {
  usuarioId: number;
}

interface AvaliacaoComViagem extends AvaliacaoDTO {
  viagem?: ViagemDTO;
}

export default function ListaAvaliacoes({ usuarioId }: ListaAvaliacoesProps) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoComViagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarAvaliacoes();
  }, [usuarioId]);

  const carregarAvaliacoes = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await buscarAvaliacoesPorUsuario(usuarioId);
      
      // Buscar informações das viagens para cada avaliação
      const avaliacoesComViagem = await Promise.all(
        dados.map(async (avaliacao) => {
          try {
            const viagem = await getViagemById(avaliacao.viagemId);
            return { ...avaliacao, viagem };
          } catch (error) {
            console.error(`Erro ao buscar viagem ${avaliacao.viagemId}:`, error);
            return avaliacao; // Retorna a avaliação sem as informações da viagem
          }
        })
      );
      
      setAvaliacoes(avaliacoesComViagem);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      setErro("Erro ao carregar avaliações");
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataISO: string) => {
    return formatarDataViagem(dataISO);
  };

  const formatarPeriodoViagem = (dataInicio?: string, dataFim?: string) => {
    if (!dataInicio || !dataFim) return null;
    
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    const mesmoMes = inicio.getMonth() === fim.getMonth() && inicio.getFullYear() === fim.getFullYear();
    
    if (mesmoMes) {
      return `${inicio.getDate()} a ${fim.getDate()}/${(fim.getMonth() + 1).toString().padStart(2, '0')}/${fim.getFullYear()}`;
    }
    
    return `${inicio.toLocaleDateString("pt-BR")} a ${fim.toLocaleDateString("pt-BR")}`;
  };

  const calcularMediaAvaliacoes = () => {
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);
    return (soma / avaliacoes.length).toFixed(1);
  };

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <motion.div
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600">Carregando avaliações...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-600 font-medium">{erro}</p>
          <button
            onClick={carregarAvaliacoes}
            className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (avaliacoes.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ainda sem avaliações</h3>
          <p className="text-gray-600 text-sm">
            Este usuário ainda não recebeu nenhuma avaliação de outros viajantes.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 rounded-xl p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {avaliacoes.length} {avaliacoes.length === 1 ? "avaliação" : "avaliações"}
            </h3>
            <div className="flex items-center gap-2">
              <StarRating rating={Number(calcularMediaAvaliacoes())} size="md" />
              <span className="text-lg font-semibold text-gray-800">
                {calcularMediaAvaliacoes()}
              </span>
              <span className="text-sm text-gray-600">de 5.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:flex-col md:text-right">
            <p className="text-sm text-gray-600">Média geral</p>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg md:text-xl font-bold text-white">
                {calcularMediaAvaliacoes()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {avaliacoes.map((avaliacao, index) => (
          <motion.div
            key={avaliacao.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={avaliacao.fotoAvaliador || "/images/user/avatar.png"}
                  alt={avaliacao.nomeAvaliador}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{avaliacao.nomeAvaliador}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    {formatarData(avaliacao.dataCriacao)}
                  </div>
                  {avaliacao.viagem && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{avaliacao.viagem.destino}</span>
                      {formatarPeriodoViagem(avaliacao.viagem.dataInicio, avaliacao.viagem.dataFim) && (
                        <span className="ml-1">• {formatarPeriodoViagem(avaliacao.viagem.dataInicio, avaliacao.viagem.dataFim)}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:flex-col sm:text-right">
                <StarRating rating={avaliacao.nota} size="sm" />
                <p className="text-xs text-gray-500 sm:mt-1">{avaliacao.nota}/5</p>
              </div>
            </div>

            {avaliacao.comentario && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{avaliacao.comentario}"
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 