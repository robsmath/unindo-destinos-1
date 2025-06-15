"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Check, ArrowRight, Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  location: string;
  message: string;
  avatar: string;
  rating: number;
}

const testimonials: TestimonialProps[] = [
  {
    name: "Maria Silva",
    location: "São Paulo, Brasil",
    message: "Encontrei companheiros incríveis para minha viagem ao Japão. A experiência foi transformadora e fiz amizades que durarão para sempre!",
    avatar: "/images/user/avatar.png",
    rating: 5
  },
  {
    name: "João Santos",
    location: "Rio de Janeiro, Brasil",
    message: "A plataforma me ajudou a criar roteiros personalizados e descobrir lugares que nunca imaginei. Recomendo para todos os viajantes!",
    avatar: "/images/user/avatar.png",
    rating: 5
  },
  {
    name: "Ana Costa",
    location: "Belo Horizonte, Brasil",
    message: "Como mulher viajando sozinha, me senti segura sabendo que podia encontrar outros viajantes confiáveis. Uma experiência incrível!",
    avatar: "/images/user/avatar.png",
    rating: 5
  }
];

const TestimonialCard: React.FC<TestimonialProps & { index: number }> = ({ 
  name, location, message, avatar, rating, index 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2, duration: 0.6 }}
    className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group h-full"
  >
    <div className="flex items-center mb-4 md:mb-6">
      <div className="relative">
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className="md:w-[60px] md:h-[60px] rounded-full object-cover ring-4 ring-orange-100 group-hover:ring-primary/20 transition-all duration-300"
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
        </div>
      </div>
      <div className="ml-3 md:ml-4">
        <h4 className="font-bold text-gray-900 text-sm md:text-base">{name}</h4>
        <p className="text-gray-600 text-xs md:text-sm">{location}</p>
      </div>
    </div>
    
    <div className="flex mb-3 md:mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    
    <p className="text-gray-700 leading-relaxed italic text-sm md:text-base">"{message}"</p>
  </motion.div>
);

const Testimonials = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const handleComecarAgora = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/auth/signup');
    }
  };
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-12 md:py-20 bg-gradient-to-br from-white via-orange-50/30 to-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-8 md:top-10 right-4 md:right-10 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-full blur-xl hidden sm:block"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-8 md:bottom-10 left-4 md:left-10 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-orange-500/10 to-primary/10 rounded-full blur-xl hidden sm:block"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
            O que nossos viajantes dizem
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Histórias reais de pessoas que transformaram suas viagens em experiências inesquecíveis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-8 md:mt-12 px-4"
        >
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Pronto para criar sua própria história?</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button 
              onClick={handleComecarAgora}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
            >
              Começar Agora
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
