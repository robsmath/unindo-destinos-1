import RecuperarSenhaForm from "@/components/Auth/RecuperarSenhaForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Senha - Unindo Destinos",
  description: "Recupere sua conta de forma segura.",
};

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen px-4">
      <RecuperarSenhaForm />
    </div>
  );
}
