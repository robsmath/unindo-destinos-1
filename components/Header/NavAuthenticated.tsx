"use client";

import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NavAuthenticated = () => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
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
