"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getUsuarioLogado, updateUsuarioLogado } from "@/services/userService";
import { UsuarioDTO } from "@/models/UsuarioDTO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { InputMask } from "@react-input/mask";
import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import "react-phone-input-2/lib/style.css";

const PersonalDataForm = () => {
  const { atualizarFotoPerfil } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userResult = await getUsuarioLogado();
      setUserData({
        ...userResult,
        cpf: userResult.cpf ?? "",
        dataNascimento: userResult.dataNascimento ? userResult.dataNascimento.split("T")[0] : "",
        endereco: {
          ...userResult.endereco!,
          cep: userResult.endereco?.cep ?? "",
        },
      });

      if (userResult.fotoPerfil) {
        atualizarFotoPerfil(userResult.fotoPerfil);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do usuário.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buscarEndereco = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setUserData((prev) => prev && ({
          ...prev,
          endereco: {
            ...prev.endereco!,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          },
        }));
      }
    } catch (error) {
      toast.error("Erro ao buscar endereço.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      const { name, value } = e.target;
      setUserData({
        ...userData,
        endereco: {
          ...userData.endereco!,
          [name]: value,
        },
      });

      if (name === "cep") {
        const cepLimpo = value.replace(/\D/g, "");
        if (cepLimpo.length === 8) buscarEndereco(cepLimpo);
      }
    }
  };

  const handleGeneroChange = (value: "" | "MASCULINO" | "FEMININO" | "OUTRO") => {
    if (userData) setUserData({ ...userData, genero: value });
  };

  const handlePhoneChange = (phone: string) => {
    if (userData) setUserData({ ...userData, telefone: `+${phone}` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (userData) {
        await updateUsuarioLogado({
          ...userData,
          cpf: userData.cpf.replace(/\D/g, ""),
          endereco: {
            ...userData.endereco!,
            cep: userData.endereco?.cep?.replace(/\D/g, "") ?? "",
          },
        });
        router.refresh();
        toast.success("Seus dados foram atualizados com sucesso!", { position: "top-center" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar os dados. Tente novamente.", { position: "top-center" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const formatCpfMask = (cpf: string) => {
    if (!cpf) return "";
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) return "";
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCepMask = (cep: string) => {
    if (!cep) return "";
    const cleaned = cep.replace(/\D/g, "");
    if (cleaned.length !== 8) return "";
    return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 max-w-2xl mx-auto text-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <label className="font-semibold">Nome <span className="text-red-500">*</span></label>
        <Input name="nome" value={userData?.nome ?? ""} onChange={handleChange} />
      </div>

      <div>
        <label className="font-semibold">Email <span className="text-red-500">*</span></label>
        <Input type="email" name="email" value={userData?.email ?? ""} onChange={handleChange} />
      </div>

      <div>
        <label className="font-semibold">Telefone <span className="text-red-500">*</span></label>
        <PhoneInput
          country="br"
          value={userData?.telefone?.replace("+", "") ?? ""}
          onChange={handlePhoneChange}
          inputClass="!w-full !input"
          inputStyle={{ borderRadius: "0.375rem", fontSize: "1rem" }}
          placeholder="Ex: +55 (31) 98765-4321"
        />
      </div>

      <div>
        <label className="font-semibold">Data de Nascimento <span className="text-red-500">*</span></label>
        <Input type="date" name="dataNascimento" value={userData?.dataNascimento ?? ""} onChange={handleChange} />
      </div>

      <div>
        <label className="font-semibold">Gênero <span className="text-red-500">*</span></label>
        <Select value={userData?.genero ?? ""} onValueChange={handleGeneroChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MASCULINO">Masculino</SelectItem>
            <SelectItem value="FEMININO">Feminino</SelectItem>
            <SelectItem value="OUTRO">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="font-semibold">CPF <span className="text-red-500">*</span></label>
        <InputMask
          mask="999.999.999-99"
          replacement={{ 9: /\d/ }}
          showMask
          name="cpf"
          value={formatCpfMask(userData?.cpf ?? "")}
          onChange={handleChange}
          className="input w-full border rounded p-2 text-base"
          placeholder="CPF"
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          className="flex items-center gap-2 font-semibold text-primary"
          onClick={() => setShowAddress(!showAddress)}
        >
          Endereço {showAddress ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        <AnimatePresence>
          {showAddress && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden space-y-4 mt-4"
            >
              {["cep", "rua", "numero", "complemento", "bairro", "cidade", "estado"].map((name) => (
                <div key={name}>
                  <label className="font-semibold capitalize">{name}</label>
                  {name === "cep" ? (
                    <InputMask
                      mask="99999-999"
                      replacement={{ 9: /\d/ }}
                      showMask
                      name="cep"
                      value={formatCepMask(userData?.endereco?.cep ?? "")}
                      onChange={handleEnderecoChange}
                      className="input w-full border rounded p-2 text-base"
                      placeholder="CEP"
                    />
                  ) : (
                    <Input
                      type="text"
                      name={name}
                      value={userData?.endereco?.[name as keyof typeof userData.endereco] ?? ""}
                      onChange={handleEnderecoChange}
                      className="text-base"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button type="submit" disabled={saving} className="w-full mt-6 text-base">
        {saving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </motion.form>
  );
};

export default PersonalDataForm;
