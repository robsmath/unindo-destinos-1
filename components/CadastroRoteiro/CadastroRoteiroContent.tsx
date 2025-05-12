"use client";

import { useSearchParams } from "next/navigation";
import CadastroRoteiro from "./CadastroRoteiro";

const CadastroRoteiroContent = () => {
  const searchParams = useSearchParams();
  const viagemId = searchParams.get("viagemId");

  if (!viagemId) {
    return <div className="text-center text-red-600">Viagem não encontrada.</div>;
  }

  return <CadastroRoteiro viagemId={viagemId} />;
};

export default CadastroRoteiroContent;
