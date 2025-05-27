import EncontreViagens from "@/components/Viagens/EncontreViagens";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encontre Viagens - Unindo Destinos",
  description: "Encontre viagens incríveis filtrando por destino, data, valor e muito mais.",
};

export default function EncontreViagensPage() {
  return (
    <div className="pt-30 min-h-screen px-4">
      <EncontreViagens />
    </div>
  );
}
