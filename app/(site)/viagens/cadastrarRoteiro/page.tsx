import { Suspense } from "react";
import CadastroRoteiroContent from "@/components/CadastroRoteiro/CadastroRoteiroContent";

// Desabilita cache para esta página específica
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function Page() {
  return (
    <div className="pt-20 min-h-screen px-4">
      <Suspense fallback={<p className="text-center">Carregando...</p>}>
        <CadastroRoteiroContent />
      </Suspense>
    </div>
  );
}
