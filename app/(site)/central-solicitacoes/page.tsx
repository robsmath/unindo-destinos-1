import CentralSolicitacoes from "@/components/Solicitacoes/CentralSolicitacoes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central de Solicitações - Unindo Destinos",
};

export default function CentralSolicitacoesPage() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <CentralSolicitacoes />
      </div>
    </div>
  );
}
