"use client";

import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  name?: string;
}

const NavAuthenticated = () => {
  const { token, usuario, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");

  const isValidToken = (token: unknown): token is string => {
    return typeof token === "string" && token.trim() !== "";
  };

  useEffect(() => {
    if (usuario?.nome) {
      const nome = usuario.nome.split(" ")[0];
      setFirstName(nome);
      return;
    }

    if (isValidToken(token)) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);

        if (decoded.name) {
          const nome = decoded.name.split(" ")[0];
          setFirstName(nome);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, [token, usuario]);

  return (
    <div className="relative flex items-center gap-4">
      {firstName && (
        <span className="hidden text-base font-semibold text-black dark:text-white xl:block">
          Olá, {firstName}
        </span>
      )}

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center focus:outline-none"
      >
        <Image
          src={usuario?.fotoPerfil?.startsWith("http") ? usuario.fotoPerfil : "/images/user/avatar.png"}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full object-cover aspect-square ring-2 ring-white"
        />
      </button>

      {menuOpen && (
        <div className="absolute top-1/2 left-full ml-4 transform -translate-y-1/2 w-52 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 dark:bg-black dark:ring-white">
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Perfil
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavAuthenticated;
