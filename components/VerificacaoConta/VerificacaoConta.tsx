"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  reenviarEmail,
  reenviarSms,
  verificarEmail,
  verificarTelefone,
} from "@/services/verificacaoService";
import { toast } from "sonner";

const VerificacaoConta = () => {
  const router = useRouter();
  const [codigoEmail, setCodigoEmail] = useState("");
  const [codigoTelefone, setCodigoTelefone] = useState("");
  const [emailCodigoEnviado, setEmailCodigoEnviado] = useState(false);
  const [telefoneCodigoEnviado, setTelefoneCodigoEnviado] = useState(false);

  const handleVerificarEmail = async () => {
    try {
      await verificarEmail(codigoEmail);
      toast.success("E-mail confirmado com sucesso!");
      router.replace("/profile");
    } catch (error) {
      toast.error("Erro ao confirmar e-mail.");
    }
  };

  const handleVerificarTelefone = async () => {
    try {
      await verificarTelefone(codigoTelefone);
      toast.success("Telefone confirmado com sucesso!");
      router.replace("/profile");
    } catch (error) {
      toast.error("Erro ao confirmar telefone.");
    }
  };

  const handleReenviarEmail = async () => {
    try {
      await reenviarEmail();
      setEmailCodigoEnviado(true);
      toast.success("Código de e-mail enviado!");
    } catch (error) {
      toast.error("Erro ao enviar código de e-mail.");
    }
  };

  const handleReenviarSms = async () => {
    try {
      await reenviarSms();
      setTelefoneCodigoEnviado(true);
      toast.success("Código de SMS enviado!");
    } catch (error) {
      toast.error("Erro ao enviar código de SMS.");
    }
  };

  const handlePular = () => {
    router.push("/profile");
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 bg-[url(/images/common/beach.jpg)] bg-cover">
      <div className="bg-white dark:bg-black p-8 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Verificação de Conta
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Confirmação de E-mail</h2>
          <button
            onClick={handleReenviarEmail}
            className="mb-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {emailCodigoEnviado ? "Reenviar Código" : "Enviar Código"}
          </button>
          <input
            type="text"
            placeholder="Digite o código do e-mail"
            value={codigoEmail}
            onChange={(e) => setCodigoEmail(e.target.value)}
            className="input mb-2"
          />
          <button
            onClick={handleVerificarEmail}
            className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Confirmar E-mail
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Confirmação de Telefone</h2>
          <button
            onClick={handleReenviarSms}
            className="mb-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {telefoneCodigoEnviado ? "Reenviar Código" : "Enviar Código"}
          </button>
          <input
            type="text"
            placeholder="Digite o código do SMS"
            value={codigoTelefone}
            onChange={(e) => setCodigoTelefone(e.target.value)}
            className="input mb-2"
          />
          <button
            onClick={handleVerificarTelefone}
            className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Confirmar Telefone
          </button>
        </div>

        <button
          onClick={handlePular}
          className="mt-4 text-primary hover:underline text-center w-full"
        >
          Pular por enquanto
        </button>
      </div>
    </section>
  );
};

export default VerificacaoConta;
