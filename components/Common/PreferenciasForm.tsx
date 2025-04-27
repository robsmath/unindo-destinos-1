import React from "react";
import { PreferenciasDTO } from "@/models/PreferenciasDTO";

interface PreferenciasFormProps {
  preferencias: PreferenciasDTO;
  handlePreferenceChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PreferenciasForm: React.FC<PreferenciasFormProps> = ({ preferencias, handlePreferenceChange }) => {
  return (
    <div className="mt-4 space-y-4">

      {/* Gênero */}
      <div>
        <select
          name="generoPreferido"
          value={preferencias.generoPreferido}
          onChange={handlePreferenceChange}
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
      <div>
        <select
          name="faixaEtariaPreferida"
          value={preferencias.faixaEtariaPreferida}
          onChange={handlePreferenceChange}
          className="input"
        >
          <option value="INFANTIL">Infantil</option>
          <option value="ADOLESCENTES">Adolescentes</option>
          <option value="JOVENS_ADULTOS">Jovens Adultos</option>
          <option value="ADULTOS">Adultos</option>
          <option value="MEIA_IDADE">Meia Idade</option>
          <option value="MELHOR_IDADE">Melhor Idade</option>
          <option value="NAO_TENHO_PREFERENCIA">Não tenho preferência</option>
        </select>
        <p className="text-xs text-gray-500 ml-1">Faixa etária dos viajantes que você prefere.</p>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-2">
        <label><input type="checkbox" name="petFriendly" checked={preferencias.petFriendly} onChange={handlePreferenceChange}/> Pet Friendly</label>
        <p className="text-xs text-gray-500 ml-7">Aceita animais de estimação durante a viagem.</p>

        <label><input type="checkbox" name="aceitaCriancas" checked={preferencias.aceitaCriancas} onChange={handlePreferenceChange}/> Aceita Crianças</label>
        <p className="text-xs text-gray-500 ml-7">Aberto a viajantes com crianças.</p>

        <label><input type="checkbox" name="aceitaFumantes" checked={preferencias.aceitaFumantes} onChange={handlePreferenceChange}/> Aceita Fumantes</label>
        <p className="text-xs text-gray-500 ml-7">Aceita fumantes entre os participantes.</p>

        <label><input type="checkbox" name="aceitaBebidasAlcoolicas" checked={preferencias.aceitaBebidasAlcoolicas} onChange={handlePreferenceChange}/> Aceita Bebidas Alcoólicas</label>
        <p className="text-xs text-gray-500 ml-7">Aceita consumo de bebidas alcoólicas na viagem.</p>

        <label><input type="checkbox" name="acomodacaoCompartilhada" checked={preferencias.acomodacaoCompartilhada} onChange={handlePreferenceChange}/> Acomodação Compartilhada</label>
        <p className="text-xs text-gray-500 ml-7">Disponível para dividir hospedagem.</p>

        <label><input type="checkbox" name="aceitaAnimaisGrandePorte" checked={preferencias.aceitaAnimaisGrandePorte} onChange={handlePreferenceChange}/> Aceita Animais de Grande Porte</label>
        <p className="text-xs text-gray-500 ml-7">Aceita cães ou animais de grande porte.</p>
      </div>

      {/* Tipo de Acomodação */}
      <div>
        <select
          name="tipoAcomodacao"
          value={preferencias.tipoAcomodacao}
          onChange={handlePreferenceChange}
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
          onChange={handlePreferenceChange}
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
