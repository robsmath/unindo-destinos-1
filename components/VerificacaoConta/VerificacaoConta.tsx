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
import { getUsuarioLogado } from "@/services/userService";

const VerificacaoConta = () => {
  const router = useRouter();
  const [codigoEmail, setCodigoEmail] = useState("");
  const [codigoTelefone, setCodigoTelefone] = useState("");

  const [emailCodigoEnviado, setEmailCodigoEnviado] = useState(false);
  const [telefoneCodigoEnviado, setTelefoneCodigoEnviado] = useState(false);

  const [emailVerificado, setEmailVerificado] = useState<boolean | null>(null);
  const [telefoneVerificado, setTelefoneVerificado] = useState<boolean | null>(null);

  const [loadingReenviarEmail, setLoadingReenviarEmail] = useState(false);
  const [loadingConfirmarEmail, setLoadingConfirmarEmail] = useState(false);
  const [loadingReenviarSms, setLoadingReenviarSms] = useState(false);
  const [loadingConfirmarTelefone, setLoadingConfirmarTelefone] = useState(false);

  useEffect(() => {
    const carregarStatus = async () => {
      try {
        const usuario = await getUsuarioLogado();
        const emailOk = !!usuario.emailVerificado;
        const telefoneOk = !!usuario.telefoneVerificado;
  
        setEmailVerificado(emailOk);
        setTelefoneVerificado(telefoneOk);
  
      } catch (err) {
        toast.error("Erro ao carregar dados do usuário.");
      }
    };
  
    carregarStatus();
  }, []);
  
  useEffect(() => {
    if (emailVerificado && telefoneVerificado) {
      router.replace("/profile?tab=dados-pessoais");
      router.refresh();
    }
  }, [emailVerificado, telefoneVerificado]);
  

  const handleReenviarEmail = async () => {
    setLoadingReenviarEmail(true);
    try {
      await reenviarEmail();
      setEmailCodigoEnviado(true);
      toast.success("Código de e-mail enviado!");
    } catch {
      toast.error("Erro ao enviar código de e-mail.");
    } finally {
      setLoadingReenviarEmail(false);
    }
  };

  const handleVerificarEmail = async () => {
    setLoadingConfirmarEmail(true);
    try {
      await verificarEmail(codigoEmail);
      toast.success("E-mail confirmado com sucesso!");
      setEmailVerificado(true);
      setCodigoEmail("");
    } catch {
      toast.error("Erro ao confirmar e-mail.");
    } finally {
      setLoadingConfirmarEmail(false);
    }
  };

  const handleReenviarSms = async () => {
    setLoadingReenviarSms(true);
    try {
      await reenviarSms();
      setTelefoneCodigoEnviado(true);
      toast.success("Código de SMS enviado!");
    } catch {
      toast.error("Erro ao enviar código de SMS.");
    } finally {
      setLoadingReenviarSms(false);
    }
  };

  const handleVerificarTelefone = async () => {
    setLoadingConfirmarTelefone(true);
    try {
      await verificarTelefone(codigoTelefone);
      toast.success("Telefone confirmado com sucesso!");
      setTelefoneVerificado(true);
      setCodigoTelefone("");
    } catch {
      toast.error("Erro ao confirmar telefone.");
    } finally {
      setLoadingConfirmarTelefone(false);
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

        {!emailVerificado && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">
              Confirmação de E-mail
            </h2>
            <button
              onClick={handleReenviarEmail}
              disabled={loadingReenviarEmail}
              className="mb-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {loadingReenviarEmail
                ? "Enviando..."
                : emailCodigoEnviado
                ? "Reenviar Código"
                : "Enviar Código"}
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
              disabled={loadingConfirmarEmail}
              className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              {loadingConfirmarEmail ? "Confirmando..." : "Confirmar E-mail"}
            </button>
          </div>
        )}

        {!telefoneVerificado && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">
              Confirmação de Telefone
            </h2>
            <button
              onClick={handleReenviarSms}
              disabled={loadingReenviarSms}
              className="mb-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {loadingReenviarSms
                ? "Enviando..."
                : telefoneCodigoEnviado
                ? "Reenviar Código"
                : "Enviar Código"}
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
              disabled={loadingConfirmarTelefone}
              className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              {loadingConfirmarTelefone ? "Confirmando..." : "Confirmar Telefone"}
            </button>
          </div>
        )}

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
