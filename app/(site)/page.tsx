import { Metadata } from "next";
import Home from "@/components/Home/Home";

export const metadata: Metadata = {
  title: "Unindo Destinos - Conectando Viajantes",
  description: "Encontre novos amigos e destinos incríveis para viajar.",
};

export default function HomePage() {
  return (
    <div className="pt-40 min-h-screen px-4">
      <Home />
    </div>
  );
}
