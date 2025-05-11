"use client";

import { PerfilProvider } from "../../context/PerfilContext";

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <PerfilProvider>{children}</PerfilProvider>;
}
