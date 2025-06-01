import { Suspense } from "react";
import Profile from "@/components/Profile/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil - Unindo Destinos",
  description: "Gerencie suas informações pessoais, viagens e preferências",
};

export default function ProfilePage() {
  return (
    <div className="pt-30 min-h-screen px-4">
    <Suspense fallback={<div className="pt-40 text-center">Carregando perfil...</div>}>
      <Profile />
    </Suspense>
    </div>
  );
}
