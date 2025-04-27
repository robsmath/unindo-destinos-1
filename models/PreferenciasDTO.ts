export interface PreferenciasDTO {
    generoPreferido: "MASCULINO" | "FEMININO" | "NAO_BINARIO" | "OUTRO" | "TODOS" | "NAO_TENHO_PREFERENCIA";
    faixaEtariaPreferida: "INFANTIL" | "ADOLESCENTES" | "JOVENS_ADULTOS" | "ADULTOS" | "MEIA_IDADE" | "MELHOR_IDADE" | "NAO_TENHO_PREFERENCIA";
    petFriendly: boolean;
    aceitaCriancas: boolean;
    aceitaFumantes: boolean;
    aceitaBebidasAlcoolicas: boolean;
    acomodacaoCompartilhada: boolean;
    aceitaAnimaisGrandePorte: boolean;
    estiloViagem: 
      | "AVENTURA"
      | "CULTURA"
      | "FESTA"
      | "RELAXAMENTO"
      | "GASTRONOMIA"
      | "ECOTURISMO"
      | "NEGOCIOS"
      | "ROMANTICA"
      | "RELIGIOSA"
      | "COMPRAS"
      | "PRAIA"
      | "HISTORICA"
      | "TECNOLOGIA"
      | "NAO_TENHO_PREFERENCIA";
    tipoAcomodacao: 
      | "HOTEL"
      | "HOSTEL"
      | "AIRBNB"
      | "POUSADA"
      | "CAMPING"
      | "RESORT"
      | "FAZENDA"
      | "CASA_DE_AMIGOS"
      | "NAO_TENHO_PREFERENCIA";
    tipoTransporte: 
      | "AVIAO"
      | "CARRO"
      | "ONIBUS"
      | "TREM"
      | "NAVIO"
      | "MOTO"
      | "BICICLETA"
      | "VAN"
      | "MOTORHOME"
      | "NAO_TENHO_PREFERENCIA";
  }
  