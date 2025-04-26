"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import menuData from "./menuData";
import NavAuthenticated from "./NavAuthenticated";
import NavUnauthenticated from "./NavUnauthenticated";
import { useAuth } from "@/app/context/AuthContext";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const pathUrl = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleStickyMenu = () => {
      if (window.scrollY >= 80) {
        setStickyMenu(true);
      } else {
        setStickyMenu(false);
      }
    };
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all ${
        stickyMenu
          ? "bg-white py-4 shadow-md dark:bg-black"
          : "bg-white py-6 dark:bg-black"
      }`}
    >
      <div className="relative mx-auto flex max-w-c-1390 items-center justify-between px-4 md:px-8 2xl:px-0">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/images/logo/unindo-destinos-logo.png"
              alt="logo"
              width={140}
              height={40}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/unindo-destinos-logo.png"
              alt="logo dark"
              width={140}
              height={40}
              className="hidden dark:block"
            />
          </Link>
        </div>

        {/* Nav Menu */}
        <nav className="hidden xl:flex items-center gap-10">
          {menuData.map((menuItem) =>
            menuItem.path ? (
              <Link
                key={menuItem.id}
                href={menuItem.path}
                className={`text-lg font-semibold tracking-wide transition-colors ${
                  pathUrl === menuItem.path
                    ? "text-primary underline underline-offset-4"
                    : "text-waterloo hover:text-primary hover:underline hover:underline-offset-4"
                }`}
              >
                {menuItem.title}
              </Link>
            ) : null
          )}
        </nav>

        {/* Botões de Login/Logout */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <NavAuthenticated />
          ) : (
            <NavUnauthenticated />
          )}
        </div>

        {/* Botão Mobile */}
        <button
          aria-label="Mobile Menu"
          className="block xl:hidden text-3xl text-black dark:text-white"
          onClick={() => setNavigationOpen(!navigationOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {navigationOpen && (
        <div className="xl:hidden flex flex-col items-center bg-white dark:bg-black py-4 gap-4 shadow-lg">
          {menuData.map((menuItem) =>
            menuItem.path ? (
              <Link
                key={menuItem.id}
                href={menuItem.path}
                className="text-lg font-semibold text-waterloo hover:text-primary"
                onClick={() => setNavigationOpen(false)}
              >
                {menuItem.title}
              </Link>
            ) : null
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
