import { Metadata } from "next";
import { Suspense } from "react";
import RecuperarSenhaForm from "@/components/Auth/RecuperarSenhaForm";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Recuperar Senha - Unindo Destinos",
  description: "Recupere sua conta de forma segura.",
};

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen px-4">
      <Suspense fallback={
        <div className="pt-40 flex justify-center items-center min-h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }>
        <RecuperarSenhaForm />
      </Suspense>
    </div>
  );
}
