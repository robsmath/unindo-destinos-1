"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cadastrarUsuario } from "@/services/authService";
import Link from "next/link";
import { InputMask } from "@react-input/mask";
import PhoneInput from "react-phone-input-2";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { 
  Plane, 
  MapPin, 
  Compass, 
  Camera, 
  Heart, 
  Globe, 
  Loader2, 
  Map,
  Luggage,
  Bus
} from "lucide-react";

import "react-phone-input-2/lib/style.css";


const Signup = () => {
  type Genero = "" | "MASCULINO" | "FEMININO" | "OUTRO";

  interface FormData {
    nome: string;
    email: string;
    senha: string;
    confirmSenha: string;
    cpf: string;
    telefone: string;
    genero: Genero;
    dataNascimento: string;
    preferencias: { estiloViagem: string }[];
    endereco: {
      cep: string;
      estado: string;
      cidade: string;
      bairro: string;
      rua: string;
      numero: string;
      complemento: string;
    };
  }

  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
    cpf: "",
    telefone: "",
    genero: "MASCULINO",
    dataNascimento: "",
    preferencias: [{ estiloViagem: "AVENTURA" }],
    endereco: {
      cep: "",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      numero: "",
      complemento: "",
    },
  });

  const [showAddress, setShowAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/profile");
    }
  }, [isAuthenticated, router]);
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const buscarEndereco = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, "");
      if (cepLimpo.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          },
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  };
  const validarIdade = (dataNascimento: string): boolean => {
    if (!dataNascimento) return false;
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();
    
    let idadeReal = idade;
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idadeReal--;
    }
    
    return idadeReal >= 18;
  };

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarCPF = (cpf: string): boolean => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11;
  };

  const validarTelefone = (telefone: string): boolean => {
    const telefoneNumeros = telefone.replace(/\D/g, '');
    return telefoneNumeros.length >= 10;
  };

  const validarSenha = (senha: string): boolean => {
    return senha.length >= 6;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
  
    if (form.senha !== form.confirmSenha) {
      toast.error("Senhas não coincidem. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    if (!validarIdade(form.dataNascimento)) {
      toast.error("Você deve ter pelo menos 18 anos para se cadastrar.");
      setLoading(false);
      return;
    }

    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim() || !form.cpf.trim() || !form.telefone.trim() || !form.dataNascimento) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }
  
    const payload = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      cpf: form.cpf.replace(/\D/g, ""),
      telefone: form.telefone,
      genero: form.genero,
      dataNascimento: form.dataNascimento,
      preferencias: form.preferencias,
      endereco: {
        ...form.endereco,
        cep: form.endereco.cep.replace(/\D/g, ""),
      },
    };
  
    const toastId = toast.loading("Cadastrando usuário...");
  
    try {
      await cadastrarUsuario(payload);
  
      toast.success("Usuário cadastrado com sucesso! Faça login para continuar.", { id: toastId });
  
      router.push("/auth/signin");
    } catch (error: any) {
      console.error(error);
  
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, { id: toastId });
      } else {
        toast.error("Erro ao cadastrar usuário. Verifique os dados ou tente novamente.", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100">
      <div className="absolute inset-0 z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-sky-100/20 via-orange-50/15 to-blue-50/25"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08), rgba(173, 216, 230, 0.12))",
              "linear-gradient(135deg, rgba(255, 165, 0, 0.08), rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08))",
              "linear-gradient(45deg, rgba(135, 206, 235, 0.12), rgba(255, 165, 0, 0.08), rgba(173, 216, 230, 0.12))"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary/40 to-orange-500/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -100, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.div
          className="absolute top-32 right-16"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Plane className="w-8 h-8 text-orange-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-20 left-20"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <MapPin className="w-9 h-9 text-blue-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-16"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 20, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Compass className="w-10 h-10 text-green-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-60 left-32"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Camera className="w-7 h-7 text-purple-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-60 right-20"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        >
          <Map className="w-8 h-8 text-red-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-80 right-32"
          animate={{ 
            y: [0, -18, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <Luggage className="w-9 h-9 text-indigo-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-40"
          animate={{ 
            y: [0, 12, 0],
            x: [0, -8, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        >
          <Bus className="w-8 h-8 text-yellow-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute top-40 right-60"
          animate={{ 
            y: [0, -22, 0],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Globe className="w-10 h-10 text-teal-500/30 drop-shadow-lg" />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-40"
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          <Heart className="w-6 h-6 text-pink-500/30 drop-shadow-lg" />
        </motion.div>
      </div>

      {loading && (
        <motion.div 
          className="fixed inset-0 bg-white/80 backdrop-blur-xl z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex items-center justify-center mb-4"
              style={{ transformOrigin: 'center' }}
            >
              <Loader2 className="h-12 w-12 text-primary" />
            </motion.div>
            <p className="text-lg font-medium text-gray-700">Criando sua conta...</p>
            <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4 py-16">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-3xl" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-gray-900 via-primary to-orange-500 bg-clip-text text-transparent">
                    Junte-se a nós
                  </span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Crie sua conta e descubra destinos incríveis
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">              
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input 
                      name="nome" 
                      placeholder="Digite seu nome completo" 
                      value={form.nome} 
                      onChange={handleChange} 
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80" 
                      style={{ fontSize: '16px' }}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Digite seu e-mail" 
                      value={form.email} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 ${
                        form.email && !validarEmail(form.email) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : form.email && validarEmail(form.email)
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                          : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                      }`}
                      style={{ fontSize: '16px' }}
                    />
                    {form.email && !validarEmail(form.email) && (
                      <p className="text-red-500 text-sm mt-1">
                        Por favor, insira um e-mail válido
                      </p>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                </motion.div>                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha *
                    </label>
                    <input 
                      type="password" 
                      name="senha" 
                      placeholder="Digite sua senha (mín. 6 caracteres)" 
                      value={form.senha} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 ${
                        form.senha && !validarSenha(form.senha) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : form.senha && validarSenha(form.senha)
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                          : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                      }`}
                      style={{ fontSize: '16px' }}
                    />
                    {form.senha && !validarSenha(form.senha) && (
                      <p className="text-red-500 text-sm mt-1">
                        A senha deve ter pelo menos 6 caracteres
                      </p>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <input 
                      type="password" 
                      name="confirmSenha" 
                      placeholder="Confirme sua senha" 
                      value={form.confirmSenha} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 ${
                        form.confirmSenha && form.senha !== form.confirmSenha 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : form.confirmSenha && form.senha === form.confirmSenha && form.senha
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                          : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                      }`}
                      style={{ fontSize: '16px' }}
                    />
                    {form.confirmSenha && form.senha !== form.confirmSenha && (
                      <p className="text-red-500 text-sm mt-1">
                        As senhas não coincidem
                      </p>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF *
                    </label>
                    <InputMask
                      mask="___.___.___-__"
                      replacement={{ _: /\d/ }}
                      name="cpf"
                      value={form.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80 ${
                        form.cpf && !validarCPF(form.cpf) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : form.cpf && validarCPF(form.cpf)
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                          : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                      }`}
                      style={{ fontSize: '16px' }}
                    />
                    {form.cpf && !validarCPF(form.cpf) && (
                      <p className="text-red-500 text-sm mt-1">
                        CPF deve conter 11 dígitos
                      </p>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <div className="phone-input-wrapper">
                      <PhoneInput
                        country={"br"}
                        value={form.telefone}
                        onChange={(phone) => setForm((prev) => ({ ...prev, telefone: `+${phone}` }))}
                        inputClass={`!w-full !pl-[70px] !pr-4 !py-4 !bg-white/70 !backdrop-blur-sm !border !rounded-2xl !focus:ring-2 !transition-all !duration-300 !text-gray-900 !text-base !h-[56px] !leading-none ${
                          form.telefone && !validarTelefone(form.telefone) 
                            ? '!border-red-300 !focus:border-red-500 !focus:ring-red-200' 
                            : form.telefone && validarTelefone(form.telefone)
                            ? '!border-green-300 !focus:border-green-500 !focus:ring-green-200'
                            : '!border-gray-200 !focus:border-primary !focus:ring-primary/20'
                        }`}
                        containerClass="!w-full !h-[56px]"
                        buttonClass="!bg-white/70 !border-gray-200 !rounded-l-2xl !border-r-0 !w-[68px] !h-[56px] !flex !items-center !justify-center !px-2"
                        dropdownClass="!bg-white !border !border-gray-200 !rounded-xl !shadow-lg"
                        inputProps={{
                          style: { 
                            fontSize: '16px',
                            height: '56px',
                            lineHeight: '56px',
                            display: 'flex',
                            alignItems: 'center'
                          },
                          placeholder: '(11) 99999-9999'
                        }}
                      />
                    </div>
                    {form.telefone && !validarTelefone(form.telefone) && (
                      <p className="text-red-500 text-sm mt-1">
                        Telefone deve ter pelo menos 10 dígitos
                      </p>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      name="dataNascimento"
                      value={form.dataNascimento}
                      onChange={handleChange}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 transition-all duration-300 text-gray-900 group-hover:bg-white/80 ${
                        form.dataNascimento && !validarIdade(form.dataNascimento) 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : form.dataNascimento && validarIdade(form.dataNascimento)
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                          : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                      }`}
                      style={{ fontSize: '16px' }}
                    />
                    {form.dataNascimento && !validarIdade(form.dataNascimento) && (
                      <p className="text-red-500 text-sm mt-1">
                        Você deve ter pelo menos 18 anos para se cadastrar
                      </p>
                    )}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gênero *
                    </label>
                    <select 
                      name="genero" 
                      value={form.genero} 
                      onChange={handleChange} 
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 group-hover:bg-white/80"
                      style={{ fontSize: '16px' }}
                    >
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="OUTRO">Outro</option>
                    </select>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2"
                >                  <button
                    type={"button" as const}
                    onClick={() => setShowAddress(!showAddress)}
                    className="text-primary font-semibold flex items-center gap-2 hover:text-orange-500 transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-primary/5"
                  >
                    Informações de Endereço {showAddress ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </motion.div>

                <AnimatePresence>
                  {showAddress && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                    >                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CEP
                          </label>
                          <InputMask
                            mask="_____-___"
                            replacement={{ _: /\d/ }}
                            name="endereco.cep"
                            value={form.endereco.cep}
                            onChange={(e) => {
                              const value = e.target.value;
                              setForm((prev) => ({ ...prev, endereco: { ...prev.endereco, cep: value } }));
                              const cepSemMascara = value.replace(/\D/g, "");
                              if (cepSemMascara.length === 8) buscarEndereco(cepSemMascara);
                            }}
                            placeholder="00000-000"
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                            style={{ fontSize: '16px' }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rua
                          </label>
                          <input 
                            name="endereco.rua" 
                            placeholder="Nome da rua" 
                            value={form.endereco.rua} 
                            onChange={handleChange} 
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                            style={{ fontSize: '16px' }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número
                          </label>
                          <input 
                            name="endereco.numero" 
                            placeholder="123" 
                            value={form.endereco.numero} 
                            onChange={handleChange} 
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                            style={{ fontSize: '16px' }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bairro
                          </label>
                          <input 
                            name="endereco.bairro" 
                            placeholder="Nome do bairro" 
                            value={form.endereco.bairro} 
                            onChange={handleChange} 
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                            style={{ fontSize: '16px' }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cidade
                          </label>
                          <input 
                            name="endereco.cidade" 
                            placeholder="Nome da cidade" 
                            value={form.endereco.cidade} 
                            onChange={handleChange} 
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                            style={{ fontSize: '16px' }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                          </label>
                          <input 
                            name="endereco.estado" 
                            placeholder="UF" 
                            value={form.endereco.estado} 
                            onChange={handleChange} 
                            className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                            style={{ fontSize: '16px' }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complemento (opcional)
                        </label>
                        <input 
                          name="endereco.complemento" 
                          placeholder="Apto, bloco, casa, etc." 
                          value={form.endereco.complemento} 
                          onChange={handleChange} 
                          className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:bg-white/80"
                          style={{ fontSize: '16px' }}
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botão de Cadastro */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-lg relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-primary opacity-0 hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10">
                    {loading ? "Criando conta..." : "Cadastrar"}
                  </span>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-center pt-6 border-t border-gray-200/50"
                >
                  <p className="text-gray-600">
                    Já tem uma conta?{" "}
                    <Link 
                      href="/auth/signin" 
                      className="text-primary hover:text-orange-500 transition-colors duration-200 font-semibold hover:underline"
                    >
                      Entrar
                    </Link>
                  </p>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Signup;
