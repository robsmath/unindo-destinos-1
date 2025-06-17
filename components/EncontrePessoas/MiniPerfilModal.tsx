"use client";

import { Fragment, useState, useEffect } from "react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { PetDTO } from "@/models/PetDTO";
import { Dialog, DialogPanel, Transition, TransitionChild, TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { FaCheckCircle, FaTimes, FaExclamationTriangle, FaPaw, FaMars, FaVenus } from "react-icons/fa";
import { Hotel, Car, Heart, Baby, Cigarette, Wine, Bed, Star, ImageIcon, Dog, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DenunciaEBloqueioButtons from "@/components/Common/DenunciaEBloqueioButtons";
import ListaAvaliacoes from "@/components/Avaliacoes/ListaAvaliacoes";
import AlbumDeFotos from "@/components/Profile/AlbumDeFotos";
import PetDetalhesModal from "@/components/Modals/PetDetalhesModal";
import { getPetsByUsuarioId } from "@/services/petService";

interface Props {
  usuario: UsuarioBuscaDTO;
  isOpen: boolean;
  onClose: () => void;
  onConvidar?: (usuarioId: number) => void;
  onDenunciar: (usuario: { id: number; nome: string }) => void;
  onBloquear: (usuario: { id: number; nome: string }) => void;
}

const formatarTexto = (valor?: string | null) => {
  if (!valor || valor === "NAO_TENHO_PREFERENCIA") return "Não tenho preferência";
  return valor
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) =>
      c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    );
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function MiniPerfilModal({ 
  usuario, 
  isOpen, 
  onClose, 
  onConvidar,
  onDenunciar,
  onBloquear
}: Props) {
  const [pets, setPets] = useState<PetDTO[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetDTO | null>(null);
  const [petModalOpen, setPetModalOpen] = useState(false);

  const semPreferencias =
    !usuario.tipoAcomodacao &&
    !usuario.tipoTransporte &&
    !usuario.petFriendly &&
    !usuario.aceitaCriancas &&
    !usuario.aceitaFumantes &&
    !usuario.aceitaBebidasAlcoolicas &&
    !usuario.acomodacaoCompartilhada;

  const semDescricao = !usuario.descricao || usuario.descricao.trim() === "";

  const deveExibirAviso = semPreferencias && semDescricao;

  useEffect(() => {
    if (isOpen) {
      carregarPetsDoUsuario();
    }
  }, [isOpen, usuario.id]);

  const carregarPetsDoUsuario = async () => {
    setLoadingPets(true);
    try {
      const petsDoUsuario = await getPetsByUsuarioId(usuario.id);
      setPets(petsDoUsuario);
    } catch (error) {
      console.error("Erro ao carregar pets do usuário:", error);
      setPets([]);
    } finally {
      setLoadingPets(false);
    }
  };

  const handleAbrirPetModal = (pet: PetDTO) => {
    setSelectedPet(pet);
    setPetModalOpen(true);
  };

  const handleFecharPetModal = () => {
    setPetModalOpen(false);
    setSelectedPet(null);
  };

  const obterPorteFormatado = (porte?: string) => {
    if (!porte) return "Porte não informado";
    
    switch (porte.toLowerCase()) {
      case 'pequeno':
      case 'small':
        return 'Pequeno';
      case 'medio':
      case 'médio':
      case 'medium':
        return 'Médio';
      case 'grande':
      case 'large':
        return 'Grande';
      default:
        return porte;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 z-10"
                  aria-label="Fechar"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center p-8 border-b border-gray-100">
                  <img
                    src={usuario.fotoPerfil || "/images/user/avatar.png"}
                    alt="Foto"
                    className="w-24 h-24 rounded-full mb-4 object-cover border shadow-md"
                  />
                  <h2 className="text-xl font-bold">
                    {usuario.nome}{" "}
                    {usuario.emailVerificado && usuario.telefoneVerificado && (
                      <FaCheckCircle className="inline text-green-600 ml-1" />
                    )}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {usuario.genero} • {usuario.idade} anos
                  </p>

                  {usuario.descricao && (
                    <p className="mt-4 text-gray-800 text-sm italic">"{usuario.descricao}"</p>
                  )}
                </div>

                <TabGroup>
                  <TabList className="flex justify-center border-b border-gray-200 bg-gray-50/50">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "px-6 py-3 text-sm font-medium focus:outline-none",
                          selected
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-600 hover:text-gray-800"
                        )
                      }
                    >
                      Preferências
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "px-6 py-3 text-sm font-medium focus:outline-none flex items-center gap-2",
                          selected
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-600 hover:text-gray-800"
                        )
                      }
                    >
                      <ImageIcon className="w-4 h-4" />
                      Álbum
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "px-6 py-3 text-sm font-medium focus:outline-none flex items-center gap-2",
                          selected
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-600 hover:text-gray-800"
                        )
                      }
                    >
                      <FaPaw className="w-4 h-4" />
                      Pets
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "px-6 py-3 text-sm font-medium focus:outline-none flex items-center gap-2",
                          selected
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-600 hover:text-gray-800"
                        )
                      }
                    >
                      <Star className="w-4 h-4" />
                      Avaliações
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel className="p-6">
                      <div className="text-left w-full text-sm space-y-2">
                        {usuario.tipoAcomodacao && (
                          <p className="flex items-center gap-2">
                            <Hotel className="w-4 h-4 text-gray-600" />
                            <span>{formatarTexto(usuario.tipoAcomodacao)}</span>
                          </p>
                        )}
                        {usuario.tipoTransporte && (
                          <p className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-600" />
                            <span>{formatarTexto(usuario.tipoTransporte)}</span>
                          </p>
                        )}
                        {usuario.petFriendly && (
                          <p className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>Pet Friendly</span>
                          </p>
                        )}
                        {usuario.aceitaCriancas && (
                          <p className="flex items-center gap-2">
                            <Baby className="w-4 h-4 text-blue-500" />
                            <span>Aceita Crianças</span>
                          </p>
                        )}
                        {usuario.aceitaFumantes && (
                          <p className="flex items-center gap-2">
                            <Cigarette className="w-4 h-4 text-gray-500" />
                            <span>Aceita Fumantes</span>
                          </p>
                        )}
                        {usuario.aceitaBebidasAlcoolicas && (
                          <p className="flex items-center gap-2">
                            <Wine className="w-4 h-4 text-purple-500" />
                            <span>Aceita Bebidas</span>
                          </p>
                        )}
                        {usuario.acomodacaoCompartilhada && (
                          <p className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-orange-500" />
                            <span>Acomodação Compartilhada</span>
                          </p>
                        )}

                        {deveExibirAviso && (
                          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                            <div className="flex items-start gap-3">
                              <FaExclamationTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-amber-800 mb-1">Informações Incompletas</h4>
                                <p className="text-xs text-amber-700">
                                  Este usuário ainda não preencheu suas preferências nem adicionou uma descrição.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabPanel>

                    <TabPanel className="p-6">
                      <AlbumDeFotos isOwner={false} usuarioId={usuario.id} />
                    </TabPanel>

                    <TabPanel className="p-6">
                      {loadingPets ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                          <p className="text-gray-600">Carregando pets...</p>
                        </div>
                      ) : pets.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaPaw className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600">Este usuário não possui pets cadastrados.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {pets.map((pet) => (
                            <div
                              key={pet.id}
                              onClick={() => handleAbrirPetModal(pet)}
                              className="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                            >
                              <div className="flex flex-col items-center text-center">
                                {pet.foto ? (
                                  <div className="w-16 h-16 mb-3">
                                    <div className="bg-gradient-to-r from-primary to-orange-500 rounded-full p-0.5 w-full h-full">
                                      <div className="bg-white rounded-full p-0.5 w-full h-full">
                                        <img
                                          src={pet.foto}
                                          alt={pet.nome}
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 mb-3">
                                    <div className="bg-gradient-to-r from-primary to-orange-500 rounded-full p-0.5 w-full h-full">
                                      <div className="bg-white rounded-full p-0.5 w-full h-full">
                                        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full flex items-center justify-center">
                                          <FaPaw className="w-6 h-6 text-primary" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <h4 className="font-semibold text-gray-800 mb-1">{pet.nome}</h4>
                                
                                <div className="space-y-1 text-xs text-gray-600">
                                  {pet.raca && (
                                    <div className="flex items-center justify-center gap-1">
                                      <Dog className="w-3 h-3" />
                                      <span>{pet.raca}</span>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="flex items-center gap-1">
                                      {pet.sexo === 'MACHO' ? (
                                        <FaMars className="w-3 h-3 text-blue-500" />
                                      ) : (
                                        <FaVenus className="w-3 h-3 text-pink-500" />
                                      )}
                                      <span>{pet.sexo === 'MACHO' ? 'Macho' : 'Fêmea'}</span>
                                    </div>
                                    
                                    {pet.porte && (
                                      <div className="flex items-center gap-1">
                                        <Heart className="w-3 h-3 text-red-500" />
                                        <span>{obterPorteFormatado(pet.porte)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabPanel>

                    <TabPanel className="p-0">
                      <div className="max-h-96 overflow-y-auto">
                        <ListaAvaliacoes usuarioId={usuario.id} />
                      </div>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>

                <div className="p-6 border-t border-gray-100 space-y-3">
                  {onConvidar && (
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-orange-500 text-white hover:scale-105 transition-all duration-200"
                      onClick={() => {
                        onClose();
                        setTimeout(() => onConvidar(usuario.id), 150);
                      }}
                    >
                      Convidar para Viagem
                    </Button>
                  )}

                  <div className="flex justify-center">
                    <DenunciaEBloqueioButtons
                      usuario={usuario}
                      onDenunciar={onDenunciar}
                      onBloquear={onBloquear}
                      size="md"
                      layout="horizontal"
                    />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>

      <PetDetalhesModal
        pet={selectedPet}
        isOpen={petModalOpen}
        onClose={handleFecharPetModal}
        isOwner={false}
      />
    </Transition>
  );
}