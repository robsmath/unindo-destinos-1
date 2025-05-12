import { Suspense } from "react";
import Profile from "@/components/Profile/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crie sua Conta - Unindo Destinos",
  description: "Crie sua conta agora na Unindo Destinos",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center">Carregando perfil...</div>}>
      <Profile />
    </Suspense>
  );
}
