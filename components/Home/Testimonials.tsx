"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

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
    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
  >
    <div className="flex items-center mb-6">
      <div className="relative">
        <Image
          src={avatar}
          alt={name}
          width={60}
          height={60}
          className="rounded-full object-cover ring-4 ring-orange-100 group-hover:ring-primary/20 transition-all duration-300"
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="ml-4">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-gray-600 text-sm">{location}</p>
      </div>
    </div>
    
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    
    <p className="text-gray-700 leading-relaxed italic">"{message}"</p>
  </motion.div>
);

const Testimonials = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-br from-white via-orange-50/30 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
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
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-full blur-xl"
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
          className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-primary/10 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            O que nossos viajantes dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Histórias reais de pessoas que transformaram suas viagens em experiências inesquecíveis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">Pronto para criar sua própria história?</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Começar Agora
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
