import CadastroPet from "@/components/Pets/CadastroPet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar pet - Unindo Destinos",
  description: "Atualize as informações do seu pet",
};

export default function EditarPetPage({ params }: { params: { id: string } }) {
  const petId = parseInt(params.id);

  return (
    <div className="pt-35 min-h-screen px-4">
      <CadastroPet petId={petId} />
    </div>
  );
}
