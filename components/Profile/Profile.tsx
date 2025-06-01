"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePerfil } from "@/app/context/PerfilContext";
import { useRouter, useSearchParams } from "next/navigation";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { FaCamera } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, User, Settings, Heart, Star, Shield, Award, UserCircle, ImageIcon } from "lucide-react";
import { toast } from 'react-hot-toast';
import PersonalDataForm from "@/components/Profile/PersonalDataForm";
import MinhasPreferencias from "@/components/Profile/MinhasPreferencias";
import MinhasViagens from "@/components/Profile/MinhasViagens";
import MeusPets from "@/components/Profile/MeusPets";
import CentralSolicitacoes from "@/components/Solicitacoes/CentralSolicitacoes";
import { uploadFotoPerfil } from "@/services/uploadService";
import { CacheInvalidationProvider } from "@/components/Profile/hooks/useCacheInvalidation";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Profile = () => {
  const { isAuthenticated, usuario, atualizarFotoPerfil } = useAuth();
  const { } = usePerfil(); // Dados já são carregados automaticamente pelo context
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingPage, setLoadingPage] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [abasCarregadas, setAbasCarregadas] = useState<Set<number>>(new Set());

  const tabs = [
    { label: "Dados Pessoais", param: "dados" },
    { label: "Minhas Viagens", param: "viagens" },
    { label: "Minhas Preferências", param: "preferencias" },
    { label: "Meus Pets", param: "pets" },
    { label: "Central de Solicitações", param: "solicitacoes" },
  ];  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    } else {
      // PerfilContext já carrega todos os dados automaticamente
      setAbasCarregadas(prev => new Set(prev).add(0));
      setTimeout(() => {
        setLoadingPage(false);
      }, 500);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const tabIndex = tabs.findIndex(tab => tab.param === tabParam.toLowerCase());
      if (tabIndex !== -1) {
        setSelectedIndex(tabIndex);
      }
    }
  }, [searchParams]);  const handleTabChange = async (index: number) => {
    setSelectedIndex(index);
    const tab = tabs[index];
    
    const newUrl = `/profile?tab=${tab.param}`;
    window.history.pushState({}, '', newUrl);

    // Todos os dados já são carregados pelo PerfilContext automaticamente
    // Só precisamos marcar a aba como carregada
    setAbasCarregadas(prev => new Set(prev).add(index));
  };
  // Função para comprimir imagem
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
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
      const finalFile = file.size > 2 * 1024 * 1024 ? await compressImage(file) : file;
      
      const imageUrl = await uploadFotoPerfil(finalFile);
      atualizarFotoPerfil(imageUrl);
      toast.success('Foto atualizada com sucesso!');
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      toast.error('Erro ao enviar foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  const handleAvatarClick = () => {
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
  };return (
    <CacheInvalidationProvider>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5">        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05))",
                "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05))",
                "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05))"
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
                y: [0, -90, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Profile-themed Icons with Smooth Animations */}
          <motion.div
            className="absolute top-32 right-16"
            animate={{ 
              y: [0, -18, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <User className="w-8 h-8 text-blue-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-20"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          >
            <Settings className="w-7 h-7 text-gray-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute top-48 left-40"
            animate={{ 
              y: [0, -10, 0],
              x: [0, 8, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Heart className="w-6 h-6 text-red-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute bottom-40 right-24"
            animate={{ 
              y: [0, 12, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <Star className="w-7 h-7 text-yellow-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute top-64 right-40"
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Shield className="w-6 h-6 text-green-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute top-36 right-64"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Award className="w-8 h-8 text-purple-500/30 drop-shadow-lg" />
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-48"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8
            }}
          >
            <UserCircle className="w-6 h-6 text-indigo-500/30 drop-shadow-lg" />
          </motion.div>
        </div>

        <div className="relative z-10 pt-32 pb-16 px-4">
          <motion.div
            className="mx-auto max-w-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {loadingPage && (
              <motion.div 
                className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">Carregando seu perfil...</p>
                </div>
              </motion.div>
            )}

            {!loadingPage && (
              <>
                {/* Header Section with Avatar */}
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent">
                      Seu Perfil
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Gerencie suas informações, viagens e preferências em um só lugar
                  </p>                  {/* Enhanced Avatar Section */}
                  <motion.div 
                    className="relative inline-block"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      {/* Gradient Ring */}
                      <div className="bg-gradient-to-r from-primary to-orange-500 rounded-full p-1">
                        <div className="bg-white rounded-full p-1">
                          <img
                            src={usuario?.fotoPerfil || "/images/user/avatar.png"}
                            alt="Foto de Perfil"
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Upload Overlay */}                      {uploading && (
                        <motion.div 
                          className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <span className="text-xs text-primary font-medium">Enviando...</span>
                        </motion.div>
                      )}
                      
                      {/* Camera Button */}
                      <motion.button
                        type="button"
                        onClick={handleAvatarClick}
                        className="absolute bottom-2 right-2 bg-gradient-to-r from-primary to-orange-500 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        <FaCamera size={18} />
                      </motion.button>                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </motion.div>

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
                            <p className="text-sm text-gray-600">Como deseja adicionar sua foto?</p>
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
                </motion.div>

                {/* Modern Tab Navigation */}
                <motion.div
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
                    <TabList className="flex flex-wrap justify-center border-b border-gray-200/50 p-6 bg-gradient-to-r from-gray-50/50 to-white/50">
                      {tabs.map((tab, idx) => (
                        <Tab
                          key={idx}
                          className={({ selected }) =>
                            classNames(
                              "relative px-6 py-3 mx-1 mb-2 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none group",
                              selected
                                ? "text-white shadow-lg"
                                : "text-gray-600 hover:text-primary hover:bg-primary/5"
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              {/* Active Background */}
                              {selected && (
                                <motion.div
                                  layoutId="activeTabBg"
                                  className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              )}
                              
                              {/* Hover Background */}
                              {!selected && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                              )}
                              
                              <span className="relative z-10">{tab.label}</span>
                            </>
                          )}
                        </Tab>
                      ))}
                    </TabList>

                    <TabPanels className="p-8">
                      <TabPanel>
                        <PersonalDataForm />
                      </TabPanel>
                      <TabPanel>
                        <MinhasViagens />
                      </TabPanel>
                      <TabPanel>
                        <MinhasPreferencias />
                      </TabPanel>
                      <TabPanel>
                        <MeusPets />
                      </TabPanel>
                      <TabPanel>
                        <CentralSolicitacoes />
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </CacheInvalidationProvider>
  );
};

export default Profile;
