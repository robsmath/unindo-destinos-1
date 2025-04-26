import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entre na sua conta - Unindo Destinos",
};

export default function SigninPage() {
  return (
    <div className="pt-20 min-h-screen px-4">
      <Signin />
    </div>
  );
}
