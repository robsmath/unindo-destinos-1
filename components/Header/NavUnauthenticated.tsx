import Link from "next/link";

const NavUnauthenticated = () => {
  return (
    <>
      <Link
        href="/auth/signin"
        className="text-regular font-medium text-waterloo hover:text-primary"
      >
        Entrar
      </Link>

      <Link
        href="/auth/signup"
        className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
      >
        Crie sua conta
      </Link>
    </>
  );
};

export default NavUnauthenticated;
