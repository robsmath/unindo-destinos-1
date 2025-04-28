"use client";

import { useSearchParams } from "next/navigation";
import VerificacaoConta from "@/components/VerificacaoConta/VerificacaoConta";

const Page = () => {
  const searchParams = useSearchParams();

  const usuarioId = Number(searchParams.get("usuarioId"));
  const emailVerificado = searchParams.get("emailVerificado") === "true";
  const telefoneVerificado = searchParams.get("telefoneVerificado") === "true";

  if (!usuarioId) {
    return <div>Usuário não encontrado.</div>;
  }

  return (
    <div className="pt-20 min-h-screen px-4">
      <VerificacaoConta
        usuarioId={usuarioId}
        emailVerificado={emailVerificado}
        telefoneVerificado={telefoneVerificado}
      />
    </div>
  );
};

export default Page;
