"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import EnhancedHero from "./EnhancedHero";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useAuth } from "@/app/context/AuthContext";
import HomeLogada from "./HomeLogada";
import LoadingScreen from "@/components/Common/LoadingScreen";

const AnimatedStats = dynamic(() => import("./AnimatedStats"), {
  loading: () => <div className="h-32 w-full animate-pulse bg-gray-100 rounded-2xl" />,
  ssr: false,
});

const Carousel = dynamic(() => import("@/components/Common/Carousel"), {
  loading: () => <div className="h-48 w-full animate-pulse bg-gray-100 rounded-2xl" />,
  ssr: false,
});

const Testimonials = dynamic(() => import("./Testimonials"), {
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-100 rounded-2xl" />,
  ssr: false,
});

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useSmoothScroll();

  useEffect(() => {
    const isInternalNavigation = sessionStorage.getItem('internalNavigation');
    
    if (isAuthenticated && isInternalNavigation === 'true') {
      setIsLoading(false);
      setIsInitialLoad(false);
    } else {
      setIsInitialLoad(true);
    }

    if (isAuthenticated) {
      sessionStorage.setItem('internalNavigation', 'true');
    }
  }, [isAuthenticated]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setIsInitialLoad(false);
    if (isAuthenticated) {
      sessionStorage.setItem('internalNavigation', 'true');
    }
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  if (isAuthenticated) {
    return <HomeLogada />;
  }

  return (
    <>      <AnimatePresence>
        {isLoading && isInitialLoad && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {(!isLoading || !isInitialLoad) && (
        <div ref={containerRef} className="relative">
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-primary/5 pt-20 md:pt-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-orange-500/5 to-primary/10 animate-pulse" />
        
        {!isMobile && (
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
            className="absolute top-20 left-4 md:left-10 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-orange-500 rounded-full opacity-20 blur-xl hidden sm:block"
          />
        )}
        
        {!isMobile && (
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
            className="absolute bottom-20 right-4 md:right-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-500 to-primary rounded-full opacity-15 blur-2xl hidden sm:block"
          />
        )}

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center w-full max-w-7xl">
          <EnhancedHero />
        </div>
        {!isMobile && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        >
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-primary rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 md:h-3 bg-primary rounded-full mt-1 md:mt-2"
            />
          </div>
        </motion.div>
        )}
      </motion.section>
      <motion.section 
        {...fadeInUp}
        className="py-12 md:py-20 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
                Conecte-se com o mundo
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                O <span className="font-semibold text-primary">Unindo Destinos</span> conecta viajantes apaixonados em busca de novas aventuras. 
                Encontre companheiros que compartilham seus interesses, crie roteiros personalizados e viva experiências únicas.
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 px-4"
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
              ].map((feature, index) => (                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/20 h-full">
                    <div className="text-4xl md:text-5xl mb-3 md:mb-4">{feature.icon}</div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>        </div>
      </motion.section>

      <AnimatedStats />
      <motion.section 
        {...fadeInUp}
        className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
              Inspire-se com destinos
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Explore uma seleção de destinos incríveis e inspire-se para sua próxima aventura
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-gray-100 mx-2 md:mx-0"
          >
            <Carousel />
          </motion.div>
        </div>
      </motion.section>

      <Testimonials />
      <motion.section 
        {...fadeInUp}
        className="py-12 md:py-20 bg-gradient-to-r from-primary via-orange-500 to-primary relative overflow-hidden"
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
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeInUp} className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
              Pronto para começar sua aventura?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed px-4">
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
                className="inline-flex items-center px-8 md:px-10 py-3 md:py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg hover:bg-gray-50 mx-4"
              >
                Criar Conta Gratuita
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
        </div>
      )}
    </>
  );
}
