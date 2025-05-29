"use client";

import { Fragment } from "react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { Hotel, Car, Heart, Baby, Cigarette, Wine, Bed } from "lucide-react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface Props {
  usuario: UsuarioBuscaDTO;
  isOpen: boolean;
  onClose: () => void;
  onConvidar?: (usuarioId: number) => void;
}

const formatarTexto = (valor?: string | null) => {
  if (!valor || valor === "NAO_TENHO_PREFERENCIA") return "Não tenho preferência";
  return valor
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) =>
      c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    );
};

export default function MiniPerfilModal({ usuario, isOpen, onClose, onConvidar }: Props) {
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
              <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl transition-all">
                {/* Botão de Fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  aria-label="Fechar"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center p-8">
                  {/* Foto do Usuário */}
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

                  {/* Descrição */}
                  {usuario.descricao && (
                    <p className="mt-4 text-gray-800 text-sm italic">"{usuario.descricao}"</p>
                  )}

                  {/* Preferências */}
                  <div className="mt-6 text-left w-full text-sm space-y-2">
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
                  </div>

                  {/* Aviso */}
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

                  {/* Botão de Convidar */}
                  {onConvidar && (
                    <Button
                      className="mt-6 w-full bg-gradient-to-r from-primary to-orange-500 text-white hover:scale-105 transition-all duration-200"
                      onClick={() => {
                        onClose();
                        setTimeout(() => onConvidar(usuario.id), 150);
                      }}
                    >
                      Convidar para Viagem
                    </Button>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}