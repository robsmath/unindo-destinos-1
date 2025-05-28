"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/services/authService";
import { useAuth } from "@/app/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SigninClient() {
  const router = useRouter();
  const { login, usuario } = useAuth();

  const [data, setData] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    if (usuario) {
      router.push("/profile");
    }
  }, [usuario, router]);

  useEffect(() => {
    const erro = searchParams.get("erro");
    if (erro === "expirado") {
      toast.warning("Sua sessão expirou. Faça login novamente.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token, usuario } = await signIn(data.email, data.senha);

      login(token, {
        id: usuario.id!,
        nome: usuario.nome,
        email: usuario.email,
        fotoPerfil: usuario.fotoPerfil,
      });

      const emailNaoVerificado = usuario.emailVerificado === false;
      const telefoneNaoVerificado = usuario.telefoneVerificado === false;

      if (emailNaoVerificado || telefoneNaoVerificado) {
        let mensagem = "⚠️ Você precisa confirmar ";

        if (emailNaoVerificado && telefoneNaoVerificado) {
          mensagem += "seu e-mail e seu telefone.";
        } else if (emailNaoVerificado) {
          mensagem += "seu e-mail.";
        } else if (telefoneNaoVerificado) {
          mensagem += "seu telefone.";
        }

        toast.info(mensagem);
        router.push("/profile/verificar");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? "E-mail não encontrado. Verifique os dados."
          : err.response?.status === 401
          ? "E-mail ou senha incorretos."
          : "Erro ao fazer login. Verifique suas credenciais."
      );
      setLoading(false);
    }
  };

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-40 pb-16 px-4 relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10">
        <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
          <Image src="/images/shape/shape-dotted-light.svg" alt="Dotted" className="dark:hidden" fill />
          <Image src="/images/shape/shape-dotted-dark.svg" alt="Dotted" className="hidden dark:block" fill />
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
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary"
              />
              <input
                type="password"
                placeholder="Senha"
                value={data.senha}
                onChange={(e) => setData({ ...data, senha: e.target.value })}
                required
                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-primary focus-visible:outline-none dark:border-strokedark dark:focus:border-primary"
              />
            </div>

            {error && (
              <div className="mb-2 text-center text-red-500 font-medium">{error}</div>
            )}

            <p className="text-right text-sm text-primary hover:underline mb-4">
              <Link href="/auth/recuperar-senha">Esqueci minha senha</Link>
            </p>

            <button
              type={"submit" as "submit"}
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
}
