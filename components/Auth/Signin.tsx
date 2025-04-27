"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/services/authService";
import { useAuth } from "@/app/context/AuthContext";
import { Loader2 } from "lucide-react"; // Adicionado para o spinner

const Signin = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [data, setData] = useState({
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/profile");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token, usuario } = await signIn(data.email, data.senha);
      const name = usuario.nome;
      const id = usuario.id;

      login(token, { id, nome: name });
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
      setLoading(false);
    }
  };

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-40 pb-16 px-4 relative">
      {/* Overlay de loading enquanto loading == true */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10">
        <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
          <Image
            src="/images/shape/shape-dotted-light.svg"
            alt="Dotted"
            className="dark:hidden"
            fill
          />
          <Image
            src="/images/shape/shape-dotted-dark.svg"
            alt="Dotted"
            className="hidden dark:block"
            fill
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
        >
          <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white">
            Entre na sua conta
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-8 flex flex-col gap-6">
              <input
                type="email"
                placeholder="E-mail"
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary"
                required
              />

              <input
                type="password"
                placeholder="Senha"
                name="senha"
                value={data.senha}
                onChange={(e) => setData({ ...data, senha: e.target.value })}
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary"
                required
              />
            </div>

            {error && (
              <div className="mb-4 text-center text-red-500">{error}</div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3 font-medium text-white hover:bg-primaryho transition duration-300"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="mt-8 text-center border-t pt-5 dark:border-strokedark">
              <p className="text-sm">
                Não tem uma conta?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Signin;
