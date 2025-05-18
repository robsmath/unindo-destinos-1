import RedefinirSenhaForm from "@/components/Auth/RedefinirSenhaForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redefinir Senha - Unindo Destinos",
  description: "Crie uma nova senha com segurança.",
};

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen px-4">
      <RedefinirSenhaForm />
    </div>
  );
}
