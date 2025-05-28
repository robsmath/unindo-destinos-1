import EditarPetClient from "./EditarPetClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const petId = parseInt(id);

  return <EditarPetClient petId={petId} />;
}
