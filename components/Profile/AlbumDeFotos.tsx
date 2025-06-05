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
  ImagePlus
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
  /** Se true, permite upload e remoção (modo perfil próprio) */
  isOwner?: boolean;
  /** ID do usuário para visualizar fotos (modo visualização de outro usuário) */
  usuarioId?: number;
  /** Classe CSS adicional */
  className?: string;
}

interface GaleriaViewerProps {
  fotos: AlbumFotoDTO[];
  fotoAtualIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSetIndex: (index: number) => void;
}

const GaleriaViewer = ({ 
  fotos, 
  fotoAtualIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious,
  onSetIndex 
}: GaleriaViewerProps) => {
  // Garantir que fotos é um array
  const fotosSeguras = Array.isArray(fotos) ? fotos : [];
  const fotoAtual = fotosSeguras[fotoAtualIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen || !fotoAtual) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center touch-none"
        onClick={onClose}
      >
        {/* Área de botões superior - Mobile First */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 sm:p-4 z-10">
          {/* Contador à esquerda */}
          <div className="bg-black/60 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
            <span className="text-xs sm:text-sm font-medium">
              {fotoAtualIndex + 1} de {fotosSeguras.length}
            </span>
          </div>
          
          {/* Botão Fechar à direita - Maior no mobile */}
          <motion.button
            onClick={onClose}
            className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-7 h-7 sm:w-6 sm:h-6" />
          </motion.button>
        </div>

        {/* Navegação Anterior - Mobile Friendly */}
        {fotosSeguras.length > 1 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 sm:w-6 sm:h-6" />
          </motion.button>
        )}

        {/* Navegação Próxima - Mobile Friendly */}
        {fotosSeguras.length > 1 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 sm:w-6 sm:h-6" />
          </motion.button>
        )}

        {/* Imagem Principal - Mobile Optimized */}
        <motion.div
          key={fotoAtualIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-6xl max-h-[85vh] sm:max-h-[90vh] mx-1 sm:mx-4 mt-16 sm:mt-0"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={fotoAtual.urlFoto}
            alt={`Foto ${fotoAtualIndex + 1}`}
            className="w-full h-full max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Thumbnails - Mobile Friendly */}
        {fotosSeguras.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 max-w-[90vw] sm:max-w-md overflow-x-auto pb-2 px-2 sm:px-4">
            {fotosSeguras.map((foto, index) => (
              <motion.button
                key={foto.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetIndex(index);
                }}
                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === fotoAtualIndex
                    ? 'border-white shadow-lg'
                    : 'border-white/30 hover:border-white/60'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={foto.urlFoto}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
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
  const [fotosRemovendoIds, setFotosRemovendoIds] = useState<Set<number>>(new Set());
  const [fotosRecentesIds, setFotosRecentesIds] = useState<Set<number>>(new Set());
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);



  const MAX_FOTOS = 6;

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
    // Só carregar se os parâmetros estiverem corretos
    if (isOwner || usuarioId) {
      carregarFotos();
    } else {
      setFotos([]);
      setLoading(false);
    }
  }, [isOwner, usuarioId]);

  // Função para detectar se é iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Função para detectar formatos HEIC/HEIF do iPhone
  const isHeicFile = (file: File): boolean => {
    const heicExtensions = ['.heic', '.heif', '.HEIC', '.HEIF'];
    const heicMimeTypes = ['image/heic', 'image/heif'];
    
    const hasHeicExtension = heicExtensions.some(ext => file.name.toLowerCase().endsWith(ext.toLowerCase()));
    const hasHeicMimeType = heicMimeTypes.includes(file.type.toLowerCase());
    
    return hasHeicExtension || hasHeicMimeType;
  };

  // Função para verificar se o arquivo é uma imagem válida
  const isValidImageFile = (file: File): boolean => {
    const validImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
    ];
    
    // No iOS, também aceitar HEIC/HEIF
    if (isIOS()) {
      validImageTypes.push('image/heic', 'image/heif');
    }
    
    // Verificar por tipo MIME
    if (validImageTypes.includes(file.type.toLowerCase())) {
      return true;
    }
    
    // Verificar por extensão (fallback)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (isIOS()) {
      validExtensions.push('.heic', '.heif');
    }
    
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext.toLowerCase())
    );
    
    return hasValidExtension;
  };

  // Função para extrair orientação EXIF
  const getExifOrientation = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const dataView = new DataView(arrayBuffer);
        
        if (dataView.getUint16(0, false) !== 0xFFD8) {
          resolve(1);
          return;
        }
        
        let offset = 2;
        let marker;
        
        while (offset < dataView.byteLength) {
          marker = dataView.getUint16(offset, false);
          offset += 2;
          
          if (marker === 0xFFE1) {
            const exifLength = dataView.getUint16(offset, false);
            const exifStart = offset + 2;
            
            if (dataView.getUint32(exifStart, false) === 0x45786966) {
              const tiffStart = exifStart + 6;
              const littleEndian = dataView.getUint16(tiffStart, false) === 0x4949;
              
              const ifdOffset = dataView.getUint32(tiffStart + 4, littleEndian);
              const tagCount = dataView.getUint16(tiffStart + ifdOffset, littleEndian);
              
              for (let i = 0; i < tagCount; i++) {
                const tagOffset = tiffStart + ifdOffset + 2 + (i * 12);
                const tag = dataView.getUint16(tagOffset, littleEndian);
                
                if (tag === 0x0112) {
                  const orientation = dataView.getUint16(tagOffset + 8, littleEndian);
                  resolve(orientation);
                  return;
                }
              }
            }
            break;
          } else {
            offset += dataView.getUint16(offset, false);
          }
        }
        
        resolve(1);
      };
      
      reader.onerror = () => resolve(1);
      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
  };

  // Função para aplicar rotação EXIF
  const applyExifRotation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement, orientation: number) => {
    const { width, height } = canvas;
    
    switch (orientation) {
      case 2:
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        ctx.translate(width, height);
        ctx.rotate(Math.PI);
        break;
      case 4:
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break;
      case 5:
        ctx.rotate(Math.PI / 2);
        ctx.scale(1, -1);
        break;
      case 6:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(Math.PI / 2);
        ctx.translate(0, -height);
        break;
      case 7:
        ctx.rotate(Math.PI / 2);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break;
      case 8:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(-Math.PI / 2);
        ctx.translate(-width, 0);
        break;
      default:
        break;
    }
  };

  // Função de compressão com tratamento iOS
  const compressImage = async (file: File): Promise<File> => {

    return new Promise(async (resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const orientation = await getExifOrientation(file);
        
        img.onload = () => {
          try {
            const MAX_WIDTH = isIOS() ? 1200 : 1500;
            const MAX_HEIGHT = isIOS() ? 1200 : 1500;
            const QUALITY = isIOS() ? 0.8 : 0.85;
            
            let { width, height } = img;
            
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
            
            if (orientation >= 5 && orientation <= 8) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }
            
            if (!ctx) {
              throw new Error('Não foi possível criar contexto do canvas');
            }

            applyExifRotation(canvas, ctx, img, orientation);
            
            const drawWidth = orientation >= 5 && orientation <= 8 ? height : width;
            const drawHeight = orientation >= 5 && orientation <= 8 ? width : height;
            
            ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
            
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
                  reject(new Error('Falha ao comprimir a imagem'));
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
        
        const imageUrl = URL.createObjectURL(file);
        img.src = imageUrl;
        
        img.onload = (originalOnload => function() {
          URL.revokeObjectURL(imageUrl);
          return originalOnload?.call(this);
        })(img.onload);
        
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;



    // Validar se é imagem válida
    if (!isValidImageFile(file)) {
      let errorMsg = 'Por favor, selecione apenas arquivos de imagem válidos.';
      if (isIOS()) {
        errorMsg += ' Formatos aceitos: JPEG, PNG, HEIC, HEIF.';
      } else {
        errorMsg += ' Formatos aceitos: JPEG, PNG, WebP.';
      }
      toast.error(errorMsg);
      return;
    }

    // Validar tamanho (mais permissivo para iPhone)
    const MAX_SIZE_MB = isIOS() ? 20 : 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Foto muito grande. Limite de ${MAX_SIZE_MB}MB.`);
      return;
    }

    try {
      setUploading(true);
      const loadingToast = toast.loading('Processando foto...', { duration: 15000 });

      // Comprimir/processar a imagem
      const processedFile = await compressImage(file);
      


      const novaFoto = await uploadFotoAlbum(processedFile);
      
      if (novaFoto) {
        // Marcar foto como recente para animação especial
        setFotosRecentesIds(prev => new Set(prev).add(novaFoto.id));
        
        // Adicionar foto ao estado local instantaneamente
        setFotos(prev => {
          const novasFotos = Array.isArray(prev) ? [...prev, novaFoto] : [novaFoto];
          return novasFotos;
        });
        
        // Remover marcação de recente após animação
        setTimeout(() => {
          setFotosRecentesIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(novaFoto.id);
            return newSet;
          });
        }, 800);
        
        toast.success("Foto adicionada com sucesso!", {
          id: loadingToast,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("❌ Erro ao fazer upload:", error);
      toast.error("Erro ao adicionar foto");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemover = async (fotoId: number) => {
    try {
      // Adicionar ao set de fotos sendo removidas para mostrar animação
      setFotosRemovendoIds(prev => new Set(prev).add(fotoId));
      
      // Toast de loading
      const loadingToast = toast.loading('Removendo foto...', { duration: 5000 });
      
      // Aguardar um pouco para mostrar a animação
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fazer a requisição de remoção
      await removerFotoAlbum(fotoId);
      
      // Remover foto do estado com animação de saída
      setFotos(prev => Array.isArray(prev) ? prev.filter(foto => foto.id !== fotoId) : []);
      
      // Remover do set de fotos sendo removidas
      setFotosRemovendoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fotoId);
        return newSet;
      });
      
      toast.success("Foto removida com sucesso!", { 
        id: loadingToast,
        duration: 3000 
      });
    } catch (error) {
      // Remover do set em caso de erro
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
    setFotoAtualIndex(index);
    setGaleriaAberta(true);
  };

  const proximaFoto = () => {
    if (Array.isArray(fotos) && fotos.length > 0) {
      setFotoAtualIndex(prev => (prev + 1) % fotos.length);
    }
  };

  const fotoAnterior = () => {
    if (Array.isArray(fotos) && fotos.length > 0) {
      setFotoAtualIndex(prev => (prev - 1 + fotos.length) % fotos.length);
    }
  };

  const podeUpload = isOwner && Array.isArray(fotos) && fotos.length < MAX_FOTOS && !uploading;

  // Funções para o seletor de upload
  const handleUploadClick = () => {
    setShowUploadOptions(true);
  };

  const handleCameraClick = () => {
    setShowUploadOptions(false);
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    setShowUploadOptions(false);
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
                {Array.isArray(fotos) ? fotos.length : 0} de {MAX_FOTOS} fotos
              </p>
            </div>
          </div>

        {/* Botão de Upload */}
        {isOwner && (
          <motion.button
            onClick={handleUploadClick}
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
                <span className="hidden sm:inline">Adicionar Foto</span>
                <span className="sm:hidden">Adicionar</span>
              </>
            )}
          </motion.button>
        )}

          {/* Input para Galeria */}
          <input
            ref={fileInputRef}
            type="file"
            accept={isIOS() ? "image/*,.heic,.heif" : "image/*"}
            onChange={handleUpload}
            className="hidden"
          />

          {/* Input para Câmera */}
          <input
            ref={cameraInputRef}
            type="file"
            accept={isIOS() ? "image/*,.heic,.heif" : "image/*"}
            capture="environment"
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {/* Descrição */}
        {isOwner && (
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-700/80 leading-relaxed">
              <span className="font-medium">💫 Compartilhe seus momentos!</span> Este álbum é seu espaço para mostrar suas aventuras e experiências de viagem. Adicione até 6 fotos dos seus destinos favoritos para inspirar outros viajantes.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Opções de Upload */}
      <AnimatePresence>
        {showUploadOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadOptions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                Adicionar Foto
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Escolha como deseja adicionar sua foto
              </p>

              <div className="space-y-3">
                {/* Opção Câmera */}
                <motion.button
                  onClick={handleCameraClick}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 bg-blue-500 text-white rounded-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Tirar Foto</p>
                    <p className="text-sm text-gray-600">Usar câmera do dispositivo</p>
                  </div>
                </motion.button>

                {/* Opção Galeria */}
                <motion.button
                  onClick={handleGalleryClick}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 bg-green-500 text-white rounded-lg">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Escolher da Galeria</p>
                    <p className="text-sm text-gray-600">Selecionar foto existente</p>
                  </div>
                </motion.button>
              </div>

              {/* Botão Cancelar */}
              <motion.button
                onClick={() => setShowUploadOptions(false)}
                className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aviso de Limite */}
      {isOwner && Array.isArray(fotos) && fotos.length >= MAX_FOTOS && (
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
      {Array.isArray(fotos) && fotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {fotos.map((foto, index) => {
              const isRemoving = fotosRemovendoIds.has(foto.id);
              const isRecente = fotosRecentesIds.has(foto.id);
              return (
                <motion.div
                  key={foto.id}
                  layout
                  initial={{ 
                    opacity: 0, 
                    scale: isRecente ? 0.5 : 0.9,
                    y: isRecente ? 20 : 0
                  }}
                  animate={{ 
                    opacity: isRemoving ? 0.5 : 1, 
                    scale: isRemoving ? 0.95 : (isRecente ? 1.05 : 1),
                    filter: isRemoving ? "blur(1px)" : "blur(0px)",
                    y: 0,
                    boxShadow: isRecente 
                      ? "0 10px 25px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)" 
                      : "none"
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8,
                    transition: { duration: 0.4, ease: "easeInOut" }
                  }}
                  transition={{ 
                    duration: isRecente ? 0.6 : 0.3, 
                    delay: isRecente ? 0 : index * 0.1,
                    ease: isRecente ? "easeOut" : "easeInOut"
                  }}
                  className={`relative group aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 ${
                    isRemoving ? 'pointer-events-none' : ''
                  }`}
                  onClick={() => !isRemoving && abrirGaleria(index)}
                >
              {/* Overlay de Loading durante remoção */}
              {isRemoving && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-30"
                >
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-spin" />
                  </div>
                </motion.div>
              )}

              {/* Badge "Nova" para fotos recém-adicionadas */}
              {isRecente && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-1 left-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20"
                >
                  NOVA ✨
                </motion.div>
              )}

              {/* Badge "Nova" para fotos recém-adicionadas */}
              {isRecente && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-1 left-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20"
                >
                  NOVA ✨
                </motion.div>
              )}

              {/* Botão Deletar - Mais Visível */}
              {isOwner && !isRemoving && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemover(foto.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Remover foto"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              )}

                {/* Fallback de carregamento */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Carregando...</p>
                  </div>
                </div>

                <img
                  src={foto.urlFoto}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 sm:group-hover:scale-110 relative z-10"
                  loading="lazy"
                  onLoad={(e) => {
                    // Esconder o fallback
                    const target = e.target as HTMLImageElement;
                    const fallback = target.previousElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'none';
                  }}
                  onError={(e) => {
                    // Mostrar erro no fallback
                    const target = e.target as HTMLImageElement;
                    const fallback = target.previousElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.innerHTML = `
                        <div class="text-center">
                          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span class="text-red-500 text-xs">!</span>
                          </div>
                          <p class="text-xs text-red-500">Erro ao carregar</p>
                        </div>
                      `;
                    }
                    target.style.display = 'none';
                  }}
                />
              
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-2 sm:p-3 bg-white/90 rounded-full backdrop-blur-sm">
                        <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                      </div>
                      {isOwner && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemover(foto.id);
                          }}
                          className="p-2 sm:p-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full transition-colors duration-200 backdrop-blur-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </div>
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
          className="text-center py-12 sm:py-16 px-4"
        >
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            {isOwner ? "Seu álbum está vazio" : "Nenhuma foto disponível"}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {isOwner 
              ? "Adicione até 6 fotos para compartilhar seus melhores momentos com outros viajantes."
              : "Este usuário ainda não adicionou fotos ao seu álbum."
            }
          </p>
          {isOwner && (
            <motion.button
              onClick={handleUploadClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ImagePlus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar Primeira Foto</span>
              <span className="sm:hidden">Adicionar Foto</span>
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Visualizador de Galeria */}
      <GaleriaViewer
        fotos={Array.isArray(fotos) ? fotos : []}
        fotoAtualIndex={fotoAtualIndex}
        isOpen={galeriaAberta}
        onClose={() => setGaleriaAberta(false)}
        onNext={proximaFoto}
        onPrevious={fotoAnterior}
        onSetIndex={setFotoAtualIndex}
      />
    </div>
  );
};

export default AlbumDeFotos; 