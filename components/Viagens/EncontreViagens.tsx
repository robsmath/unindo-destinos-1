"use client";

import { useState } from "react";
import { ViagemFiltroDTO } from "@/models/ViagemFiltroDTO";
import { ViagemBuscaDTO } from "@/models/ViagemBuscaDTO";
import { buscarViagens } from "@/services/viagemService";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";

// Função utilitária para limpar os campos vazios
function limparFiltros(obj: any) {
  const novo: any = {};
  Object.keys(obj).forEach((k) => {
    // Não inclui campos string vazia ou null/undefined
    if (
      obj[k] !== "" &&
      obj[k] !== null &&
      obj[k] !== undefined
    ) {
      novo[k] = obj[k];
    }
  });
  return novo;
}

const EncontreViagens = () => {
  const [filtros, setFiltros] = useState<ViagemFiltroDTO>({
    destino: "",
    tipoViagem: "",
    estiloViagem: "",
    dataInicioMin: "",
    dataInicioMax: "",
    valorMedioMin: "",
    valorMedioMax: "",
    status: "",
    apenasVagasAbertas: false,
    criadorNome: "",
  });

  const [viagens, setViagens] = useState<ViagemBuscaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [valorMedioMinInput, setValorMedioMinInput] = useState("");
  const [valorMedioMaxInput, setValorMedioMaxInput] = useState("");

  // Trata campos dos filtros
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Formata valores monetários
  const handleValorMedioChange = (
    campo: "valorMedioMin" | "valorMedioMax",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "");
    const valor = raw ? parseFloat(raw) / 100 : "";

    const formatado =
      valor !== ""
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
        : "";

    if (campo === "valorMedioMin") setValorMedioMinInput(formatado);
    else setValorMedioMaxInput(formatado);

    setFiltros((prev) => ({
      ...prev,
      [campo]: valor === "" ? "" : Number(valor),
    }));
  };

  // Buscar viagens com os filtros (agora limpa antes de enviar)
  const buscar = async () => {
    setLoading(true);
    try {
      // Limpa campos vazios
      const filtrosLimpos = limparFiltros({
        ...filtros,
        destino: filtros.destino?.trim() || undefined,
        criadorNome: filtros.criadorNome?.trim() || undefined,
      });

      const res = await buscarViagens(filtrosLimpos);
      setViagens(res);
      if (res.length === 0) {
        toast.info("Nenhuma viagem encontrada.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao buscar viagens");
    } finally {
      setLoading(false);
    }
  };

  // Limpa os filtros
  const limparTodosFiltros = () => {
    setFiltros({
      destino: "",
      tipoViagem: "",
      estiloViagem: "",
      dataInicioMin: "",
      dataInicioMax: "",
      valorMedioMin: "",
      valorMedioMax: "",
      status: "",
      apenasVagasAbertas: false,
      criadorNome: "",
    });
    setValorMedioMinInput("");
    setValorMedioMaxInput("");
  };

  // Renderização dos cards
  const renderCardViagem = (viagem: ViagemBuscaDTO) => (
    <div
      key={viagem.id}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center flex flex-col justify-between min-h-[320px]"
    >
      <div>
        <Image
          src={"/images/common/travel-card.jpg"}
          alt="Destino"
          width={96}
          height={96}
          className="rounded-lg mx-auto mb-3 object-cover aspect-video"
        />
        <h2 className="text-xl font-bold text-gray-800">{viagem.destino}</h2>
        <p className="text-gray-600 text-sm mb-2">
          {viagem.estiloViagem} &middot; {viagem.tipoViagem === "NACIONAL" ? "Nacional" : "Internacional"}
        </p>
        <p className="text-gray-500 text-xs mb-2">
          <b>Período:</b> {viagem.dataInicio} &rarr; {viagem.dataFim}
        </p>
        <p className="text-gray-700 text-sm mb-1">
          Valor Médio: {viagem.valorMedio ? `R$ ${viagem.valorMedio.toLocaleString("pt-BR")}` : "Não informado"}
        </p>
        <p className="text-gray-500 text-xs mb-2">
          Criador: {viagem.criadorNome}
        </p>
        <span className={`inline-block px-2 py-1 rounded text-xs ${viagem.status === "ABERTA"
          ? "bg-green-100 text-green-800"
          : viagem.status === "CONFIRMADA"
            ? "bg-blue-100 text-blue-800"
            : "bg-red-100 text-red-800"
          }`}>
          {viagem.status}
        </span>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Vagas restantes: {viagem.vagasRestantes ?? "?"}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/images/common/beach.jpg')` }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 pt-28">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Encontre Viagens! 🌍✈️
          </h1>
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex flex-1 items-center border border-gray-300 rounded px-4 py-2">
                <Search className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder={"Destino, cidade, país..."}
                  value={filtros.destino}
                  onChange={e => setFiltros(prev => ({ ...prev, destino: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      buscar();
                    }
                  }}
                  className="w-full outline-none"
                />
              </div>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
              <button
                onClick={buscar}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 shadow whitespace-nowrap"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buscando...
                  </span>
                ) : (
                  <>🔍 Buscar Viagens</>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 ml-1">
              Digite o destino e pressione <span className="font-semibold">Enter</span> ou clique em "Buscar Viagens".
            </p>
          </div>
          <AnimatePresence>
            {mostrarFiltros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden bg-gray-50 rounded-lg p-4 border mb-6"
              >
                {/* Linha 1: Tipo, Estilo, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Tipo</label>
                    <select
                      name="tipoViagem"
                      value={filtros.tipoViagem}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    >
                      <option value="">Todos</option>
                      <option value="NACIONAL">Nacional</option>
                      <option value="INTERNACIONAL">Internacional</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Estilo</label>
                    <select
                      name="estiloViagem"
                      value={filtros.estiloViagem}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    >
                      <option value="">Todos</option>
                      <option value="AVENTURA">Aventura</option>
                      <option value="CULTURAL">Cultural</option>
                      <option value="RELAXAMENTO">Relaxamento</option>
                      <option value="ROMANTICA">Romântica</option>
                      <option value="GASTRONOMICA">Gastronômica</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Status</label>
                    <select
                      name="status"
                      value={filtros.status}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    >
                      <option value="">Todos</option>
                      <option value="ABERTA">Aberta</option>
                      <option value="CONFIRMADA">Confirmada</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                  </div>
                </div>
                {/* Linha 2: Data, Valor, Criador, Vagas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Data Inicial (de)</label>
                    <input
                      type="date"
                      name="dataInicioMin"
                      value={filtros.dataInicioMin}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Data Inicial (até)</label>
                    <input
                      type="date"
                      name="dataInicioMax"
                      value={filtros.dataInicioMax}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Valor Médio (Mín. - Máx.) (R$)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="valorMedioMin"
                        placeholder="Mín."
                        value={valorMedioMinInput}
                        onChange={(e) => handleValorMedioChange("valorMedioMin", e)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                      />
                      <input
                        type="text"
                        name="valorMedioMax"
                        placeholder="Máx."
                        value={valorMedioMaxInput}
                        onChange={(e) => handleValorMedioChange("valorMedioMax", e)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>
                {/* Criador & Vagas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Criador</label>
                    <input
                      type="text"
                      name="criadorNome"
                      value={filtros.criadorNome}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      name="apenasVagasAbertas"
                      checked={!!filtros.apenasVagasAbertas}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    <label className="text-sm text-gray-600">
                      Apenas viagens com vagas abertas
                    </label>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={buscar}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 shadow w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Buscando...
                        </span>
                      ) : (
                        <>🔍 Buscar Viagens</>
                      )}
                    </button>
                    <button
                      onClick={limparTodosFiltros}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      🔄 Limpar filtros
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Lista de viagens */}
          <div className="mt-8">
            {viagens.length === 0 && !loading ? (
              <p className="text-center text-gray-500">
                Nenhuma viagem encontrada.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {viagens.map((viagem) => renderCardViagem(viagem))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncontreViagens;
