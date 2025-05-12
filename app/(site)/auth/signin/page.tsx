import { Suspense } from "react";
import SigninClient from "@/components/Auth/SigninClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entre na sua conta - Unindo Destinos",
};

export default function SigninPage() {
  return (
    <div className="pt-20 min-h-screen px-4">
      <Suspense fallback={<div>Carregando login...</div>}>
        <SigninClient />
      </Suspense>
    </div>
  );
}
