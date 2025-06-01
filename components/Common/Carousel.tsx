"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { motion, useMotionValue, useAnimationControls } from "framer-motion";

interface UnsplashPhoto {
  urls: {
    regular: string;
    small: string;
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

// Fallback images in case Unsplash API fails
const fallbackImages = [
  "/images/destinations/paris.jpg",
  "/images/destinations/rome.jpg", 
  "/images/destinations/london.jpg",
  "/images/destinations/maldives.jpg",
  "/images/destinations/bora-bora.jpg",
  "/images/destinations/fernando-noronha.jpg",
  "/images/destinations/santorini.jpg",
  "/images/destinations/maui.jpg",
];

export default function Carousel() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const controls = useAnimationControls();
  const x = useMotionValue(0);

  // Update window width on resize
  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  // Get responsive dimensions based on screen size
  const getImageDimensions = useCallback(() => {
    if (windowWidth < 640) { // Mobile
      return { width: 240, height: 160 };
    } else if (windowWidth < 768) { // Small tablet
      return { width: 280, height: 180 };
    } else if (windowWidth < 1024) { // Tablet
      return { width: 320, height: 200 };
    } else { // Desktop
      return { width: 360, height: 220 };
    }
  }, [windowWidth]);  // Get animation parameters based on screen size
  const getAnimationParams = useCallback(() => {
    const imageWidth = getImageDimensions().width + 16; // width + margin
    const visibleImages = Math.ceil(windowWidth / imageWidth);
    const totalDistance = images.length * imageWidth;
    
    return {
      distance: -totalDistance,
      duration: windowWidth < 768 ? 60 : 80, // Even slower and more relaxing
    };
  }, [windowWidth, images.length, getImageDimensions]);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedImages: string[] = [];

      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      if (!accessKey) {
        console.warn("Chave de acesso da Unsplash não encontrada! Usando imagens fallback.");
        setImages(fallbackImages);
        return;
      }

      // Limit API calls on mobile to improve performance
      const themesToFetch = windowWidth < 768 ? travelThemes.slice(0, 8) : travelThemes;

      for (const theme of themesToFetch) {
        try {
          const response = await axios.get<UnsplashResponse>(
            "https://api.unsplash.com/search/photos",
            {
              params: {
                query: theme,
                per_page: 1,
                orientation: "landscape",
              },
              headers: {
                Authorization: `Client-ID ${accessKey}`,
              },
              timeout: 5000, // 5 second timeout
            }
          );

          if (response.data.results.length > 0) {
            // Use small size for mobile, regular for desktop
            const imageUrl = windowWidth < 768 
              ? response.data.results[0].urls.small 
              : response.data.results[0].urls.regular;
            fetchedImages.push(imageUrl);
          }
        } catch (error) {
          console.warn(`Erro ao carregar imagem para: ${theme}`, error);
          // Continue with other images
        }
      }

      // If we have some images, use them; otherwise, use fallback
      if (fetchedImages.length > 0) {
        setImages(fetchedImages);
      } else {
        console.warn("Nenhuma imagem carregada da API. Usando imagens fallback.");
        setImages(fallbackImages);
      }
    } catch (error) {
      console.error("Erro ao carregar imagens do Unsplash:", error);
      setImages(fallbackImages);
    } finally {
      setIsLoading(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (windowWidth > 0) {
      fetchImages();
    }
  }, [fetchImages, windowWidth]);

  // Start animation when images are loaded
  useEffect(() => {
    if (images.length > 0 && !isLoading) {
      const { distance, duration } = getAnimationParams();
      
      controls.start({
        x: [0, distance],
        transition: {
          repeat: Infinity,
          duration: duration,
          ease: "linear",
        },
      });
    }
  }, [images, isLoading, controls, getAnimationParams]);

  const { width: imageWidth, height: imageHeight } = getImageDimensions();

  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-pulse">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`flex-shrink-0 bg-gray-200 rounded-lg mx-2`}
              style={{ 
                width: imageWidth, 
                height: imageHeight,
                minWidth: imageWidth 
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden carousel-container">
      <motion.div
        className="flex"
        animate={controls}
        style={{ x }}
      >
        {/* Duplicate images for seamless loop */}
        {[...images, ...images].map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-2 carousel-item"
            style={{ 
              width: imageWidth, 
              height: imageHeight,
              minWidth: imageWidth 
            }}
          >
            <div className="relative w-full h-full group">
              <Image
                src={src}
                alt={`Destino inspirador ${(index % images.length) + 1}`}
                fill
                className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={`${imageWidth}px`}
                loading="lazy"
                quality={windowWidth < 768 ? 75 : 85}
                onError={(e) => {
                  console.warn(`Erro ao carregar imagem: ${src}`);
                  // Could implement fallback image here
                }}
              />
              
              {/* Overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
    </div>
  );
}
