import EncontrePessoas from "@/components/EncontrePessoas/EncontrePessoas";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encontre Pessoas - Unindo Destinos",
  description: "Encontre companheiros de viagem com base nas suas preferências",
};

export default function EncontrePessoasPage() {
  return (
    <div className="pt-40 min-h-screen px-4">
      <EncontrePessoas />
    </div>
  );
}
