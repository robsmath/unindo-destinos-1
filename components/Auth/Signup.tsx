"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { cadastrarUsuario } from "@/services/authService";
import Link from "next/link";
import { InputMask } from "@react-input/mask";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const Signup = () => {
  const [form, setForm] = useState({
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
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
      const data = await response.json();

      if (data.erro) return;

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
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.senha !== form.confirmSenha) {
      alert("Senhas não coincidem");
      return;
    }

    const payload = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      cpf: form.cpf,
      telefone: form.telefone,
      genero: form.genero,
      dataNascimento: form.dataNascimento,
      preferencias: form.preferencias,
      endereco: form.endereco,
    };

    try {
      await cadastrarUsuario(payload);
      alert("Usuário cadastrado com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar usuário");
      console.error(error);
    }
  };

  return (
<section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-96 pb-16 px-4">
      <motion.div
        className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-xl dark:bg-black dark:border dark:border-strokedark"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">Crie sua conta</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} className="input" />
          <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="input" />
          <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} className="input" />
          <input type="password" name="confirmSenha" placeholder="Confirmar senha" value={form.confirmSenha} onChange={handleChange} className="input" />

          <InputMask
            mask="999.999.999-99"
            replacement={{ 9: /\d/ }}
            showMask
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder="CPF"
            className="input"
          />

          <PhoneInput
            country={'br'}
            value={form.telefone}
            onChange={(phone) => setForm({ ...form, telefone: `+${phone}` })}
            inputClass="!w-full !input"
            inputStyle={{ borderRadius: "0.375rem" }}
            inputProps={{
              name: 'telefone',
              required: true,
              autoFocus: false,
            }}
          />

          <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} className="input" />

          <select name="genero" value={form.genero} onChange={handleChange} className="input">
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="OUTRO">Outro</option>
          </select>

          <InputMask
            mask="99999-999"
            replacement={{ 9: /\d/ }}
            showMask
            name="endereco.cep"
            value={form.endereco.cep}
            onChange={(e) => {
              const cep = e.target.value;
              setForm((prev) => ({
                ...prev,
                endereco: { ...prev.endereco, cep },
              }));

              const cepLimpo = cep.replace(/\D/g, "");
              if (cepLimpo.length === 8) {
                buscarEndereco(cepLimpo);
              }
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

          <select
            name="preferencias.0.estiloViagem"
            value={form.preferencias[0].estiloViagem}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                preferencias: [{ estiloViagem: e.target.value }],
              }))
            }
            className="input"
          >
            <option value="AVENTURA">Aventura</option>
            <option value="CULTURAL">Cultural</option>
            <option value="RELAXAMENTO">Relaxamento</option>
            <option value="GASTRONOMIA">Gastronomia</option>
            <option value="ROMANTICO">Romântico</option>
          </select>

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-primaryho"
          >
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
