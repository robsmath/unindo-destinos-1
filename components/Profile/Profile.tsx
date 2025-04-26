"use client";

import { useState, useRef } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { FaCamera } from "react-icons/fa";
import PersonalDataForm from "@/components/Profile/PersonalDataForm";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Profile = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = ["Dados Pessoais", "Minhas Viagens", "Minhas Preferências", "Meus Pets"];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-32 pb-16 px-4">
      <div className="relative z-1 mx-auto max-w-5xl px-6 py-8 bg-white rounded-lg shadow-lg dark:bg-black dark:border dark:border-strokedark">
        <h2 className="mb-6 text-center text-3xl font-semibold text-black dark:text-white">
          Seu Perfil
        </h2>

        {/* Área de foto de perfil */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={profileImage || "/images/user/avatar.png"}
              alt="Foto de Perfil"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-md"
            />
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

        {/* Tabs */}
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex justify-center border-b border-gray-300 dark:border-strokedark">
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
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-8">
            <TabPanel>
              {/* Componente de Dados Pessoais */}
              <PersonalDataForm />
            </TabPanel>

            <TabPanel>
              {/* Componente de Minhas Viagens */}
              <div className="text-center text-black dark:text-white">
                <p className="mb-2 font-semibold">[Lista de Minhas Viagens]</p>
              </div>
            </TabPanel>

            <TabPanel>
              {/* Componente de Minhas Preferências */}
              <div className="text-center text-black dark:text-white">
                <p className="mb-2 font-semibold">[Preferências de Viagem]</p>
              </div>
            </TabPanel>

            <TabPanel>
              {/* Componente de Meus Pets */}
              <div className="text-center text-black dark:text-white">
                <p className="mb-2 font-semibold">[Lista de Pets]</p>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </section>
  );
};

export default Profile;
