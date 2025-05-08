"use client";
import { useEffect, useState } from "react";

const frases = [
  "🛫 Gerando seu roteiro de viagem...",
  "🗺️ Isso pode levar alguns segundos...",
  "⏳ Aguarde mais um pouquinho...",
  "📍 Está quase pronto!",
];

const LoadingOverlay = () => {
  const [fraseAtual, setFraseAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFraseAtual((prev) => (prev + 1) % frases.length);
    }, 2500);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center text-center px-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-600 border-opacity-50 mb-4"></div>
      <p className="text-xl font-semibold text-purple-700 transition-opacity duration-500">
        {frases[fraseAtual]}
      </p>
    </div>
  );
};

export default LoadingOverlay;
