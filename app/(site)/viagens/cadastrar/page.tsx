import CadastroViagem from "@/components/CadastroViagem/CadastroViagem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastre sua viagem - Unindo Destinos",
  description: "Cadastre sua viagem agora na Unindo Destinos",
};

export default function CadastroViagemPage() {
  return (
    <div className="pt-20 min-h-screen px-4">
      <CadastroViagem />
    </div>
  );
}
