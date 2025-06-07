"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  X, 
  Trash2, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Camera,
  AlertCircle,
  ImagePlus,
  ZoomIn,
  Edit3,
  Check,
  Type
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AlbumFotoDTO } from "@/models/AlbumFotoDTO";
import { 
  uploadFotoAlbum, 
  listarFotosAlbum, 
  removerFotoAlbum,
  listarFotosAlbumUsuario 
} from "@/services/albumFotoService";
import GaleriaSimples from "./GaleriaSimples";

interface AlbumDeFotosProps {
  /** Se true, permite upload e remoção (modo perfil próprio) */
  isOwner?: boolean;
  /** ID do usuário para visualizar fotos (modo visualização de outro usuário) */
  usuarioId?: number;
  /** Classe CSS adicional */
  className?: string;
}



const AlbumDeFotos = ({ 
  isOwner = false, 
  usuarioId,
  className = "" 
}: AlbumDeFotosProps) => {
  const [fotos, setFotos] = useState<AlbumFotoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [galeriaAberta, setGaleriaAberta] = useState(false);
  const [fotoAtualIndex, setFotoAtualIndex] = useState(0);
  const [fotosRemovendoIds, setFotosRemovendoIds] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FOTOS = 6;

  // Detectar se é mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Detectar se é iOS
  const isIOS = () => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  const carregarFotos = async () => {
    try {
      setLoading(true);
      let fotosCarregadas: AlbumFotoDTO[] = [];
      
      if (isOwner) {
        const resultado = await listarFotosAlbum();
        fotosCarregadas = Array.isArray(resultado) ? resultado : [];
      } else if (usuarioId) {
        const resultado = await listarFotosAlbumUsuario(usuarioId);
        fotosCarregadas = Array.isArray(resultado) ? resultado : [];
      }
      
      setFotos(fotosCarregadas);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      toast.error("Erro ao carregar fotos do álbum");
      setFotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner || usuarioId) {
      carregarFotos();
    } else {
      setFotos([]);
      setLoading(false);
    }
  }, [isOwner, usuarioId]);

  // Garantir que o índice esteja sempre válido
  useEffect(() => {
    if (fotos.length > 0 && fotoAtualIndex >= fotos.length) {
      setFotoAtualIndex(0);
    }
  }, [fotos, fotoAtualIndex]);

  // Função de compressão otimizada
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          const MAX_WIDTH = isMobile() ? 1200 : 1600;
          const MAX_HEIGHT = isMobile() ? 1200 : 1600;
          const QUALITY = isMobile() ? 0.8 : 0.85;
          
          let { width, height } = img;
          
          // Redimensionar mantendo proporção
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (!ctx) {
            throw new Error('Contexto do canvas não disponível');
          }
          
          // Desenhar e comprimir
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], 
                  file.name.replace(/\.[^/.]+$/, '.jpg'),
                  {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                reject(new Error('Falha ao comprimir imagem'));
              }
            },
            'image/jpeg',
            QUALITY
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (isIOS()) {
      validTypes.push('image/heic', 'image/heif');
    }

    if (!validTypes.includes(file.type.toLowerCase()) && 
        !file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|heic|heif)$/)) {
      toast.error('Formato de arquivo não suportado. Use JPEG, PNG ou WebP.');
      return;
    }

    const maxSize = isMobile() ? 15 * 1024 * 1024 : 10 * 1024 * 1024; // 15MB mobile, 10MB desktop
    if (file.size > maxSize) {
      toast.error(`Arquivo muito grande. Limite: ${isMobile() ? '15MB' : '10MB'}`);
      return;
    }

    try {
      setUploading(true);
      const loadingToast = toast.loading('Processando foto...', { duration: 20000 });

      // Comprimir imagem
      const processedFile = await compressImage(file);
      
      // Upload
      const novaFoto = await uploadFotoAlbum(processedFile);
      
      if (novaFoto) {
        // Adicionar foto imediatamente ao estado
        setFotos(prev => [...prev, novaFoto]);
        toast.success("Foto adicionada com sucesso!", { id: loadingToast });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao adicionar foto. Tente novamente.");
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemover = async (fotoId: number) => {
    try {
      setFotosRemovendoIds(prev => new Set(prev).add(fotoId));
      
      const loadingToast = toast.loading('Removendo foto...');
      
      await removerFotoAlbum(fotoId);
      
      // Encontrar o índice da foto removida para ajustar a navegação
      const fotoRemovidaIndex = fotos.findIndex(foto => foto.id === fotoId);
      const novasFotos = fotos.filter(foto => foto.id !== fotoId);
      
      setFotos(novasFotos);
      
      // Ajustar o índice atual se necessário
      if (fotoRemovidaIndex <= fotoAtualIndex && fotoAtualIndex > 0) {
        setFotoAtualIndex(prev => Math.max(0, prev - 1));
      } else if (fotoAtualIndex >= novasFotos.length) {
        setFotoAtualIndex(Math.max(0, novasFotos.length - 1));
      }
      
      setFotosRemovendoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fotoId);
        return newSet;
      });
      
      toast.success("Foto removida com sucesso!", { id: loadingToast });
    } catch (error) {
      setFotosRemovendoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fotoId);
        return newSet;
      });
      console.error("Erro ao remover foto:", error);
      toast.error("Erro ao remover foto");
    }
  };

  const abrirGaleria = (index: number) => {
    if (fotos.length > 0) {
      const indexValido = Math.max(0, Math.min(index, fotos.length - 1));
      setFotoAtualIndex(indexValido);
      setGaleriaAberta(true);
    }
  };

  const navegarGaleria = (novoIndex: number) => {
    if (fotos.length > 0) {
      const indexValido = Math.max(0, Math.min(novoIndex, fotos.length - 1));
      setFotoAtualIndex(indexValido);
    }
  };

  // Função para atualizar legenda (preparado para futuro backend)
  const handleUpdateLegenda = (fotoId: number, legenda: string) => {
    // Por enquanto, apenas atualiza localmente
    // TODO: Implementar chamada ao backend quando estiver pronto
    setFotos(prev => prev.map(foto => 
      foto.id === fotoId 
        ? { ...foto, legenda: legenda.trim() || undefined }
        : foto
    ));
    
    // console.log(`Atualizando legenda da foto ${fotoId}: "${legenda}"`);
    // Aqui futuramente será feita a chamada para o backend:
    // await updateFotoLegenda(fotoId, legenda);
  };

  const podeUpload = isOwner && fotos.length < MAX_FOTOS && !uploading;

  const triggerUpload = () => {
    if (!podeUpload) return;
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando álbum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {isOwner ? "Meu Álbum" : "Álbum de Fotos"}
              </h3>
              <p className="text-sm text-gray-600">
                {fotos.length} de {MAX_FOTOS} fotos
              </p>
            </div>
          </div>

          {/* Botão de Upload Simplificado */}
          {isOwner && (
            <div className="relative">
              <motion.button
                onClick={triggerUpload}
                disabled={!podeUpload}
                className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center ${
                  podeUpload
                    ? "bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                whileHover={podeUpload ? { scale: 1.02 } : {}}
                whileTap={podeUpload ? { scale: 0.98 } : {}}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4" />
                    <span>Adicionar Foto</span>
                  </>
                )}
              </motion.button>

              {/* Input simplificado que funciona tanto para câmera quanto galeria */}
              <input
                ref={fileInputRef}
                type="file"
                accept={isIOS() ? "image/*,.heic,.heif" : "image/*"}
                capture={isMobile() ? "environment" : undefined}
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        {/* Descrição para owners */}
        {isOwner && (
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-700/80 leading-relaxed">
              <span className="font-medium">💫 Compartilhe seus momentos!</span> Este álbum é seu espaço para mostrar suas aventuras e experiências de viagem. Adicione até 6 fotos dos seus destinos favoritos e legendas para inspirar outros viajantes.
            </p>
          </div>
        )}
      </div>

      {/* Aviso de limite */}
      {isOwner && fotos.length >= MAX_FOTOS && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800 mb-1">Limite Atingido</h4>
            <p className="text-sm text-amber-700">
              Você atingiu o limite máximo de {MAX_FOTOS} fotos. Para adicionar novas fotos, remova algumas existentes.
            </p>
          </div>
        </motion.div>
      )}

      {/* Grid de Fotos */}
      {fotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {fotos.map((foto, index) => {
              const isRemoving = fotosRemovendoIds.has(foto.id);
              
              return (
                <motion.div
                  key={foto.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isRemoving ? 0.5 : 1, 
                    scale: isRemoving ? 0.95 : 1,
                    filter: isRemoving ? "blur(1px)" : "blur(0px)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8,
                    transition: { duration: 0.3 }
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200 ${
                    isRemoving ? 'pointer-events-none' : ''
                  }`}
                  onClick={() => !isRemoving && abrirGaleria(index)}
                >
                  {/* Loading overlay durante remoção */}
                  {isRemoving && (
                    <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-30">
                      <div className="bg-white/90 rounded-full p-3 shadow-lg">
                        <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                      </div>
                    </div>
                  )}

                  {/* Botão de remover */}
                  {isOwner && !isRemoving && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemover(foto.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-lg"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}

                  {/* Indicador de legenda */}
                  {foto.legenda && (
                    <div className="absolute top-2 left-2 p-1.5 bg-black/60 text-white rounded-full backdrop-blur-sm z-20">
                      <Type className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  )}

                  {/* Imagem */}
                  <img
                    src={foto.urlFoto}
                    alt={foto.legenda || `Foto ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    draggable={false}
                  />
                  
                  {/* Overlay com ícone */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="p-3 bg-white/90 rounded-full backdrop-blur-sm">
                        <ZoomIn className="w-4 h-4 text-gray-700" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Legenda na parte inferior */}
                  {foto.legenda && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs leading-tight line-clamp-2">
                        {foto.legenda}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Estado Vazio */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-4"
        >
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Camera className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isOwner ? "Seu álbum está vazio" : "Nenhuma foto disponível"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {isOwner 
              ? "Adicione até 6 fotos para compartilhar seus melhores momentos com outros viajantes."
              : "Este usuário ainda não adicionou fotos ao seu álbum."
            }
          </p>
          {isOwner && (
            <motion.button
              onClick={triggerUpload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ImagePlus className="w-4 h-4" />
              Adicionar Primeira Foto
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Visualizador de Galeria */}
      <AnimatePresence>
        {galeriaAberta && fotos.length > 0 && (
          <GaleriaSimples
            fotos={fotos}
            fotoAtualIndex={fotoAtualIndex}
            isOpen={galeriaAberta}
            onClose={() => setGaleriaAberta(false)}
            onNavigate={navegarGaleria}
            onUpdateLegenda={handleUpdateLegenda}
            isOwner={isOwner}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumDeFotos; 