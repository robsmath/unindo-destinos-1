"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePerfil } from "@/app/context/PerfilContext";
import { useRouter, useSearchParams } from "next/navigation";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
  const { carregarUsuario, carregarPreferencias, recarregarViagens } = usePerfil();
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
  ];
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    } else {
      carregarUsuario().then(() => {
        setAbasCarregadas(prev => new Set(prev).add(0));
        setTimeout(() => {
          setLoadingPage(false);
        }, 500);
      });
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
  }, [searchParams]);
  const handleTabChange = async (index: number) => {
    setSelectedIndex(index);
    const tab = tabs[index];
    
    const newUrl = `/profile?tab=${tab.param}`;
    window.history.pushState({}, '', newUrl);

    if (!abasCarregadas.has(index)) {
      try {
        switch (index) {
          case 0:
            await carregarUsuario();
            break;          case 1: // Minhas Viagens
            await recarregarViagens();
            break;
          case 2:
            await carregarPreferencias();
            break;
          case 3:
          case 4:
            break;
        }
        
        setAbasCarregadas(prev => new Set(prev).add(index));
      } catch (error) {
        console.error("Erro ao carregar dados da aba:", error);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 2;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`O arquivo é muito grande. Limite de ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadFotoPerfil(file);
      atualizarFotoPerfil(imageUrl);
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };  return (
    <CacheInvalidationProvider>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(234, 88, 12, 0.03), rgba(249, 115, 22, 0.03), rgba(234, 88, 12, 0.03))",
                "linear-gradient(135deg, rgba(249, 115, 22, 0.03), rgba(234, 88, 12, 0.03), rgba(249, 115, 22, 0.03))",
                "linear-gradient(45deg, rgba(234, 88, 12, 0.03), rgba(249, 115, 22, 0.03), rgba(234, 88, 12, 0.03))"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full blur-3xl"
            animate={{ 
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-500/15 to-primary/15 rounded-full blur-2xl"
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4]
            }}            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
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
                      
                      {/* Upload Overlay */}
                      {uploading && (
                        <motion.div 
                          className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      </motion.button>
                      
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </motion.div>
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
