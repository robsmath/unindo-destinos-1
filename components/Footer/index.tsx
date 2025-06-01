"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const socialLinks = [
    { 
      name: "Instagram", 
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
      href: "#"
    },
    { 
      name: "Twitter", 
      icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
      href: "#"
    },
    { 
      name: "LinkedIn", 
      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
      href: "#"
    },
    { 
      name: "YouTube", 
      icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
      href: "#"
    }
  ];  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Minhas Viagens", href: "/profile?tab=viagens" },
    { name: "Minhas Preferências", href: "/profile?tab=preferencias" },
    { name: "Encontrar Pessoas", href: "/encontrar/pessoas" },
    { name: "Encontrar Viagens", href: "/encontrar/viagens" }
  ];
  const supportLinks = [
    { name: "FAQ", href: "/faq" },
    { name: "Termos de Uso", href: "/termos-de-uso" }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Magic background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-orange-500/5 to-transparent"
          animate={{ 
            background: [
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), transparent)",
              "linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(234, 88, 12, 0.05), transparent)",
              "linear-gradient(45deg, rgba(234, 88, 12, 0.05), rgba(249, 115, 22, 0.05), transparent)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-orange-500/20 to-primary/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        {/* Main Footer Content */}
        <div className="py-20 lg:py-25">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >              <motion.div 
                className="mb-8 inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <Link 
                  href="/" 
                  className="block relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-orange-500/10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    whileHover={{ 
                      filter: "brightness(1.2) drop-shadow(0 0 20px rgba(234, 88, 12, 0.3))"
                    }}
                    transition={{ duration: 0.3 }}
                  >                    <Image
                      width={140}
                      height={60}
                      src="/images/logo/unindo-destinos-logo.png"
                      alt="Unindo Destinos"
                      className="transition-all duration-300 relative z-10"
                    />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <p className="text-gray-400 leading-relaxed">
                  Conectando viajantes apaixonados pelo mundo. Descubra novos destinos, 
                  faça amizades duradouras e crie memórias inesquecíveis.
                </p>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Contato
                  </h5>
                  <motion.a
                    href="mailto:contato@unindodestinos.com.br"
                    className="text-white hover:text-primary transition-colors duration-300 block"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    contato@unindodestinos.com.br
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h4 className="text-xl font-semibold text-white relative">
                Links Rápidos
                <motion.div
                  className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </h4>

              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-400 hover:text-primary transition-all duration-300"
                    >
                      <motion.div
                        className="w-1 h-1 bg-primary/60 rounded-full mr-3 opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="group-hover:translate-x-2 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h4 className="text-xl font-semibold text-white relative">
                Suporte
                <motion.div
                  className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </h4>

              <div className="space-y-3">
                {supportLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-400 hover:text-primary transition-all duration-300"
                    >
                      <motion.div
                        className="w-1 h-1 bg-primary/60 rounded-full mr-3 opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="group-hover:translate-x-2 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h4 className="text-xl font-semibold text-white relative">
                Newsletter
                <motion.div
                  className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </h4>

              <p className="text-gray-400 leading-relaxed">
                Receba as últimas novidades, dicas de viagem e ofertas especiais
                direto no seu email.
              </p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 
                             rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 
                             focus:bg-white/10 transition-all duration-300"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 
                             rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileFocus={{ scale: 1 }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-orange-500 
                           text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 
                           hover:shadow-2xl hover:shadow-primary/25 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Inscrever-se                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      dangerouslySetInnerHTML={{ __html: `<path d="M3 12H21M21 12L15 6M21 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />` }}
                    />
                  </span>
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>
              </motion.form>            </motion.div>
          </div>
        </div>

        {/* Divisor com gradiente */}
        <motion.div
          className="relative my-16"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <motion.div
            className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-0"
        >
          {/* Copyright */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-primary font-semibold">Unindo Destinos</span>.
              Todos os direitos reservados.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 
                         hover:border-primary/30 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                aria-label={`Seguir no ${social.name}`}
              >
                {/* Hover background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 
                           rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.2 }}
                />
                  {/* Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 text-gray-400 group-hover:text-primary transition-colors duration-300"
                  dangerouslySetInnerHTML={{ __html: `<path d="${social.icon}" fill="currentColor" />` }}
                />

                {/* Sparkle effect */}
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-0 
                           group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
