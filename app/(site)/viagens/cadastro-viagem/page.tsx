import CadastroViagem from "@/components/CadastroViagem/CadastroViagem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastre sua viagem - Unindo Destinos",
  description: "Cadastre sua viagem agora na Unindo Destinos",
};

export default function ProfilePage() {
  return (
    <>
      <CadastroViagem />
    </>
  );
}
