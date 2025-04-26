import Profile from "@/components/Profile/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crie sua Conta - Unindo Destinos",
  description: "Crie sua conta agora na Unindo Destinos",
};

export default function ProfilePage() {
  return (
    <div className="pt-40 min-h-screen px-4">
      <Profile />
    </div>
  );
}
