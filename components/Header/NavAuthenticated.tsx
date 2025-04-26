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
  const { token, userName, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");

  const isValidToken = (token: unknown): token is string => {
    return typeof token === "string" && token.trim() !== "";
  };

  useEffect(() => {
    console.log("TOKEN RECEBIDO NO NAV:", token);
    console.log("USERNAME RECEBIDO NO NAV:", userName);

    if (userName) {
      const nome = userName.split(" ")[0];
      console.log("Peguei o nome do userName:", nome);
      setFirstName(nome);
      return;
    }

    if (isValidToken(token)) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        console.log("TOKEN DECODED:", decoded);

        if (decoded.name) {
          const nome = decoded.name.split(" ")[0];
          console.log("Peguei o nome do token:", nome);
          setFirstName(nome);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, [token, userName]);

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
          src="/images/user/avatar.png"
          alt="Avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white">
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(false)}
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
