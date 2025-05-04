"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cadastrarUsuario, signIn } from "@/services/authService";
import Link from "next/link";
import { InputMask } from "@react-input/mask";
import PhoneInput from "react-phone-input-2";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "react-phone-input-2/lib/style.css";

const Signup = () => {
  type Genero = "" | "MASCULINO" | "FEMININO" | "OUTRO";

const [form, setForm] = useState<{
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
  }>({
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    if (form.senha !== form.confirmSenha) {
      toast.error("Senhas não coincidem. Verifique e tente novamente.");
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
    }
  };  

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-40 pb-16 px-4">
      <motion.div
        className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-xl dark:bg-black dark:border dark:border-strokedark"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">
          Crie sua conta
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          {/* Campos principais */}
          <input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="input" />
          <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="input" />
          <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} className="input" />
          <input type="password" name="confirmSenha" placeholder="Confirmar senha" value={form.confirmSenha} onChange={handleChange} className="input" />

          {/* CPF */}
          <InputMask
            mask="999.999.999-99"
            replacement={{ 9: /\d/ }}
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder="CPF"
            className="input"
          />

          {/* Telefone */}
          <PhoneInput
            country={"br"}
            value={form.telefone}
            onChange={(phone) => setForm((prev) => ({ ...prev, telefone: `+${phone}` }))}
            inputClass="!w-full !input"
            inputStyle={{ borderRadius: "0.375rem" }}
          />

          {/* Data de nascimento */}
          <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} className="input" />

          {/* Gênero */}
          <select name="genero" value={form.genero} onChange={handleChange} className="input">
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="OUTRO">Outro</option>
          </select>

          {/* Botão para expandir Endereço */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary font-semibold flex items-center gap-1"
            >
              Endereço {showAddress ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {/* Campos de Endereço expandido */}
          <AnimatePresence>
            {showAddress && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <InputMask
                  mask="99999-999"
                  replacement={{ 9: /\d/ }}
                  name="endereco.cep"
                  value={form.endereco.cep}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({ ...prev, endereco: { ...prev.endereco, cep: value } }));
                    const cepSemMascara = value.replace(/\D/g, "");
                    if (cepSemMascara.length === 8) buscarEndereco(cepSemMascara);
                  }}
                  placeholder="CEP"
                  className="input"
                />
                <input name="endereco.rua" placeholder="Rua" value={form.endereco.rua} onChange={handleChange} className="input" />
                <input name="endereco.numero" placeholder="Número" value={form.endereco.numero} onChange={handleChange} className="input" />
                <input name="endereco.bairro" placeholder="Bairro" value={form.endereco.bairro} onChange={handleChange} className="input" />
                <input name="endereco.cidade" placeholder="Cidade" value={form.endereco.cidade} onChange={handleChange} className="input" />
                <input name="endereco.estado" placeholder="Estado" value={form.endereco.estado} onChange={handleChange} className="input" />
                <input name="endereco.complemento" placeholder="Complemento" value={form.endereco.complemento} onChange={handleChange} className="input" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão */}
          <button type="submit" className="mt-4 w-full rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-primary">
            Cadastrar
          </button>
        </form>

        <p className="mt-6 text-center">
          Já tem uma conta?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>

      </motion.div>
    </section>
  );
};

export default Signup;
