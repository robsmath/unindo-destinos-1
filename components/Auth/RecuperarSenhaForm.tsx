"use client";

import { useState } from "react";
import { enviarEmailRecuperacao } from "@/services/authService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RecuperarSenhaForm() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await enviarEmailRecuperacao(email);
      toast.success("Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.");
    } catch {
      toast.error("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen flex items-center justify-center px-4 relative">
      {enviando && (
        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 z-50 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="z-10 max-w-md w-full bg-white rounded-lg p-8 shadow-md dark:bg-black dark:border dark:border-strokedark"
      >
        <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-6">Recuperar Senha</h1>

        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-stroke bg-transparent p-2 rounded mb-4 focus:border-primary focus:outline-none dark:border-strokedark dark:text-white"
        />

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </section>
  );
}
