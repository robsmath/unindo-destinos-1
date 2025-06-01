import FAQ from "@/components/FAQ/FAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Perguntas Frequentes | Unindo Destinos",
  description: "Encontre respostas para as principais dúvidas sobre como usar o Unindo Destinos para encontrar companheiros de viagem e criar experiências inesquecíveis.",
  keywords: "FAQ, perguntas frequentes, ajuda, suporte, como usar, Unindo Destinos",
};

export default function FAQPage() {
  return (
    <div className="pt-40 min-h-screen">
      <FAQ />
    </div>
  );
}
