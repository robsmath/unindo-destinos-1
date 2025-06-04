"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { 
  Plane, 
  MapPin, 
  Users, 
  Camera, 
  Heart, 
  Compass, 
  Globe, 
  Map,
  Calendar,
  Star,
  ArrowRight,
  TrendingUp,
  Smile,
  MessageCircle,
  Luggage
} from "lucide-react";

const HomeLogada = () => {
  const { usuario } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const firstName = usuario?.nome ? usuario.nome.split(" ")[0] : "Explorador";

  // Visão e Valores da empresa
  const visionAndValues = [
    { 
      icon: "🌟", 
      title: "Nossa Visão", 
      description: "Conectar pessoas com sonhos em comum e transformar cada viagem em uma experiência única, repleta de amizades, descobertas e memórias inesquecíveis.",
      color: "from-yellow-500 to-orange-500" 
    },
    { 
      icon: "💙", 
      title: "Companheirismo", 
      description: "Acreditamos que viajar junto é melhor. Cada aventura se torna mais rica quando compartilhada com pessoas que vibram na mesma frequência.",
      color: "from-blue-500 to-blue-600" 
    },
    { 
      icon: "🛡️", 
      title: "Segurança", 
      description: "Promovemos conexões com responsabilidade e respeito. Sua segurança e bem-estar são nossa prioridade em cada interação.",
      color: "from-green-500 to-green-600" 
    },
    { 
      icon: "🌈", 
      title: "Inclusão & Autenticidade", 
      description: "Toda jornada merece espaço para diferentes histórias. Cada destino, cada pessoa, cada viagem — sempre do seu jeito único.",
      color: "from-purple-500 to-pink-500" 
    }
  ];

  // Features principais
  const features = [
    {
      icon: Users,
      title: "Encontre Companheiros",
      description: "Conecte-se com viajantes que compartilham seus interesses e destinos",
      href: "/encontrar/pessoas",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Globe,
      title: "Descubra Viagens",
      description: "Explore viagens incríveis criadas por nossa comunidade",
      href: "/encontrar/viagens",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Compass,
      title: "Crie Sua Jornada",
      description: "Planeje e organize suas próprias aventuras com nossa IA",
      href: "/viagens/cadastrar",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Central de Solicitações",
      description: "Gerencie solicitações de participação e mensagens de viagem",
      href: "/profile?tab=central-solicitacoes",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Destinos em alta com imagens da API
  const trendingDestinations = [
    { 
      name: "Fernando de Noronha", 
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&auto=format&q=80", 
      travelers: 342,
      query: "fernando-de-noronha-brazil"
    },
    { 
      name: "Chapada Diamantina", 
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop&auto=format&q=80", 
      travelers: 198,
      query: "chapada-diamantina-brazil"
    },
    { 
      name: "Lençóis Maranhenses", 
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop&auto=format&q=80", 
      travelers: 287,
      query: "lencois-maranhenses-brazil"
    },
    { 
      name: "Bonito - MS", 
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format&q=80", 
      travelers: 156,
      query: "bonito-brazil-crystal-clear-water"
    }
  ];

  // Função para scroll to top nos links
  const handleLinkClick = (href: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.location.href = href;
    }, 100);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Background Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-orange-500/5 to-transparent"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), transparent)",
                "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05), transparent)",
                "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), transparent)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating Travel Icons */}
          {[Plane, MapPin, Camera, Compass, Globe, Luggage].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/20"
              style={{
                left: `${15 + (i * 12)}%`,
                top: `${20 + (i * 10)}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          ))}

          {/* Large floating orbs */}
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full blur-3xl"
            animate={{ 
              y: [0, -40, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-orange-500/10 to-primary/10 rounded-full blur-3xl"
            animate={{ 
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/20 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Smile className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-gray-700 font-medium">
                Bem-vindo de volta, <span className="text-primary font-bold">{firstName}!</span>
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent">
              Sua próxima aventura
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-primary bg-clip-text text-transparent">
              te espera aqui
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            Explore destinos incríveis, conecte-se com viajantes apaixonados e transforme cada jornada em uma experiência inesquecível.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => handleLinkClick("/encontrar/viagens")}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                Explorar Viagens
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => handleLinkClick("/encontrar/pessoas")}
                className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-xl text-primary font-bold rounded-full shadow-lg border border-white/20 hover:bg-white transition-all duration-300 text-lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Encontrar Pessoas
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa <span className="text-primary">Essência</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça os valores e a visão que movem nossa comunidade de viajantes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visionAndValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} mb-6`}>
                    <span className="text-3xl">{value.icon}</span>
                  </div>
                  
                  <motion.h3
                    className="text-xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {value.title}
                  </motion.h3>
                  
                  <p className="text-gray-600 font-medium leading-relaxed text-sm">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para <span className="text-primary">viajar melhor</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas para planejar, conectar e viver experiências únicas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group cursor-pointer"
                onClick={() => handleLinkClick(feature.href)}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Explorar agora
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full px-6 py-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Em Alta</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Destinos mais procurados
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra os lugares que estão conquistando os corações dos viajantes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDestinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority={index < 2}
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&auto=format&q=80`;
                      }}
                    />
                    
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {destination.travelers} viajantes interessados
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => handleLinkClick("/encontrar/viagens")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg hover:scale-105"
            >
              Ver todos os destinos
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-orange-500 to-primary relative overflow-hidden">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Sua próxima aventura começa agora!
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Não espere mais para viver experiências incríveis. Explore nossa plataforma e encontre sua próxima jornada inesquecível.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                onClick={() => handleLinkClick("/viagens/cadastrar")}
                className="inline-flex items-center px-8 md:px-10 py-3 md:py-4 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg hover:bg-gray-50"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Criar Minha Viagem
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeLogada; 