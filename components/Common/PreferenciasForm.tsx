import React, { useState, useEffect } from "react";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";
import { toast } from "sonner";

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
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Gênero */}
      <div>
        <select
          name="generoPreferido"
          value={preferencias.generoPreferido}
          onChange={handleValidatedChange}
          className="input"
        >
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
          <option value="OUTRO">Outro</option>
          <option value="TODOS">Todos</option>
          <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
        </select>
        <p className="text-xs text-gray-500 ml-1">Gênero dos participantes que você prefere na viagem.</p>
      </div>

      {/* Faixa Etária */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm">Idade mínima</label>
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
            className="input"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm">Idade máxima</label>
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
            className="input"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 ml-1">Faixa etária dos viajantes que você prefere.</p>

      {/* Valor médio por viagem */}
      <div>
        <label className="text-sm">Valor médio por viagem (R$)</label>
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
          placeholder="Ex: R$ 1000"
          className="input"
        />
        <p className="text-xs text-gray-500 ml-1">Quanto você está disposto(a) a gastar por viagem, em média.</p>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-2">
        {[
          { name: "petFriendly", label: "Pet Friendly", desc: "Aceita animais de estimação durante a viagem." },
          { name: "aceitaCriancas", label: "Aceita Crianças", desc: "Aberto a viajantes com crianças." },
          { name: "aceitaFumantes", label: "Aceita Fumantes", desc: "Aceita fumantes entre os participantes." },
          { name: "aceitaBebidasAlcoolicas", label: "Aceita Bebidas Alcoólicas", desc: "Aceita consumo de bebidas alcoólicas na viagem." },
          { name: "acomodacaoCompartilhada", label: "Acomodação Compartilhada", desc: "Disponível para dividir hospedagem." },
          { name: "aceitaAnimaisGrandePorte", label: "Aceita Animais de Grande Porte", desc: "Aceita cães ou animais de grande porte." },
        ].map((item) => (
          <div key={item.name}>
            <label>
              <input
                type="checkbox"
                name={item.name}
                checked={(preferencias as any)[item.name]}
                onChange={handleValidatedChange}
              />{" "}
              {item.label}
            </label>
            <p className="text-xs text-gray-500 ml-7">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Tipo de Acomodação */}
      <div>
        <select
          name="tipoAcomodacao"
          value={preferencias.tipoAcomodacao}
          onChange={handleValidatedChange}
          className="input"
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
        <p className="text-xs text-gray-500 ml-1">Tipo de hospedagem preferido.</p>
      </div>

      {/* Tipo de Transporte */}
      <div>
        <select
          name="tipoTransporte"
          value={preferencias.tipoTransporte}
          onChange={handleValidatedChange}
          className="input"
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
        <p className="text-xs text-gray-500 ml-1">Modo de transporte favorito para a viagem.</p>
      </div>
    </div>
  );
};

export default PreferenciasForm;
