"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavUnauthenticated = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/auth/signin" && (
        <Link
          href="/auth/signin"
          className="flex items-center justify-center rounded-full border-2 border-primary px-7.5 py-2.5 text-regular font-semibold text-primary hover:bg-primary hover:text-white duration-300 ease-in-out transition"
        >
          Entrar
        </Link>
      )}

      {pathname !== "/auth/signup" && (
        <Link
          href="/auth/signup"
          className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular font-semibold text-white hover:bg-primaryho duration-300 ease-in-out transition"
        >
          Crie sua conta
        </Link>
      )}
    </>
  );
};

export default NavUnauthenticated;
