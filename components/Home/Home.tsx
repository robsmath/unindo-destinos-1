"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Carousel from "@/components/Common/Carousel";
import LoadingScreen from "@/components/Common/LoadingScreen";
import AnimatedStats from "./AnimatedStats";
import Testimonials from "./Testimonials";
import EnhancedHero from "./EnhancedHero";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useSmoothScroll();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div ref={containerRef} className="relative">
      {/* Hero Section com Parallax */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5"
      >
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-orange-500/5 to-primary/10 animate-pulse" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary to-orange-500 rounded-full opacity-20 blur-xl"
        />
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-500 to-primary rounded-full opacity-15 blur-2xl"
        />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <EnhancedHero />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        {...fadeInUp}
        className="py-20 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Conecte-se com o mundo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                O <span className="font-semibold text-primary">Unindo Destinos</span> conecta viajantes apaixonados em busca de novas aventuras. 
                Encontre companheiros que compartilham seus interesses, crie roteiros personalizados e viva experiências únicas.
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 mb-16"
            >
              {[
                {
                  icon: "🌍",
                  title: "Destinos Incríveis",
                  description: "Descubra lugares únicos e experiências autênticas ao redor do mundo"
                },
                {
                  icon: "🤝",
                  title: "Companheiros de Viagem",
                  description: "Encontre pessoas com interesses similares e faça amizades duradouras"
                },
                {
                  icon: "🗺️",
                  title: "Roteiros Personalizados",
                  description: "Crie e compartilhe roteiros únicos adaptados aos seus interesses"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/20">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>        </div>
      </motion.section>

      {/* Animated Stats Section */}
      <AnimatedStats />

      {/* Carousel Section */}
      <motion.section 
        {...fadeInUp}
        className="py-20 bg-gradient-to-br from-gray-50 to-white relative"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Inspire-se com destinos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore uma seleção de destinos incríveis e inspire-se para sua próxima aventura
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <Carousel />          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <motion.section 
        {...fadeInUp}
        className="py-20 bg-gradient-to-r from-primary via-orange-500 to-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={fadeInUp} className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para começar sua aventura?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Junte-se à nossa comunidade de viajantes e descubra um mundo de possibilidades. 
              Faça novas amizades, descubra destinos incríveis e torne cada viagem uma memória inesquecível!
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-10 py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg hover:bg-gray-50"
              >
                Criar Conta Gratuita
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>        </div>
      </motion.section>
        </div>
      )}
    </>
  );
}
