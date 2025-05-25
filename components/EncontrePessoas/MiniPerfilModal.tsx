"use client";

import { Fragment } from "react";
import { UsuarioBuscaDTO } from "@/models/UsuarioBuscaDTO";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
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
    !usuario.acomodacaoCompartilhada &&
    !usuario.aceitaAnimaisGrandePorte;

  const semDescricao = !usuario.descricao || usuario.descricao.trim() === "";

  const deveExibirAviso = semPreferencias && semDescricao;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  aria-label="Fechar"
                >
                  <FaTimes size={16} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <img
                    src={usuario.fotoPerfil || "/images/user/avatar.png"}
                    alt="Foto"
                    className="w-24 h-24 rounded-full mb-4 object-cover border"
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

                  <div className="mt-4 text-left w-full text-sm space-y-1">
                    {usuario.tipoAcomodacao && <p>🏨 {formatarTexto(usuario.tipoAcomodacao)}</p>}
                    {usuario.tipoTransporte && <p>🚗 {formatarTexto(usuario.tipoTransporte)}</p>}
                    {usuario.petFriendly && <p>🐶 Pet Friendly</p>}
                    {usuario.aceitaCriancas && <p>👶 Aceita Crianças</p>}
                    {usuario.aceitaFumantes && <p>🚬 Aceita Fumantes</p>}
                    {usuario.aceitaBebidasAlcoolicas && <p>🍷 Aceita Bebidas</p>}
                    {usuario.acomodacaoCompartilhada && <p>🛏️ Acomodação Compartilhada</p>}
                    {usuario.aceitaAnimaisGrandePorte && <p>🐘 Animais Grandes</p>}
                  </div>

                  {deveExibirAviso && (
                    <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs">
                      ⚠️ Este usuário ainda não preencheu suas preferências nem adicionou uma descrição.
                    </div>
                  )}

                  {onConvidar && (
                    <Button
                      className="mt-6 w-full"
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
