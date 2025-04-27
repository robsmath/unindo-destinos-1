"use client";

import CadastroViagem from "@/components/CadastroViagem/CadastroViagem";
import { useParams } from "next/navigation";

export default function EditarViagemPage() {
  const { id } = useParams();

  return (
    <div className="pt-20 min-h-screen px-4">
      <CadastroViagem viagemId={id as string} />
    </div>
  );
}
