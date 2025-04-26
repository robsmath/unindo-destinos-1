"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Common/Carousel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unindo Destinos - Conectando Viajantes",
  description:
    "Descubra destinos incríveis, encontre companheiros de viagem e viva experiências inesquecíveis no Unindo Destinos!",
};

export default function Home() {
  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-40 pb-16 px-4">
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10">
        {/* Dotted Background */}
        <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
          <Image
            src="/images/shape/shape-dotted-light.svg"
            alt="Dotted Light"
            className="dark:hidden"
            fill
          />
          <Image
            src="/images/shape/shape-dotted-dark.svg"
            alt="Dotted Dark"
            className="hidden dark:block"
            fill
          />
        </div>

        {/* Apresentação */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-lg bg-white px-7.5 pt-7.5 pb-10 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15 xl:pb-15"
        >
          <h1 className="text-4xl font-bold text-center text-black dark:text-white mb-6">
            Bem-vindo ao Unindo Destinos! 🌎✈️
          </h1>

          <p className="text-lg text-left text-gray-700 dark:text-gray-300 mb-8">
            O <strong>Unindo Destinos</strong> conecta viajantes apaixonados em busca de novas aventuras 🌟. 
            Encontre companheiros de viagem que compartilham seus interesses, crie roteiros personalizados 🚀 
            e viva experiências únicas ao redor do mundo 🌍. Faça novas amizades, descubra destinos incríveis 
            e torne cada viagem uma memória inesquecível! 💬✨
          </p>

          <div className="flex justify-center mb-12">
            <Link
              href="/auth/signin"
              className="inline-block rounded-full bg-primary px-8 py-3 text-white font-semibold hover:bg-primaryho transition"
            >
              Comece Agora
            </Link>
          </div>

          {/* Carrossel de Imagens */}
          <Carousel />
        </motion.div>
      </div>
    </section>
  );
}
