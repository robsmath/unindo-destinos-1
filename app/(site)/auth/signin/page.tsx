import { Suspense } from "react";
import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entre na sua conta - Unindo Destinos",
};

export default function SigninPage() {
  return (
    <div className="pt-30 min-h-screen px-4">
      <Suspense fallback={<div>Carregando login...</div>}>
        <Signin />
      </Suspense>
    </div>
  );
}
