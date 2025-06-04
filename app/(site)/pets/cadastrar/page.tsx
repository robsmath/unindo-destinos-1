import CadastroPet from "@/components/Pets/CadastroPet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastre seu pet - Unindo Destinos",
  description: "Cadastre seu pet agora e encontre viagens ideais com ele!",
};

export default function CadastroPetPage() {
  return (
    <div className="pt-15 min-h-screen px-4">
      <CadastroPet />
    </div>
  );
}
