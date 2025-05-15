"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PetDTO } from "@/models/PetDTO";
import { cadastrarPet, editarPet, getPetById } from "@/services/petService";
import { uploadFotoPerfil } from "@/services/uploadService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FaCamera, FaPaw } from "react-icons/fa";

interface CadastroPetProps {
  petId?: number;
}

const CadastroPet = ({ petId }: CadastroPetProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pet, setPet] = useState<PetDTO>({
    nome: "",
    raca: "",
    porte: "",
    sexo: "MACHO",
    dataNascimento: "",
    descricao: "",
    observacao: "",
    foto: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const carregarPet = async () => {
      if (petId) {
        try {
          const petExistente = await getPetById(petId);
          setPet(petExistente);
        } catch (err) {
          toast.error("Erro ao carregar dados do pet.");
          router.push("/perfil?tab=meus-pets");
        }
      }
    };
    carregarPet();
  }, [petId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleSexoChange = (value: "MACHO" | "FEMEA") => {
    setPet((prev) => ({ ...prev, sexo: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("O arquivo é muito grande. Limite de 2MB.");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadFotoPerfil(file, "PET");
      setPet((prev) => ({ ...prev, foto: imageUrl }));
      toast.success("Foto enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar a imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (petId) {
        await editarPet(petId, pet);
        toast.success("Pet atualizado com sucesso!");
      } else {
        await cadastrarPet(pet);
        toast.success("Pet cadastrado com sucesso!");
      }

      router.push("/profile?tab=meus-pets");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar o pet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-[url(/images/common/beach.jpg)] bg-cover min-h-screen pt-32 pb-16 px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 mx-auto max-w-3xl px-6 py-8 bg-white rounded-lg shadow-lg space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-3xl font-semibold text-center text-black">
          {petId ? "Editar Pet" : "Cadastrar Pet"}
        </h2>

        {/* Avatar do pet */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {pet.foto ? (
              <img
                src={pet.foto}
                alt="Foto do Pet"
                className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-md"
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gray-100 border-4 border-primary shadow-md text-primary text-5xl">
                <FaPaw />
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-md hover:bg-primaryho"
            >
              <FaCamera size={16} />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Campos */}
        <div>
          <label className="font-semibold">Nome <span className="text-red-500">*</span></label>
          <Input name="nome" value={pet.nome} onChange={handleChange} required />
        </div>

        <div>
          <label className="font-semibold">Raça</label>
          <Input name="raca" value={pet.raca} onChange={handleChange} />
        </div>

        <div>
          <label className="font-semibold">Porte</label>
          <Input name="porte" value={pet.porte} onChange={handleChange} />
        </div>

        <div>
          <label className="font-semibold">Sexo</label>
          <Select value={pet.sexo} onValueChange={handleSexoChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MACHO">Macho</SelectItem>
              <SelectItem value="FEMEA">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="font-semibold">Data de Nascimento</label>
          <Input type="date" name="dataNascimento" value={pet.dataNascimento} onChange={handleChange} />
        </div>

        <div>
          <label className="font-semibold">Descrição</label>
          <textarea
            name="descricao"
            value={pet.descricao}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Fale um pouco sobre o pet, personalidade, etc."
          />
        </div>

        <div>
          <label className="font-semibold">Observações</label>
          <textarea
            name="observacao"
            value={pet.observacao}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={2}
            placeholder="Alergias, cuidados especiais, etc."
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full mt-4 text-base">
          {saving ? "Salvando..." : petId ? "Salvar Alterações" : "Cadastrar Pet"}
        </Button>
      </motion.form>
    </section>
  );
};

export default CadastroPet;
