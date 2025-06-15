"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  ImagePlus,
  ZoomIn,
  Type,
  Folder,
  Plus
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AlbumFotoDTO } from "@/models/AlbumFotoDTO";
import { 
  uploadFotoAlbum, 
  listarFotosAlbum, 
  removerFotoAlbum,
  listarFotosAlbumUsuario 
} from "@/services/albumFotoService";

interface AlbumDeFotosProps {
  isOwner?: boolean;
  usuarioId?: number;
  className?: string;
}

const GaleriaModal = ({
  fotos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  isOwner
}: {
  fotos: AlbumFotoDTO[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  isOwner: boolean;
}) => {
  const [legenda, setLegenda] = useState("");
  const [editandoLegenda, setEditandoLegenda] = useState(false);

  const fotoAtual = fotos[currentIndex];

  useEffect(() => {
    if (fotoAtual?.legenda) {
      setLegenda(fotoAtual.legenda);
    } else {
      setLegenda("");
    }
  }, [fotoAtual]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < fotos.length - 1) {
        onNavigate(currentIndex + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, fotos.length, onClose, onNavigate]);

  const [swipeState, setSwipeState] = useState({
    startX: 0,
    startTime: 0,
    isDragging: false
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSwipeState({
      startX: touch.clientX,
      startTime: Date.now(),
      isDragging: true
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeState.isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = swipeState.startX - endX;
    const deltaTime = Date.now() - swipeState.startTime;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    const shouldNavigate = Math.abs(deltaX) > 30 || velocity > 0.5;
    
    if (shouldNavigate) {
      if (deltaX > 0 && currentIndex < fotos.length - 1) {
        onNavigate(currentIndex + 1);
      } else if (deltaX < 0 && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    }
    
    setSwipeState(prev => ({ ...prev, isDragging: false }));
  };

  if (!isOpen || !fotoAtual) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {currentIndex + 1} de {fotos.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < fotos.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className="absolute right-4 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div
        className="relative max-w-full max-h-full m-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={fotoAtual.urlFoto}
          alt={fotoAtual.legenda || 'Foto do álbum'}
          className="max-w-full max-h-[calc(100vh-8rem)] object-contain rounded-lg shadow-2xl"
          draggable={false}
        />

        {fotoAtual.legenda && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
            <p className="text-white text-sm text-center">
              {fotoAtual.legenda}
            </p>
          </div>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {fotos.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

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
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const MAX_FOTOS = 6;

  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  const isIOS = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }, []);

  const carregarFotos = useCallback(async () => {
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
      
      console.log('Fotos carregadas:', fotosCarregadas);
      console.log('Quantidade de fotos:', fotosCarregadas.length);
      setFotos(fotosCarregadas);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      toast.error("Erro ao carregar fotos do álbum");
      setFotos([]);
    } finally {
      setLoading(false);
    }
  }, [isOwner, usuarioId]);

  useEffect(() => {
    carregarFotos();
  }, [carregarFotos]);

  const compressImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          const MAX_WIDTH = isMobile() ? 1080 : 1920;
          const MAX_HEIGHT = isMobile() ? 1080 : 1920;
          const QUALITY = 0.85;
          
          let { width, height } = img;
          
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (!ctx) {
            throw new Error('Canvas context não disponível');
          }
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob], 
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
  }, [isMobile]);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtensions = /\.(jpg|jpeg|png|webp|heic|heif)$/i;
    const validMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'image/heic', 'image/heif'
    ];

    if (!validExtensions.test(file.name) && !validMimeTypes.includes(file.type)) {
      toast.error('Formato não suportado. Use JPEG, PNG, WebP ou HEIC.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Limite: 20MB');
      return;
    }

    try {
      setUploading(true);
      const loadingToast = toast.loading('Processando foto...', { duration: 30000 });

      const processedFile = await compressImage(file);
      
      const novaFoto = await uploadFotoAlbum(processedFile);
      
      if (novaFoto) {
        setFotos(prev => [...prev, novaFoto]);
        toast.success("Foto adicionada com sucesso!", { id: loadingToast });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao adicionar foto. Tente novamente.");
    } finally {
      setUploading(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  }, [compressImage]);

  const handleRemover = useCallback(async (fotoId: number) => {
    try {
      setRemovingIds(prev => new Set(prev).add(fotoId));
      
      const loadingToast = toast.loading('Removendo foto...');
      
      await removerFotoAlbum(fotoId);
      
      setFotos(prev => prev.filter(foto => foto.id !== fotoId));
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fotoId);
        return newSet;
      });
      
      toast.success("Foto removida!", { id: loadingToast });
    } catch (error) {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fotoId);
        return newSet;
      });
      console.error("Erro ao remover foto:", error);
      toast.error("Erro ao remover foto");
    }
  }, []);

  const abrirGaleria = useCallback((index: number) => {
    setFotoAtualIndex(Math.max(0, Math.min(index, fotos.length - 1)));
    setGaleriaAberta(true);
  }, [fotos.length]);

  const navegarGaleria = useCallback((novoIndex: number) => {
    setFotoAtualIndex(Math.max(0, Math.min(novoIndex, fotos.length - 1)));
  }, [fotos.length]);

  const podeUpload = isOwner && fotos.length < MAX_FOTOS && !uploading;
  const fotosRestantes = MAX_FOTOS - fotos.length;

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Carregando álbum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {isOwner ? "Meu Álbum" : "Álbum de Fotos"}
              </h3>
              <p className="text-xs text-gray-500">
                {fotos.length} de {MAX_FOTOS} fotos
                {isOwner && fotosRestantes > 0 && (
                  <span className="text-primary"> • {fotosRestantes} restante{fotosRestantes !== 1 ? 's' : ''}</span>
                )}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-red-500">
                  Debug: fotos.length={fotos.length}, MAX_FOTOS={MAX_FOTOS}, fotosRestantes={fotosRestantes}
                </p>
              )}
            </div>
          </div>

          {isOwner && isMobile() && (
            <div className="flex gap-2">
              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={!podeUpload}
                className={`p-2 rounded-lg transition-colors ${
                  podeUpload
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={() => galleryInputRef.current?.click()}
                disabled={!podeUpload}
                className={`p-2 rounded-lg transition-colors ${
                  podeUpload
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Folder className="w-4 h-4" />
              </button>
            </div>
          )}

          {isOwner && !isMobile() && (
            <button
              onClick={() => galleryInputRef.current?.click()}
              disabled={!podeUpload}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                podeUpload
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4" />
                  Adicionar
                </>
              )}
            </button>
          )}
        </div>

        {isOwner && (
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-700/80 leading-relaxed">
              <span className="font-medium">💫 Compartilhe seus momentos!</span> Este álbum é seu espaço para mostrar suas aventuras e experiências de viagem. Adicione até {MAX_FOTOS} fotos dos seus destinos favoritos para inspirar outros viajantes.
            </p>
          </div>
        )}
      </div>

      {isOwner && (
        <>
          <input
            ref={cameraInputRef}
            type="file"
            accept={isIOS() ? "image/*,.heic,.heif" : "image/*"}
            capture="environment"
            onChange={handleUpload}
            className="hidden"
          />
          
          <input
            ref={galleryInputRef}
            type="file"
            accept={isIOS() ? "image/*,.heic,.heif" : "image/*"}
            onChange={handleUpload}
            className="hidden"
          />
        </>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {fotos.map((foto, index) => {
            const isRemoving = removingIds.has(foto.id);
            
            return (
              <motion.div
                key={foto.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: isRemoving ? 0.3 : 1, 
                  scale: isRemoving ? 0.95 : 1
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`relative group aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition-all ${
                  isRemoving ? 'pointer-events-none' : ''
                }`}
                onClick={() => !isRemoving && abrirGaleria(index)}
              >
                {isRemoving && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-10">
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                  </div>
                )}

                {isOwner && !isRemoving && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemover(foto.id);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {foto.legenda && (
                  <div className="absolute top-1 left-1 p-1 bg-black/60 text-white rounded-full z-10">
                    <Type className="w-3 h-3" />
                  </div>
                )}

                <img
                  src={foto.urlFoto}
                  alt={foto.legenda || `Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  draggable={false}
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}

          {isOwner && Array.from({ length: fotosRestantes }, (_, index) => (
            <motion.div
              key={`empty-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: fotos.length * 0.1 + index * 0.05 }}
              className={`relative group aspect-square rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                podeUpload 
                  ? "border-gray-300 hover:border-primary hover:bg-primary/5" 
                  : "border-gray-200 cursor-not-allowed"
              }`}
              onClick={() => podeUpload && galleryInputRef.current?.click()}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                {uploading && index === 0 ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Plus className="w-6 h-6 mb-1" />
                )}
                <span className="text-xs font-medium">
                  {uploading && index === 0 ? "Enviando..." : "Adicionar"}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isOwner && fotos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-800 mb-2">Nenhuma foto disponível</h3>
          <p className="text-sm text-gray-600">
            Este usuário ainda não adicionou fotos ao seu álbum.
          </p>
        </div>
      )}

      <AnimatePresence>
        {galeriaAberta && fotos.length > 0 && (
          <GaleriaModal
            fotos={fotos}
            currentIndex={fotoAtualIndex}
            isOpen={galeriaAberta}
            onClose={() => setGaleriaAberta(false)}
            onNavigate={navegarGaleria}
            isOwner={isOwner}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumDeFotos; 