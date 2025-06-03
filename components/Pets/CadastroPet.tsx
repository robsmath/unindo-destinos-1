"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PetDTO } from "@/models/PetDTO";
import { cadastrarPet, editarPet, getPetById } from "@/services/petService";
import { uploadFotoPerfil } from "@/services/uploadService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  FaArrowLeft, 
  FaPaw, 
  FaCamera, 
  FaCheck, 
  FaTimes, 
  FaDog, 
  FaCat, 
  FaHeart, 
  FaBone, 
  FaHome 
} from "react-icons/fa";
import { Loader2, ImageIcon } from "lucide-react";

interface CadastroPetProps {
  petId?: number;
}

const CadastroPet = ({ petId }: CadastroPetProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pet, setPet] = useState<PetDTO>({
    nome: "",
    raca: "",
    porte: "",
    sexo: "MACHO",
    dataNascimento: "",
    descricao: "",
    observacao: "",
    foto: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  useEffect(() => {
    const carregarPet = async () => {
      if (petId) {
        try {
          const petExistente = await getPetById(petId);
          setPet(petExistente);
        } catch (err) {
          toast.error("Erro ao carregar dados do pet.");
          router.push("/perfil?tab=meus-pets");
        }
      }
    };
    carregarPet();
  }, [petId, router]);  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (field: string, value: string) => {
    setPet((prev) => ({ ...prev, [field]: value }));
  };
  // Função para comprimir imagem
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Definir tamanho máximo mantendo proporção
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
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
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar e comprimir
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8 
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Limite de ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    try {
      // Comprimir imagem se necessário
      const finalFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;
      
      const imageUrl = await uploadFotoPerfil(finalFile, "PET");
      setPet((prev) => ({ ...prev, foto: imageUrl }));
      toast.success("Foto enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar a imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };
  const handleAvatarClick = () => {
    // Detectar se é mobile para mostrar opções
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      setShowPhotoOptions(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handlePhotoOption = (useCamera: boolean) => {
    setShowPhotoOptions(false);
    
    if (fileInputRef.current) {
      if (useCamera) {
        fileInputRef.current.setAttribute('capture', 'user');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet.nome) {
      toast.error("Por favor, digite o nome do pet");
      return;
    }
    setSaving(true);
    try {
      if (petId) {
        await editarPet(petId, pet);
        toast.success("Pet atualizado com sucesso!");
      } else {
        await cadastrarPet(pet);
        toast.success("Pet cadastrado com sucesso!");
      }

      router.push("/profile?tab=meus-pets");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar o pet.");
    } finally {
      setSaving(false);
    }
  };  return (
    <div className="relative min-h-screen overflow-hidden">          {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(234, 88, 12, 0.08), rgba(251, 146, 60, 0.12), rgba(249, 115, 22, 0.08))",
              "linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(234, 88, 12, 0.12), rgba(251, 146, 60, 0.08))",
              "linear-gradient(45deg, rgba(234, 88, 12, 0.08), rgba(251, 146, 60, 0.12), rgba(249, 115, 22, 0.08))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Simple Floating Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -80, 0],
              x: [0, Math.random() * 25 - 12, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 7 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Pet-themed Icons with Smooth Animations */}
        <motion.div
          className="absolute top-32 right-16"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaDog className="w-8 h-8 text-orange-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <FaCat className="w-7 h-7 text-amber-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-48 left-40"
          animate={{ 
            y: [0, -8, 0],
            x: [0, 6, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <FaHeart className="w-6 h-6 text-pink-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-24"
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, -6, 0]
          }}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <FaBone className="w-7 h-7 text-yellow-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-64 right-40"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <FaPaw className="w-6 h-6 text-primary/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-48"
          animate={{ 
            y: [0, -6, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8
          }}
        >
          <FaHome className="w-6 h-6 text-green-500/30 drop-shadow-lg" />
        </motion.div>
      </div>

      <section className="relative z-20 max-w-7xl mx-auto px-4 py-8 pt-32 pb-16">

      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 mx-auto max-w-4xl px-6 py-8 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.button
            type="button"
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-12 h-12 bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-2xl transition-all duration-200 shadow-lg border border-white/30"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
          
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                {petId ? "Editar Pet" : "Cadastrar Pet"}
              </span>
            </h2>
            <p className="text-gray-600">
              {petId ? "Atualize as informações do seu companheiro" : "Adicione um novo membro à família"}
            </p>
          </div>
          
          <div className="w-12"></div> {/* Spacer para centralizar o título */}
        </div>{/* Avatar do pet */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            {pet.foto ? (
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full p-1">
                  <div className="bg-white rounded-full p-1 w-full h-full">
                    <img
                      src={pet.foto}
                      alt="Foto do Pet"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full p-1">
                  <div className="bg-white rounded-full p-1 w-full h-full">
                    <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 text-primary text-5xl">
                      <FaPaw />
                    </div>
                  </div>
                </div>
              </div>
            )}            {uploading && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center rounded-full backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span className="text-xs text-primary font-medium">Enviando...</span>
              </div>
            )}

            <motion.button
              type="button"
              onClick={handleAvatarClick}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-orange-500 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={uploading}
            >
              <FaCamera size={18} />
            </motion.button>            <input
              type="file"
              accept="image/*"
              capture="user"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </motion.div>        {/* Campos do formulário */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nome */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do Pet <span className="text-red-500">*</span>
            </label>
            <div className="relative">              <Input
                name="nome"
                value={pet.nome}
                onChange={handleChange}
                placeholder="Digite o nome do seu pet"
                className="pl-4 pr-10 h-12 text-base border-2 border-gray-200 focus:border-primary transition-all duration-300"
              />            </div>
          </motion.div>

          {/* Raça */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Raça
            </label>
            <Input
              name="raca"
              value={pet.raca}
              onChange={handleChange}
              placeholder="Ex: Labrador, SRD, etc."
              className="h-12 text-base border-2 border-gray-200 focus:border-primary transition-all duration-300"
            />
          </motion.div>

          {/* Porte */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Porte <span className="text-red-500">*</span>
            </label>
            <div className="relative">              <Select 
                value={pet.porte} 
                onValueChange={(value) => handleSelectChange("porte", value)}
              >
                <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-primary transition-all duration-300">
                  <SelectValue placeholder="Selecione o porte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pequeno">
                    <div className="flex flex-col">
                      <span className="font-medium">Pequeno</span>
                      <span className="text-xs text-gray-500">Até 10kg</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Médio">
                    <div className="flex flex-col">
                      <span className="font-medium">Médio</span>
                      <span className="text-xs text-gray-500">10kg - 25kg</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Grande">
                    <div className="flex flex-col">
                      <span className="font-medium">Grande</span>
                      <span className="text-xs text-gray-500">Acima de 25kg</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>            </div>
          </motion.div>

          {/* Sexo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sexo
            </label>
            <Select value={pet.sexo} onValueChange={(value) => handleSelectChange("sexo", value)}>
              <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-primary transition-all duration-300">
                <SelectValue placeholder="Selecione o sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MACHO">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Macho</span>
                  </div>
                </SelectItem>
                <SelectItem value="FEMEA">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Fêmea</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Data de Nascimento */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data de Nascimento
            </label>            <div className="relative">              <Input
                type="date"
                value={pet.dataNascimento}
                onChange={(e) => {
                  const value = e.target.value;
                  setPet((prev) => ({ ...prev, dataNascimento: value }));
                }}
                max={new Date().toISOString().split('T')[0]}
                className="w-full h-12 text-base border-2 border-gray-200 focus:border-primary transition-all duration-300"
                style={{ fontSize: '16px' }}
              />            </div>
          </motion.div>
        </div>

        {/* Descrição e Observações */}
        <div className="space-y-6">
          {/* Descrição */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <div className="relative">
              <textarea
                name="descricao"
                value={pet.descricao}
                onChange={handleChange}
                className="w-full h-24 px-4 py-3 text-base border-2 border-gray-200 rounded-lg resize-none focus:border-primary focus:outline-none transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
                placeholder="Conte um pouco sobre a personalidade do seu pet, o que ele gosta de fazer, como ele se comporta..."
                rows={3}
              />              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {(pet.descricao || '').length}/500
              </div>
            </div>
          </motion.div>

          {/* Observações */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observações Especiais
            </label>
            <div className="relative">
              <textarea
                name="observacao"
                value={pet.observacao}
                onChange={handleChange}
                className="w-full h-20 px-4 py-3 text-base border-2 border-gray-200 rounded-lg resize-none focus:border-primary focus:outline-none transition-all duration-300 bg-gradient-to-br from-orange-50/50 to-yellow-50/50"
                placeholder="Alergias, medicamentos, cuidados especiais, restrições alimentares..."
                rows={2}
              />              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {(pet.observacao || '').length}/300
              </div>
            </div>
          </motion.div>
        </div>        {/* Botão de submit */}
        <motion.div 
          className="pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >          <Button 
            type="submit" 
            disabled={saving}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <AnimatePresence mode="wait">
              {saving ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Salvando...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <FaPaw className="h-5 w-5" />
                  <span>{petId ? "Salvar Alterações" : "Cadastrar Pet"}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button></motion.div>
      </motion.form>

      {/* Modal de Opções de Foto para Mobile */}
      <AnimatePresence>
        {showPhotoOptions && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoOptions(false)}
          >
            <motion.div
              className="bg-white rounded-t-3xl w-full max-w-sm p-6 space-y-4"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Escolha uma opção</h3>
                <p className="text-sm text-gray-600">Como deseja adicionar a foto do pet?</p>
              </div>
              
              <motion.button
                onClick={() => handlePhotoOption(true)}
                className="w-full flex items-center gap-4 p-4 bg-primary/10 rounded-2xl text-primary hover:bg-primary/20 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <FaCamera className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">Tirar Foto</div>
                  <div className="text-sm opacity-80">Usar câmera do dispositivo</div>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => handlePhotoOption(false)}
                className="w-full flex items-center gap-4 p-4 bg-gray-100 rounded-2xl text-gray-700 hover:bg-gray-200 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <ImageIcon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">Escolher da Galeria</div>
                  <div className="text-sm opacity-80">Selecionar foto existente</div>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => setShowPhotoOptions(false)}
                className="w-full p-3 text-gray-500 text-center border-t border-gray-200 mt-4"
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </section>
    </div>
  );
};

export default CadastroPet;
