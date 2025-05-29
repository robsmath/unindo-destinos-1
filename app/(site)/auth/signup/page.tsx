import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crie sua Conta - Unindo Destinos",
  description: "Crie sua conta agora na Unindo Destinos",
};

export default function Register() {
  return (
    <div className="pt-35 min-h-screen px-4">
      <Signup />
    </div>
  );
}
