import ParticipantesViagem from "@/components/Viagens/ParticipantesViagem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participantes da Viagem - Unindo Destinos",
  description: "Veja os participantes da sua viagem no Unindo Destinos.",
};

export default function ParticipantesViagemPage() {
  return (
    <div className="pt-30 min-h-screen px-4">
      <ParticipantesViagem />
    </div>
  );
}
