"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Smile } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  const [mensagem, setMensagem] = useState("");

  const handleEnviar = () => {
    if (!mensagem.trim()) {
      toast.error("Digite uma mensagem antes de enviar!");
      return;
    }
    const mailto = `mailto:contato@unindodestinos.com.br?subject=Feedback - Unindo Destinos&body=${encodeURIComponent(mensagem)}`;
    window.location.href = mailto;
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100 px-4 pt-40 pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-orange-500/5 to-transparent"
          animate={{ 
            background: [
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), transparent)",
              "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05), transparent)",
              "linear-gradient(225deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), transparent)",
              "linear-gradient(315deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05), transparent)",
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), transparent)"
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
          {/* Floating Elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${4 + (i % 3) * 2} h-${4 + (i % 3) * 2} rounded-full`}
            style={{
              background: `linear-gradient(45deg, ${
                i % 2 === 0 ? 'rgba(234, 88, 12, 0.1)' : 'rgba(249, 115, 22, 0.1)'
              }, transparent)`,
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`,
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + (i * 0.5),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}        {/* Large floating orbs */}
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
        
        {/* Additional medium orbs */}
        <motion.div
          className="absolute top-1/2 right-20 w-48 h-48 bg-gradient-to-r from-primary/8 to-orange-500/8 rounded-full blur-2xl"
          animate={{ 
            y: [0, -25, 0],
            x: [0, 10, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        
        <motion.div
          className="absolute top-1/3 left-1/4 w-56 h-56 bg-gradient-to-r from-orange-500/8 to-primary/8 rounded-full blur-2xl"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.4, 0.25]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />{/* Support icons floating */}
        {[...Array(12)].map((_, i) => {
          const icons = [Smile, Mail, MessageCircle];
          const IconComponent = icons[i % 3];
          return (
            <motion.div
              key={`support-${i}`}
              className="absolute text-primary/20"
              style={{
                left: `${5 + (i * 8)}%`,
                top: `${10 + (i * 7)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 6 + (i * 0.3),
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            >
              <IconComponent className="w-8 h-8" />
            </motion.div>
          );
        })}
        
        {/* Additional floating icons with different patterns */}
        {[...Array(8)].map((_, i) => {
          const icons = [Smile, Mail, MessageCircle];
          const IconComponent = icons[(i + 1) % 3];
          return (
            <motion.div
              key={`support-extra-${i}`}
              className="absolute text-orange-500/15"
              style={{
                left: `${15 + (i * 10)}%`,
                top: `${60 + (i * 5)}%`,
              }}
              animate={{
                y: [0, 25, 0],
                rotate: [0, -15, 15, 0],
                opacity: [0.15, 0.3, 0.15],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + (i * 0.4),
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut"
              }}
            >
              <IconComponent className="w-6 h-6" />
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-10">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >          <div className="inline-flex items-center gap-3 mb-4">
            <motion.div
              className="p-4 bg-gradient-to-r from-primary to-orange-500 rounded-2xl shadow-xl"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(234,88,12,0.2)",
                  "0 0 40px rgba(249,115,22,0.3)",
                  "0 0 30px rgba(234,88,12,0.2)",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-4xl">💅</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Vamos dar uma força pra quem ta começando? 💅
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Essa plataforma é um <strong>projeto acadêmico</strong> em fase de testes. Estamos colhendo <strong>feedbacks</strong> e corrigindo bugs com a sua ajuda! 💜
          </p>
        </motion.div>        {/* Vídeo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="aspect-video w-full max-w-2xl mx-auto rounded-2xl shadow-xl overflow-hidden border border-orange-300"
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/DZ03loM-Fgo?autoplay=1&mute=0"
            title="Fernanda Ganzarolli - Bora ajudar"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
        {/* Campo de feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-2xl mx-auto space-y-4"
        >
          <Textarea
            placeholder="Escreva aqui seu feedback, sugestão ou bug encontrado..."
            className="min-h-[120px] bg-white/70 border border-orange-300 backdrop-blur-md shadow-md"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />
          <Button
            onClick={handleEnviar}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-orange-500 text-white text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
          >
            <Mail className="w-5 h-5 mr-2" />
            Enviar por e-mail
          </Button>
        </motion.div>

        {/* Contatos por WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col md:flex-row justify-center gap-4 pt-8"
        >
          <a
            href="https://wa.me/5531998604820"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:scale-[1.03] transition"
          >
            <MessageCircle className="w-5 h-5" />
            Falar com Robson
          </a>
          <a
            href="https://wa.me/5531995030878"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:scale-[1.03] transition"
          >
            <MessageCircle className="w-5 h-5" />
            Falar com Mayara
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Page;
