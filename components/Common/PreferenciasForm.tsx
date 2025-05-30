import React, { useState, useEffect } from "react";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { toast } from "sonner";
import { Users, DollarSign, Home, Car, Baby, Heart, Wine } from "lucide-react";

interface PreferenciasFormProps {
  preferencias: PreferenciasDTO;
  handlePreferenceChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PreferenciasForm: React.FC<PreferenciasFormProps> = ({ preferencias, handlePreferenceChange }) => {
  const [idadeMinimaInput, setIdadeMinimaInput] = useState(preferencias.idadeMinima?.toString() || "");
  const [idadeMaximaInput, setIdadeMaximaInput] = useState(preferencias.idadeMaxima?.toString() || "");
  const [valorMedioInput, setValorMedioInput] = useState(
    preferencias.valorMedioViagem !== null && preferencias.valorMedioViagem !== undefined
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preferencias.valorMedioViagem)
      : ""
  );

  // Atualiza inputs caso preferências mudem externamente
  useEffect(() => {
    setIdadeMinimaInput(preferencias.idadeMinima?.toString() || "");
    setIdadeMaximaInput(preferencias.idadeMaxima?.toString() || "");
    setValorMedioInput(
      preferencias.valorMedioViagem !== null && preferencias.valorMedioViagem !== undefined
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preferencias.valorMedioViagem)
        : ""
    );
  }, [preferencias]);

  const handleValidatedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "valorMedioViagem") {
      const raw = value.replace(/\D/g, "");
      const valor = raw ? parseFloat(raw) / 100 : null;
      setValorMedioInput(value);

      handlePreferenceChange({
        target: {
          name: "valorMedioViagem",
          value: valor === null ? "" : valor.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>);
      return;
    }

    handlePreferenceChange(e);
  };

  const atualizarIdade = (campo: "idadeMinima" | "idadeMaxima", valor: number) => {
    handlePreferenceChange({
      target: {
        name: campo,
        value: valor.toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };  return (
    <div className="space-y-8">
      {/* Gender Preference */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <label className="text-lg font-semibold text-gray-800">Gênero Preferido</label>
        </div>
        <div className="relative group">
          <select
            name="generoPreferido"
            value={preferencias.generoPreferido}
            onChange={handleValidatedChange}
            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
          >
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="OUTRO">Outro</option>
            <option value="TODOS">Todos</option>
            <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
          </select>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
        <p className="text-sm text-gray-500">Gênero dos participantes que você prefere na viagem.</p>
      </div>

      {/* Age Range */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-primary" />
          <label className="text-lg font-semibold text-gray-800">Faixa Etária</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Idade mínima</label>
            <div className="relative group">
              <input
                type="text"
                name="idadeMinima"
                inputMode="numeric"
                value={idadeMinimaInput}
                onChange={(e) => setIdadeMinimaInput(e.target.value)}
                onBlur={() => {
                  const min = parseInt(idadeMinimaInput || "0", 10);
                  const max = preferencias.idadeMaxima ?? 0;

                  if (min < 18) {
                    toast.warning("A idade mínima não pode ser menor que 18.");
                    setIdadeMinimaInput("18");
                    atualizarIdade("idadeMinima", 18);
                  } else if (max && min > max) {
                    toast.warning("A idade mínima não pode ser maior que a idade máxima.");
                    setIdadeMinimaInput(max.toString());
                    atualizarIdade("idadeMinima", max);
                  } else {
                    atualizarIdade("idadeMinima", min);
                  }
                }}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                placeholder="18"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Idade máxima</label>
            <div className="relative group">
              <input
                type="text"
                name="idadeMaxima"
                inputMode="numeric"
                value={idadeMaximaInput}
                onChange={(e) => setIdadeMaximaInput(e.target.value)}
                onBlur={() => {
                  const max = parseInt(idadeMaximaInput || "0", 10);
                  const min = preferencias.idadeMinima ?? 0;

                  if (max < 18) {
                    toast.warning("A idade máxima não pode ser menor que 18.");
                    setIdadeMaximaInput("18");
                    atualizarIdade("idadeMaxima", 18);
                  } else if (min && max < min) {
                    toast.warning("A idade máxima não pode ser menor que a idade mínima.");
                    setIdadeMaximaInput(min.toString());
                    atualizarIdade("idadeMaxima", min);
                  } else {
                    atualizarIdade("idadeMaxima", max);
                  }
                }}
                className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                placeholder="60"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">Faixa etária dos viajantes que você prefere.</p>
      </div>

      {/* Budget */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <label className="text-lg font-semibold text-gray-800">Valor Médio por Viagem</label>
        </div>
        <div className="relative group">
          <input
            type="text"
            name="valorMedioViagem"
            inputMode="numeric"
            value={valorMedioInput}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              const valor = raw ? parseFloat(raw) / 100 : "";
              const formatado =
                valor !== ""
                  ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
                  : "";
              setValorMedioInput(formatado);
              handlePreferenceChange({
                target: {
                  name: "valorMedioViagem",
                  value: valor.toString(),
                },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            placeholder="Ex: R$ 1.000,00"
            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
        <p className="text-sm text-gray-500">Quanto você está disposto(a) a gastar por viagem, em média.</p>
      </div>

      {/* Preferences Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <label className="text-lg font-semibold text-gray-800">Preferências Especiais</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "petFriendly", label: "Pet Friendly", desc: "Aceita animais de estimação durante a viagem.", icon: "🐾" },
            { name: "aceitaCriancas", label: "Aceita Crianças", desc: "Aberto a viajantes com crianças.", icon: "👶" },
            { name: "aceitaFumantes", label: "Aceita Fumantes", desc: "Aceita fumantes entre os participantes.", icon: "🚬" },
            { name: "aceitaBebidasAlcoolicas", label: "Aceita Bebidas Alcoólicas", desc: "Aceita consumo de bebidas alcoólicas na viagem.", icon: "🍷" },
            { name: "acomodacaoCompartilhada", label: "Acomodação Compartilhada", desc: "Disponível para dividir hospedagem.", icon: "🏠" },
          ].map((item) => (
            <div key={item.name} className="group">
              <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-white/80 transition-all duration-300 group-hover:shadow-md">
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={(preferencias as any)[item.name]}
                    onChange={handleValidatedChange}
                    className="mt-1 w-5 h-5 text-primary bg-white border-gray-300 rounded-md focus:ring-primary focus:ring-2 transition-colors"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accommodation Type */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          <label className="text-lg font-semibold text-gray-800">Tipo de Acomodação</label>
        </div>
        <div className="relative group">
          <select
            name="tipoAcomodacao"
            value={preferencias.tipoAcomodacao}
            onChange={handleValidatedChange}
            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
          >
            <option value="HOTEL">Hotel</option>
            <option value="HOSTEL">Hostel</option>
            <option value="AIRBNB">Airbnb</option>
            <option value="POUSADA">Pousada</option>
            <option value="CAMPING">Camping</option>
            <option value="RESORT">Resort</option>
            <option value="FAZENDA">Fazenda</option>
            <option value="CASA_DE_AMIGOS">Casa de Amigos</option>
            <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
          </select>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
        <p className="text-sm text-gray-500">Tipo de hospedagem preferido.</p>
      </div>

      {/* Transportation Type */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <label className="text-lg font-semibold text-gray-800">Tipo de Transporte</label>
        </div>
        <div className="relative group">
          <select
            name="tipoTransporte"
            value={preferencias.tipoTransporte}
            onChange={handleValidatedChange}
            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 appearance-none cursor-pointer group-hover:bg-white/80"
          >
            <option value="AVIAO">Avião</option>
            <option value="CARRO">Carro</option>
            <option value="ONIBUS">Ônibus</option>
            <option value="TREM">Trem</option>
            <option value="NAVIO">Navio</option>
            <option value="MOTO">Moto</option>
            <option value="BICICLETA">Bicicleta</option>
            <option value="VAN">Van</option>
            <option value="MOTORHOME">Motorhome</option>
            <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
          </select>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
        <p className="text-sm text-gray-500">Modo de transporte favorito para a viagem.</p>
      </div>
    </div>
  );
};

export default PreferenciasForm;
