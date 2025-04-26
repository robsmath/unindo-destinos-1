"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getUserById, updateUser } from "@/services/userService";
import { UsuarioDTO } from "@/models/UsuarioDTO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const PersonalDataForm = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId === null) {
      setError("Usuário não encontrado. Faça login novamente.");
      setLoading(false);
    } else if (userId !== undefined) {
      fetchUserData();
    }
  }, [userId]);
  

  const fetchUserData = async () => {
    try {
      const data = await getUserById(userId!);
      setUserData(data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setError("Erro ao carregar dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData?.endereco) {
      setUserData({
        ...userData,
        endereco: {
          ...userData.endereco,
          [e.target.name]: e.target.value,
        }
      });
    }
  };

  const handleGeneroChange = (value: string) => {
    if (userData) {
      setUserData({
        ...userData,
        genero: value as UsuarioDTO["genero"],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (userData) {
        await updateUser(userId!, userData);
        router.refresh();
        alert("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setError("Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto">
      {/* Dados pessoais */}
      <Input
        type="text"
        name="nome"
        placeholder="Nome"
        value={userData?.nome || ""}
        onChange={handleChange}
      />
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={userData?.email || ""}
        onChange={handleChange}
      />
      <Input
        type="text"
        name="telefone"
        placeholder="Telefone"
        value={userData?.telefone || ""}
        onChange={handleChange}
      />
      <Input
        type="date"
        name="dataNascimento"
        placeholder="Data de Nascimento"
        value={userData?.dataNascimento || ""}
        onChange={handleChange}
      />
      <Select value={userData?.genero || ""} onValueChange={handleGeneroChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="MASCULINO">Masculino</SelectItem>
          <SelectItem value="FEMININO">Feminino</SelectItem>
          <SelectItem value="OUTRO">Outro</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        name="cpf"
        placeholder="CPF"
        value={userData?.cpf || ""}
        onChange={handleChange}
      />
      <Input
        type="text"
        name="fotoPerfil"
        placeholder="Foto de Perfil (URL)"
        value={userData?.fotoPerfil || ""}
        onChange={handleChange}
      />

      {/* Endereço */}
      <h3 className="text-lg font-semibold mt-6">Endereço</h3>
      <Input
        type="text"
        name="cep"
        placeholder="CEP"
        value={userData?.endereco?.cep || ""}
        onChange={handleEnderecoChange}
      />
      <Input
        type="text"
        name="rua"
        placeholder="Rua"
        value={userData?.endereco?.rua || ""}
        onChange={handleEnderecoChange}
      />
      <Input
        type="text"
        name="numero"
        placeholder="Número"
        value={userData?.endereco?.numero || ""}
        onChange={handleEnderecoChange}
      />
      <Input
        type="text"
        name="complemento"
        placeholder="Complemento"
        value={userData?.endereco?.complemento || ""}
        onChange={handleEnderecoChange}
      />
      <Input
        type="text"
        name="bairro"
        placeholder="Bairro"
        value={userData?.endereco?.bairro || ""}
        onChange={handleEnderecoChange}
      />
      <Input
        type="text"
        name="cidade"
        placeholder="Cidade"
        value={userData?.endereco?.cidade || ""}
        onChange={handleEnderecoChange}
      />
      <Input
        type="text"
        name="estado"
        placeholder="Estado"
        value={userData?.endereco?.estado || ""}
        onChange={handleEnderecoChange}
      />

      <Button type="submit" disabled={saving} className="mt-4">
        {saving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
};

export default PersonalDataForm;
