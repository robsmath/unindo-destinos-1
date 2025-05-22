import EditarPetClient from "./EditarPetClient";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const petId = parseInt(params.id);

  return <EditarPetClient petId={petId} />;
}
