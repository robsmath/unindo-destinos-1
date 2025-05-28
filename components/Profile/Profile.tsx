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
  };
  return (
    <CacheInvalidationProvider>
      <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-32 pb-16 px-4">
        <motion.div
          className="relative z-10 mx-auto max-w-5xl px-6 py-8 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loadingPage && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!loadingPage && (
            <>
              <h2 className="mb-6 text-center text-3xl font-semibold text-black">
                Seu Perfil
              </h2>

              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img
                    src={usuario?.fotoPerfil || "/images/user/avatar.png"}
                    alt="Foto de Perfil"
                    className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-md"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-full">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-md hover:bg-primaryho"
                  >
                    <FaCamera size={16} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
                <TabList className="flex justify-center border-b border-gray-300 flex-wrap gap-4">
                  {tabs.map((tab, idx) => (
                    <Tab
                      key={idx}
                      className={({ selected }) =>
                        classNames(
                          "relative px-4 py-2 text-sm font-medium focus:outline-none transition",
                          selected
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:text-primary"
                        )
                      }
                    >
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>

                <TabPanels className="mt-8">
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
            </>
          )}
        </motion.div>
      </section>
    </CacheInvalidationProvider>
  );
};

export default Profile;
