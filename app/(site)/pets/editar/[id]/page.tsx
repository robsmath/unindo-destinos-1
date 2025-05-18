import { Metadata } from "next";
import EditarPetClient from "./EditarPetClient";

export const metadata: Metadata = {
  title: "Editar pet - Unindo Destinos",
  description: "Atualize as informações do seu pet",
};

export default function Page(props: any) {
  const petId = parseInt(props?.params?.id ?? "0");

  return <EditarPetClient petId={petId} />;
}
