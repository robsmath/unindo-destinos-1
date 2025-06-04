"use client";

import CadastroPet from "@/components/Pets/CadastroPet";

interface Props {
  petId: number;
}

export default function EditarPetClient({ petId }: Props) {
  return (
    <div className="pt-15 min-h-screen px-4">
      <CadastroPet petId={petId} />
    </div>
  );
}
