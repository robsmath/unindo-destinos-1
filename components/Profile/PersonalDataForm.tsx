"use client";

import { useEffect, useState } from "react";
import { usePerfil } from "@/app/context/PerfilContext";
import { updateUsuarioLogado } from "@/services/userService";
import { UsuarioDTO, EnderecoDTO } from "@/models/UsuarioDTO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import "react-phone-input-2/lib/style.css";

interface ValidationErrors {
  [key: string]: string;
}

const PersonalDataForm = () => {
  const router = useRouter();
  const { usuario, carregarUsuario } = usePerfil();
  const [userData, setUserData] = useState<UsuarioDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Função para anunciar para leitores de tela
  const announceToScreenReader = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  };

  // Função para validar campos em tempo real
  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'nome':
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
        return '';
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email inválido';
        return '';      case 'telefone':
        if (!value.trim()) return 'Telefone é obrigatório';
        if (value.replace(/\D/g, '').length < 10) return 'Telefone deve ter pelo menos 10 dígitos';
        return '';
      case 'cpf':
        if (!value.trim()) return 'CPF é obrigatório';
        const cpfLimpo = value.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) return 'CPF deve ter 11 dígitos';
        // Validação básica de CPF
        if (!/^\d{11}$/.test(cpfLimpo)) return 'CPF inválido';
        if (/^(\d)\1+$/.test(cpfLimpo)) return 'CPF inválido';
        return '';
      case 'dataNascimento':
        if (!value.trim()) return 'Data de nascimento é obrigatória';
        const hoje = new Date();
        const nascimento = new Date(value);
        if (nascimento >= hoje) return 'Data de nascimento deve ser anterior à data atual';
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        if (idade < 18) return 'Você deve ter pelo menos 18 anos';
        return '';
      case 'genero':
        if (!value.trim()) return 'Gênero é obrigatório';
        return '';
      case 'cep':
        if (!value.trim()) return 'CEP é obrigatório';
        if (value.replace(/\D/g, '').length !== 8) return 'CEP deve ter 8 dígitos';
        return '';
      case 'rua':
        if (!value.trim()) return 'Endereço é obrigatório';
        return '';
      case 'cidade':
        if (!value.trim()) return 'Cidade é obrigatória';
        return '';
      case 'estado':
        if (!value.trim()) return 'Estado é obrigatório';
        return '';
      default:
        return '';
    }
  };

  // Função para validar todos os campos
  const validateAllFields = (data: UsuarioDTO): ValidationErrors => {
    const errors: ValidationErrors = {};
      // Validar campos básicos
    const basicFields = ['nome', 'email', 'telefone', 'cpf', 'dataNascimento', 'genero'];
    basicFields.forEach(field => {
      const value = data[field as keyof UsuarioDTO] as string || '';
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    // Validar endereço se existir
    if (data.endereco) {
      const addressFields = ['cep', 'rua', 'cidade', 'estado'];
      addressFields.forEach(field => {
        const value = data.endereco![field as keyof EnderecoDTO] as string || '';
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      });
    }

    return errors;
  };

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) return;

    setIsAddressLoading(true);
    announceToScreenReader("Buscando endereço...");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        announceToScreenReader("CEP não encontrado");
        return;
      }

      if (userData) {
        const newEndereco: EnderecoDTO = {
          ...userData.endereco,
          cep: cepLimpo,
          rua: data.logradouro || userData.endereco?.rua || '',
          cidade: data.localidade || userData.endereco?.cidade || '',
          estado: data.uf || userData.endereco?.estado || '',
          bairro: data.bairro || userData.endereco?.bairro || '',
          numero: userData.endereco?.numero || '',
          complemento: userData.endereco?.complemento || ''
        };
        
        const newUserData = {
          ...userData,
          endereco: newEndereco
        };
        
        setUserData(newUserData);
        announceToScreenReader("Endereço preenchido automaticamente");
        
        // Limpar erros dos campos preenchidos
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.rua;
          delete newErrors.cidade;
          delete newErrors.estado;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar endereço");
      announceToScreenReader("Erro ao buscar endereço");
    } finally {
      setIsAddressLoading(false);
    }
  };
  useEffect(() => {
    // Aguarda os dados do PerfilContext, só chama carregarUsuario se não tiver dados
    const carregarDados = async () => {
      if (!usuario) {
        try {
          setLoading(true);
          await carregarUsuario();
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          toast.error("Erro ao carregar dados do usuário");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    carregarDados();
  }, [usuario, carregarUsuario]);

  useEffect(() => {
    if (usuario) {
      // Garantir que o endereço tenha a estrutura correta
      const enderecoCompleto: EnderecoDTO = {
        cep: usuario.endereco?.cep || '',
        rua: usuario.endereco?.rua || '',
        numero: usuario.endereco?.numero || '',
        complemento: usuario.endereco?.complemento || '',
        bairro: usuario.endereco?.bairro || '',
        cidade: usuario.endereco?.cidade || '',
        estado: usuario.endereco?.estado || ''
      };

      setUserData({
        ...usuario,
        endereco: enderecoCompleto
      });
    }
  }, [usuario]);

  const handleInputChange = (field: string, value: string) => {
    if (!userData) return;

    // Verificar se é campo de endereço
    const addressFields = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado'];
    
    if (addressFields.includes(field)) {
      const newEndereco = {
        ...userData.endereco,
        [field]: value
      } as EnderecoDTO;

      const newUserData = {
        ...userData,
        endereco: newEndereco
      };
      setUserData(newUserData);
    } else {
      // Campo básico do usuário
      const newUserData = { ...userData, [field]: value };
      setUserData(newUserData);
    }

    // Marcar campo como tocado
    setTouchedFields(prev => new Set([...prev, field]));

    // Validar campo em tempo real
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Se for CEP, buscar endereço
    if (field === 'cep' && value.replace(/\D/g, '').length === 8) {
      buscarEnderecoPorCep(value);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) return;

    // Validar todos os campos
    const errors = validateAllFields(userData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Por favor, corrija os erros no formulário");
      announceToScreenReader("Existem erros no formulário que precisam ser corrigidos");
      return;
    }    setSaving(true);
    
    try {
      await updateUsuarioLogado(userData);
      await carregarUsuario(true); // Força o recarregamento
      
      toast.success("Dados atualizados com sucesso!");
      announceToScreenReader("Dados atualizados com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar dados");
      announceToScreenReader("Erro ao atualizar dados");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando dados do perfil...</span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Erro ao carregar dados do usuário.</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
          aria-label="Recarregar página para tentar novamente"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <>      {/* Anúncios para leitores de tela */}
      <div aria-live={"polite" as const} aria-atomic={true} className="sr-only">
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
          <div className="text-sm text-gray-500">
            * Campos obrigatórios
          </div>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          role="form"
          aria-label="Formulário de dados pessoais"
        >
          {/* Nome Completo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label 
              htmlFor="nome" 
              className="block text-sm font-medium text-gray-700"
            >
              Nome Completo *
            </label>
            <div className="relative">
              <Input
                id="nome"
                type="text"
                value={userData.nome || ""}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                className={`w-full ${
                  validationErrors.nome ? "border-red-500 focus:border-red-500" : ""
                }`}
                placeholder="Digite seu nome completo"
                required
                aria-required="true"
                aria-invalid={!!validationErrors.nome}
                aria-describedby={validationErrors.nome ? "nome-error" : undefined}
              />
              <AnimatePresence>
                {touchedFields.has("nome") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {validationErrors.nome ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.nome && userData.nome.length >= 2 ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {validationErrors.nome && (
              <motion.p
                id="nome-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.nome}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email *
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={userData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full ${
                  validationErrors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
                placeholder="Digite seu email"
                required
                aria-required="true"
                aria-invalid={!!validationErrors.email}
                aria-describedby={validationErrors.email ? "email-error" : undefined}
              />
              <AnimatePresence>
                {touchedFields.has("email") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {validationErrors.email ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email) ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>            {validationErrors.email && (
              <motion.p
                id="email-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.email}
              </motion.p>
            )}
            {/* Status de verificação do email */}
            {userData.emailVerificado ? (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-green-600 flex items-center gap-2"
              >
                <FaCheck className="text-green-500" />
                Email verificado
              </motion.p>
            ) : (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-600 flex items-center gap-2"
              >
                <FaTimes className="text-red-500" />
                Email não verificado -{" "}
                <Link 
                  href="/verificacao-conta" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Verificar agora
                </Link>
              </motion.p>
            )}
          </motion.div>

          {/* Telefone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label 
              htmlFor="telefone" 
              className="block text-sm font-medium text-gray-700"
            >
              Telefone *
            </label>
            <div className="relative">
              <PhoneInput
                country={'br'}
                value={userData.telefone || ""}
                onChange={(phone) => handleInputChange("telefone", phone)}
                inputClass={`w-full ${
                  validationErrors.telefone ? "border-red-500 focus:border-red-500" : ""
                }`}
                containerClass="w-full"
                buttonClass="border-gray-300"
                inputProps={{
                  id: "telefone",
                  required: true,
                  'aria-required': 'true',
                  'aria-invalid': !!validationErrors.telefone,
                  'aria-describedby': validationErrors.telefone ? "telefone-error" : undefined
                }}
              />
              <AnimatePresence>
                {touchedFields.has("telefone") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    {validationErrors.telefone ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.telefone && userData.telefone.replace(/\D/g, '').length >= 10 ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>            {validationErrors.telefone && (
              <motion.p
                id="telefone-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.telefone}
              </motion.p>
            )}
            {/* Status de verificação do telefone */}
            {userData.telefoneVerificado ? (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-green-600 flex items-center gap-2"
              >
                <FaCheck className="text-green-500" />
                Telefone verificado
              </motion.p>
            ) : (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-600 flex items-center gap-2"
              >
                <FaTimes className="text-red-500" />
                Telefone não verificado -{" "}
                <Link 
                  href="/verificacao-conta" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Verificar agora
                </Link>
              </motion.p>
            )}</motion.div>          {/* CPF */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-2"
          >
            <label 
              htmlFor="cpf" 
              className="block text-sm font-medium text-gray-700"
            >
              CPF *
            </label>
            <div className="relative">
              <Input
                id="cpf"
                type="text"
                value={userData.cpf ? 
                  userData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : 
                  ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const cpfLimpo = value.replace(/\D/g, "");
                  if (cpfLimpo.length <= 11) {
                    handleInputChange("cpf", cpfLimpo);
                  }
                }}
                className={`w-full ${
                  validationErrors.cpf ? "border-red-500 focus:border-red-500" : ""
                }`}
                placeholder="000.000.000-00"
                maxLength={14}
                required
                aria-required="true"
                aria-invalid={!!validationErrors.cpf}
                aria-describedby={validationErrors.cpf ? "cpf-error" : undefined}
              />
              <AnimatePresence>
                {touchedFields.has("cpf") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {validationErrors.cpf ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.cpf && userData.cpf.length === 11 ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {validationErrors.cpf && (
              <motion.p
                id="cpf-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.cpf}
              </motion.p>
            )}
          </motion.div>

          {/* Data de Nascimento */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <label 
              htmlFor="dataNascimento" 
              className="block text-sm font-medium text-gray-700"
            >
              Data de Nascimento *
            </label>
            <div className="relative">
              <Input
                id="dataNascimento"
                type="date"
                value={userData.dataNascimento ? new Date(userData.dataNascimento).toISOString().split('T')[0] : ""}
                onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                className={`w-full ${
                  validationErrors.dataNascimento ? "border-red-500 focus:border-red-500" : ""
                }`}
                required
                aria-required="true"
                aria-invalid={!!validationErrors.dataNascimento}
                aria-describedby={validationErrors.dataNascimento ? "dataNascimento-error" : undefined}
              />
              <AnimatePresence>
                {touchedFields.has("dataNascimento") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {validationErrors.dataNascimento ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.dataNascimento ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {validationErrors.dataNascimento && (
              <motion.p
                id="dataNascimento-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.dataNascimento}
              </motion.p>
            )}
          </motion.div>

          {/* Gênero */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <label 
              htmlFor="genero" 
              className="block text-sm font-medium text-gray-700"
            >
              Gênero *
            </label>
            <div className="relative">
              <Select
                value={userData.genero || ""}
                onValueChange={(value) => handleInputChange("genero", value)}
                required
              >
                <SelectTrigger 
                  id="genero"
                  className={`w-full ${
                    validationErrors.genero ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  aria-required="true"
                  aria-invalid={!!validationErrors.genero}
                  aria-describedby={validationErrors.genero ? "genero-error" : undefined}
                >
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MASCULINO">Masculino</SelectItem>
                  <SelectItem value="FEMININO">Feminino</SelectItem>
                  <SelectItem value="NAO_BINARIO">Não-binário</SelectItem>
                  <SelectItem value="OUTRO">Outro</SelectItem>
                  <SelectItem value="NAO_TENHO_PREFERENCIA">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
              <AnimatePresence>
                {touchedFields.has("genero") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2"
                  >
                    {validationErrors.genero ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.genero ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {validationErrors.genero && (
              <motion.p
                id="genero-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.genero}
              </motion.p>
            )}
          </motion.div>{/* CEP */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-2"
          >
            <label 
              htmlFor="cep" 
              className="block text-sm font-medium text-gray-700"
            >
              CEP *
            </label>            <div className="relative">
              <Input
                id="cep"
                type="text"
                value={userData.endereco?.cep ? 
                  userData.endereco.cep.replace(/(\d{5})(\d{3})/, "$1-$2") : 
                  ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const cepLimpo = value.replace(/\D/g, "");
                  if (cepLimpo.length <= 8) {
                    handleInputChange("cep", cepLimpo);
                  }
                }}
                className={`w-full ${
                  validationErrors.cep ? "border-red-500 focus:border-red-500" : ""
                }`}
                placeholder="00000-000"
                maxLength={9}
                required
                aria-required="true"
                aria-invalid={!!validationErrors.cep}
                aria-describedby={validationErrors.cep ? "cep-error" : undefined}
              />
              {isAddressLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              )}
              <AnimatePresence>
                {touchedFields.has("cep") && !isAddressLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {validationErrors.cep ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.endereco?.cep && userData.endereco.cep.replace(/\D/g, '').length === 8 ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {validationErrors.cep && (
              <motion.p
                id="cep-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.cep}
              </motion.p>
            )}
          </motion.div>          {/* Endereço */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-2"
          >
            <label 
              htmlFor="rua" 
              className="block text-sm font-medium text-gray-700"
            >
              Endereço *
            </label>
            <div className="relative">
              <Input
                id="rua"
                type="text"
                value={userData.endereco?.rua || ""}
                onChange={(e) => handleInputChange("rua", e.target.value)}
                className={`w-full ${
                  validationErrors.rua ? "border-red-500 focus:border-red-500" : ""
                }`}
                placeholder="Digite seu endereço"
                required
                aria-required="true"
                aria-invalid={!!validationErrors.rua}
                aria-describedby={validationErrors.rua ? "rua-error" : undefined}
              />
              <AnimatePresence>
                {touchedFields.has("rua") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {validationErrors.rua ? (
                      <FaTimes className="text-red-500" />
                    ) : userData.endereco?.rua && userData.endereco.rua.length > 0 ? (
                      <FaCheck className="text-green-500" />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {validationErrors.rua && (
              <motion.p
                id="rua-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {validationErrors.rua}
              </motion.p>
            )}          </motion.div>

          {/* Número e Complemento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95 }}
              className="space-y-2"
            >
              <label 
                htmlFor="numero" 
                className="block text-sm font-medium text-gray-700"
              >
                Número
              </label>
              <div className="relative">
                <Input
                  id="numero"
                  type="text"
                  value={userData.endereco?.numero || ""}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  className="w-full"
                  placeholder="Digite o número"
                />
              </div>
            </motion.div>

            {/* Complemento */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.96 }}
              className="space-y-2"
            >
              <label 
                htmlFor="complemento" 
                className="block text-sm font-medium text-gray-700"
              >
                Complemento
              </label>
              <div className="relative">
                <Input
                  id="complemento"
                  type="text"
                  value={userData.endereco?.complemento || ""}
                  onChange={(e) => handleInputChange("complemento", e.target.value)}
                  className="w-full"
                  placeholder="Apto, bloco, etc. (opcional)"
                />
              </div>
            </motion.div>
          </div>

          {/* Bairro */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.97 }}
            className="space-y-2"
          >
            <label 
              htmlFor="bairro" 
              className="block text-sm font-medium text-gray-700"
            >
              Bairro
            </label>
            <div className="relative">
              <Input
                id="bairro"
                type="text"
                value={userData.endereco?.bairro || ""}
                onChange={(e) => handleInputChange("bairro", e.target.value)}
                className="w-full"
                placeholder="Digite o bairro"
              />
            </div>
          </motion.div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{/* Cidade */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-2"
            >
              <label 
                htmlFor="cidade" 
                className="block text-sm font-medium text-gray-700"
              >
                Cidade *
              </label>
              <div className="relative">
                <Input
                  id="cidade"
                  type="text"
                  value={userData.endereco?.cidade || ""}
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
                  className={`w-full ${
                    validationErrors.cidade ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  placeholder="Digite sua cidade"
                  required
                  aria-required="true"
                  aria-invalid={!!validationErrors.cidade}
                  aria-describedby={validationErrors.cidade ? "cidade-error" : undefined}
                />
                <AnimatePresence>
                  {touchedFields.has("cidade") && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {validationErrors.cidade ? (
                        <FaTimes className="text-red-500" />
                      ) : userData.endereco?.cidade && userData.endereco.cidade.length > 0 ? (
                        <FaCheck className="text-green-500" />
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {validationErrors.cidade && (
                <motion.p
                  id="cidade-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {validationErrors.cidade}
                </motion.p>
              )}
            </motion.div>            {/* Estado */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-2"
            >
              <label 
                htmlFor="estado" 
                className="block text-sm font-medium text-gray-700"
              >
                Estado *
              </label>
              <div className="relative">
                <Select
                  value={userData.endereco?.estado || ""}
                  onValueChange={(value) => handleInputChange("estado", value)}
                  required
                >
                  <SelectTrigger 
                    id="estado"
                    className={`w-full ${
                      validationErrors.estado ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    aria-required="true"
                    aria-invalid={!!validationErrors.estado}
                    aria-describedby={validationErrors.estado ? "estado-error" : undefined}
                  >
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">Acre</SelectItem>
                    <SelectItem value="AL">Alagoas</SelectItem>
                    <SelectItem value="AP">Amapá</SelectItem>
                    <SelectItem value="AM">Amazonas</SelectItem>
                    <SelectItem value="BA">Bahia</SelectItem>
                    <SelectItem value="CE">Ceará</SelectItem>
                    <SelectItem value="DF">Distrito Federal</SelectItem>
                    <SelectItem value="ES">Espírito Santo</SelectItem>
                    <SelectItem value="GO">Goiás</SelectItem>
                    <SelectItem value="MA">Maranhão</SelectItem>
                    <SelectItem value="MT">Mato Grosso</SelectItem>
                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PA">Pará</SelectItem>
                    <SelectItem value="PB">Paraíba</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="PE">Pernambuco</SelectItem>
                    <SelectItem value="PI">Piauí</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="RO">Rondônia</SelectItem>
                    <SelectItem value="RR">Roraima</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="SE">Sergipe</SelectItem>
                    <SelectItem value="TO">Tocantins</SelectItem>
                  </SelectContent>
                </Select>
                <AnimatePresence>
                  {touchedFields.has("estado") && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2"
                    >
                      {validationErrors.estado ? (
                        <FaTimes className="text-red-500" />
                      ) : userData.endereco?.estado && userData.endereco.estado.length > 0 ? (
                        <FaCheck className="text-green-500" />
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {validationErrors.estado && (
                <motion.p
                  id="estado-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {validationErrors.estado}
                </motion.p>
              )}
            </motion.div>
          </div>          {/* Botão de Salvar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-between pt-6"
          >
            <div className="text-sm text-gray-500">
              <Link href="/profile" className="text-blue-600 hover:text-blue-800">
                ← Voltar ao Perfil
              </Link>
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg disabled:opacity-50"
              aria-label={saving ? "Salvando alterações..." : "Salvar alterações dos dados pessoais"}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </>
  );
};

export default PersonalDataForm;
