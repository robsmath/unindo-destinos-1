"use client";
import { cadastrarViagem } from "@/services/viagemService";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getImage } from "@/services/unsplashService";

const CadastroViagem = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [imagemDestino, setImagemDestino] = React.useState<string | null>(null);
  const [form, setForm] = useState({
    destino: "",
    dataInicio: "",
    dataFim: "",
    estiloViagem: "AVENTURA",
    status: "PUBLICADO",
    criadorViagemId: "1",
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cadastrarViagem(form);
      alert("Viagem cadastrada com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar viagem");
      console.error(error);
    }
  };

  const fetchImagemPaisagemDestino = async (destino: string) => {
    try {
      if (!destino) return null;
      return await getImage(destino);
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      return null;
    }
  };

  return (
    <section id="support" className="px-4 md:px-8 2xl:px-0">
      <div className="relative mx-auto max-w-c-1390 px-7.5 pb-20 pt-60">
        <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]" />

        <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15"
          >
            <h2 className="mb-2 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
              Cadastre sua viagem
            </h2>
            <p className="mb-10">
              Cadastre sua viagem na Unindo Destinos e descubra um mundo de
              companhias para compartilhar sua jornada.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-7.5">
                <input
                  type="text"
                  name="destino"
                  placeholder="Destino"
                  value={form.destino}
                  onChange={handleChange}
                  className="input"
                  onBlur={async (e) => {
                    const urlImagem = await fetchImagemPaisagemDestino(
                      e.target.value,
                    );
                    setImagemDestino(urlImagem);
                  }}
                />
              </div>
              <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                <input
                  type="date"
                  name="dataInicio"
                  value={form.dataInicio}
                  onChange={handleChange}
                  className="input lg:w-1/2"
                />
                <input
                  type="date"
                  name="dataFim"
                  value={form.dataFim}
                  onChange={handleChange}
                  className="input lg:w-1/2"
                />
              </div>
              <div className="mb-11.5">
                <select
                  name="estiloViagem"
                  value={form.estiloViagem}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="AVENTURA">Aventura</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="RELAXAMENTO">Relaxamento</option>
                  <option value="GASTRONOMIA">Gastronomia</option>
                  <option value="ROMANTICO">Romântico</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 font-medium text-white hover:bg-primaryho"
              >
                Cadastrar viagem
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.1 }}
            className="w-full md:w-2/5 lg:w-[26%] "
          >
            <div>
              <Image
                src={imagemDestino || "/images/common/beach.jpg"}
                alt="Imagem do destino"
                width={600}
                height={400}
                className="rounded-lg"
                style={{ objectFit: "cover", width: "100%", height: "540px" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CadastroViagem;
