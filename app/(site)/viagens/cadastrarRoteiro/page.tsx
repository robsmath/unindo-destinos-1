import { Suspense } from "react";
import CadastroRoteiroContent from "@/components/CadastroRoteiro/CadastroRoteiroContent";

export default function Page() {
  return (
    <div className="pt-20 min-h-screen px-4">
      <Suspense fallback={<p className="text-center">Carregando...</p>}>
        <CadastroRoteiroContent />
      </Suspense>
    </div>
  );
}
