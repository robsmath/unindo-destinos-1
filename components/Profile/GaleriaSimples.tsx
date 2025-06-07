"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Edit3, Check, Type } from "lucide-react";
import { toast } from "react-hot-toast";
import { AlbumFotoDTO } from "@/models/AlbumFotoDTO";

interface GaleriaSimplesProps {
  fotos: AlbumFotoDTO[];
  fotoAtualIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onUpdateLegenda?: (fotoId: number, legenda: string) => void;
  isOwner: boolean;
}

const GaleriaSimples = ({ 
  fotos, 
  fotoAtualIndex, 
  isOpen, 
  onClose, 
  onNavigate,
  onUpdateLegenda,
  isOwner
}: GaleriaSimplesProps) => {
  const [editandoLegenda, setEditandoLegenda] = useState(false);
  const [novaLegenda, setNovaLegenda] = useState("");

  // Validação simples
  if (!fotos || fotos.length === 0 || !isOpen) return null;
  
  const indiceValido = Math.max(0, Math.min(fotoAtualIndex || 0, fotos.length - 1));
  const fotoAtual = fotos[indiceValido];
  
  if (!fotoAtual) return null;

  useEffect(() => {
    setNovaLegenda(fotoAtual.legenda || "");
  }, [fotoAtual]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (editandoLegenda) {
        if (e.key === 'Escape') {
          setEditandoLegenda(false);
          setNovaLegenda(fotoAtual.legenda || "");
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (fotos.length > 1) {
            const proximo = (indiceValido + 1) % fotos.length;
            onNavigate(proximo);
          }
          break;
        case 'ArrowLeft':
          if (fotos.length > 1) {
            const anterior = (indiceValido - 1 + fotos.length) % fotos.length;
            onNavigate(anterior);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, editandoLegenda, indiceValido, fotos.length, onClose, onNavigate, fotoAtual]);

  const irProxima = () => {
    if (fotos.length > 1 && !editandoLegenda) {
      const proximo = (indiceValido + 1) % fotos.length;
      onNavigate(proximo);
    }
  };

  const irAnterior = () => {
    if (fotos.length > 1 && !editandoLegenda) {
      const anterior = (indiceValido - 1 + fotos.length) % fotos.length;
      onNavigate(anterior);
    }
  };

  const salvarLegenda = () => {
    if (onUpdateLegenda) {
      onUpdateLegenda(fotoAtual.id, novaLegenda);
      setEditandoLegenda(false);
      toast.success("Legenda atualizada!");
    }
  };

  return (
    <>
      {/* Overlay com blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999]"
        onClick={!editandoLegenda ? onClose : undefined}
      />

      {/* Modal centralizado */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="relative w-full max-w-7xl h-full max-h-[95vh] flex flex-col">
          
          {/* Header com controles */}
          <div className="flex items-center justify-between mb-4 bg-black/60 backdrop-blur-sm rounded-t-xl p-4">
            <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">
              {indiceValido + 1} / {fotos.length}
            </div>
            <button
              onClick={onClose}
              className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors shadow-lg"
              title="Fechar galeria"
            >
              <X size={24} />
            </button>
          </div>

          {/* Área principal da imagem */}
          <div className="flex-1 flex items-center justify-center relative min-h-0">
            {/* Botão anterior */}
            {fotos.length > 1 && (
              <button
                onClick={irAnterior}
                disabled={editandoLegenda}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 text-black p-4 rounded-full hover:bg-white transition-colors shadow-xl ${
                  editandoLegenda ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
                title="Foto anterior"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Imagem centralizada */}
            <div className="flex items-center justify-center w-full h-full px-16">
              <img
                src={fotoAtual.urlFoto}
                alt={fotoAtual.legenda || `Foto ${indiceValido + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                draggable={false}
                style={{
                  maxHeight: 'calc(100vh - 300px)',
                  maxWidth: 'calc(100vw - 200px)'
                }}
              />
            </div>

            {/* Botão próxima */}
            {fotos.length > 1 && (
              <button
                onClick={irProxima}
                disabled={editandoLegenda}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 text-black p-4 rounded-full hover:bg-white transition-colors shadow-xl ${
                  editandoLegenda ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
                title="Próxima foto"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Footer com legenda e thumbnails */}
          <div className="bg-black/60 backdrop-blur-sm rounded-b-xl p-6 mt-4 max-h-80 overflow-y-auto">
            <div className="space-y-6">
              
              {/* Área da legenda */}
              <div>
                {editandoLegenda ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white">
                      <Type size={20} />
                      <span className="font-medium">Editando legenda:</span>
                    </div>
                    <textarea
                      value={novaLegenda}
                      onChange={(e) => setNovaLegenda(e.target.value)}
                      placeholder="Adicione uma legenda para esta foto..."
                      className="w-full bg-white/10 text-white placeholder-white/60 border border-white/30 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                      rows={3}
                      maxLength={200}
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">
                        {novaLegenda.length}/200 caracteres
                      </span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditandoLegenda(false);
                            setNovaLegenda(fotoAtual.legenda || "");
                          }}
                          className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={salvarLegenda}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                        >
                          <Check size={18} />
                          Salvar Legenda
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      {fotoAtual.legenda ? (
                        <p className="text-white text-base leading-relaxed">
                          {fotoAtual.legenda}
                        </p>
                      ) : (
                        <p className="text-white/60 italic">
                          {isOwner ? "Clique no ícone ao lado para adicionar uma legenda" : "Esta foto não possui legenda"}
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => setEditandoLegenda(true)}
                        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                        title={fotoAtual.legenda ? "Editar legenda" : "Adicionar legenda"}
                      >
                        <Edit3 size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnails de navegação */}
              {fotos.length > 1 && !editandoLegenda && (
                <div className="border-t border-white/20 pt-6">
                  <h4 className="text-white font-medium mb-4 text-center">
                    Navegar pelas fotos
                  </h4>
                  <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                    {fotos.map((foto, index) => (
                      <button
                        key={foto.id}
                        onClick={() => onNavigate(index)}
                        className={`w-16 h-16 rounded-lg border-3 overflow-hidden transition-all transform ${
                          index === indiceValido
                            ? 'border-white scale-110 shadow-xl'
                            : 'border-white/40 hover:border-white/70 hover:scale-105'
                        }`}
                        title={`Ir para foto ${index + 1}`}
                      >
                        <img
                          src={foto.urlFoto}
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GaleriaSimples; 