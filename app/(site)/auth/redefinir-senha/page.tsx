import { Metadata } from "next";
import RedefinirSenhaFormClient from "@/components/Auth/RedefinirSenhaForm";

export const metadata: Metadata = {
  title: "Redefinir Senha - Unindo Destinos",
  description: "Crie uma nova senha com segurança.",
};

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen px-4">
      <RedefinirSenhaFormClient />
    </div>
  );
}
