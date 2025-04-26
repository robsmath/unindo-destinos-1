"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
}

const travelThemes = [
  "Paris Eiffel Tower",
  "Rome Colosseum",
  "London Big Ben",
  "Maldives Beach",
  "Bora Bora",
  "Fernando de Noronha",
  "Santorini Greece",
  "Maui Hawaii",
  "Amalfi Coast Italy",
  "Dubai Skyline",
  "New York Central Park",
  "Kyoto Japan",
  "Barcelona Sagrada Familia",
  "Rio de Janeiro",
  "Grand Canyon USA",
  "San Andres Colombia",
];

export default function Carousel() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const fetchedImages: string[] = [];

        const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
        if (!accessKey) {
          console.error("Chave de acesso da Unsplash não encontrada!");
          return;
        }

        for (const theme of travelThemes) {
            const response = await axios.get<UnsplashResponse>(
                "https://api.unsplash.com/search/photos",
                {
                  params: {
                    query: theme,
                    per_page: 1,
                  },
                  headers: {
                    Authorization: `Client-ID ${accessKey}`,
                  },
                }
              );
              

          if (response.data.results.length > 0) {
            fetchedImages.push(response.data.results[0].urls.regular);
          }
        }

        setImages(fetchedImages);
      } catch (error) {
        console.error("Erro ao carregar imagens do Unsplash:", error);
      }
    }

    fetchImages();
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex"
        initial={{ x: 0 }}
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {images.map((src, index) => (
          <div key={index} className="relative min-w-[300px] h-[200px] mx-2">
            <Image
              src={src}
              alt={`Destino ${index + 1}`}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
