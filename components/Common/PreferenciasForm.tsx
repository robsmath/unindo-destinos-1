import React, { useState } from "react";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";

interface PreferenciasFormProps {
  preferencias: PreferenciasDTO;
  handlePreferenceChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PreferenciasForm: React.FC<PreferenciasFormProps> = ({ preferencias, handlePreferenceChange }) => {
  const [idadeMinimaErro, setIdadeMinimaErro] = useState("");
  const [idadeMaximaErro, setIdadeMaximaErro] = useState("");

  const handleValidatedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value);

    if (name === "idadeMinima") {
      if (numericValue < 18) {
        setIdadeMinimaErro("A idade mínima deve ser no mínimo 18 anos.");
        return;
      } else if (preferencias.idadeMaxima && numericValue > preferencias.idadeMaxima) {
        setIdadeMinimaErro("A idade mínima não pode ser maior que a idade máxima.");
        return;
      } else {
        setIdadeMinimaErro("");
      }
    }

    if (name === "idadeMaxima") {
      if (preferencias.idadeMinima && numericValue < preferencias.idadeMinima) {
        setIdadeMaximaErro("A idade máxima não pode ser menor que a idade mínima.");
        return;
      } else {
        setIdadeMaximaErro("");
      }
    }

    handlePreferenceChange(e);
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

      {/* Faixa Etária personalizada */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm">Idade mínima</label>
          <input
            type="number"
            name="idadeMinima"
            min={18}
            value={preferencias.idadeMinima || ""}
            onChange={handleValidatedChange}
            className="input"
          />
          {idadeMinimaErro && <p className="text-red-500 text-xs mt-1">{idadeMinimaErro}</p>}
        </div>
        <div className="flex-1">
          <label className="text-sm">Idade máxima</label>
          <input
            type="number"
            name="idadeMaxima"
            min={18}
            value={preferencias.idadeMaxima || ""}
            onChange={handleValidatedChange}
            className="input"
          />
          {idadeMaximaErro && <p className="text-red-500 text-xs mt-1">{idadeMaximaErro}</p>}
        </div>
      </div>
      <p className="text-xs text-gray-500 ml-1">Faixa etária dos viajantes que você prefere.</p>

      {/* Valor médio por viagem */}
      <div>
        <label className="text-sm">Valor médio por viagem (R$)</label>
        <input
          type="number"
          name="valorMedioViagem"
          min={0}
          step={50}
          value={preferencias.valorMedioViagem || ""}
          onChange={handleValidatedChange}
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
              /> {item.label}
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
