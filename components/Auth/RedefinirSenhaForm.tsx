"use client";

import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { redefinirSenha } from "@/services/authService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function FormWithSearchParams() {
  const searchParams = require("next/navigation").useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setSalvando(true);
    try {
      await redefinirSenha(token!, novaSenha);
      toast.success("Senha redefinida com sucesso!");
      router.push("/auth/signin");
    } catch (error) {
      toast.error("Erro ao redefinir a senha. Link inválido ou expirado.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="z-10 max-w-md w-full bg-white rounded-lg p-8 shadow-md dark:bg-black dark:border dark:border-strokedark"
    >
      <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-6">Redefinir Senha</h1>

      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        required
        className="w-full border border-stroke bg-transparent p-2 rounded mb-4 focus:border-primary focus:outline-none dark:border-strokedark dark:text-white"
      />

      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        required
        className="w-full border border-stroke bg-transparent p-2 rounded mb-4 focus:border-primary focus:outline-none dark:border-strokedark dark:text-white"
      />

      <button
        type={"submit" as "submit"}
        disabled={salvando}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {salvando ? "Salvando..." : "Redefinir Senha"}
      </button>
    </form>
  );
}

export default function RedefinirSenhaForm() {
  const [salvando, setSalvando] = useState(false);

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen flex items-center justify-center px-4 relative">
      {salvando && (
        <div className="absolute inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      <Suspense fallback={
        <div className="z-10 max-w-md w-full bg-white rounded-lg p-8 shadow-md text-center dark:bg-black dark:border dark:border-strokedark">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      }>
        <FormWithSearchParams />
      </Suspense>
    </section>
  );
}
