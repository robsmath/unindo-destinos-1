"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  Users, 
  MapPin, 
  Calendar,
  Shield,
  Sparkles,
  MessageCircle,
  Settings,
  Heart,
  Globe,
  Zap
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Como funciona o Unindo Destinos?",
    answer: "O Unindo Destinos é uma plataforma que conecta viajantes com interesses em comum, permitindo que você crie viagens, encontre companhias e até gere roteiros personalizados com ajuda de inteligência artificial.",
    category: "Geral",
    icon: <Globe className="w-5 h-5" />
  },
  {
    id: "2",
    question: "Preciso criar uma conta para usar a plataforma?",
    answer: "Sim. Para criar ou participar de viagens, interagir com outros usuários e gerar roteiros, é necessário ter uma conta com e-mail e telefone verificados.",
    category: "Conta",
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: "3",
    question: "Como encontro pessoas com interesses parecidos?",
    answer: "Na seção \"Encontre Pessoas\", você pode aplicar filtros como idade, gênero, valor médio por viagem e preferências para localizar perfis compatíveis com o seu estilo de viagem.",
    category: "Pessoas",
    icon: <Users className="w-5 h-5" />
  },
  {
    id: "4",
    question: "Como crio uma nova viagem?",
    answer: "Acesse \"Minhas Viagens\" e clique em \"Criar Viagem\". Preencha os campos obrigatórios como destino, tipo de viagem, datas e preferências. Após salvar, a viagem ficará inicialmente com status RASCUNHO, e só será exibida nas buscas quando estiver como PENDENTE.",
    category: "Viagens",
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: "5",
    question: "Quais são os status possíveis de uma viagem?",
    answer: "RASCUNHO: Viagem recém-criada, ainda oculta da busca pública.\n\nPENDENTE: Viagem publicada e visível na busca de viagens.\n\nCONFIRMADA: Viagem organizada, com participantes definidos.\n\nCANCELADA: Viagem encerrada manualmente pelo criador.\n\nCONCLUÍDA: Viagem já realizada, mantida como histórico.",
    category: "Viagens",
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: "6",
    question: "Como funciona o convite para uma viagem?",
    answer: "Apenas o criador da viagem pode convidar outras pessoas para participar. O convite é enviado por e-mail e o usuário pode aceitar ou recusar na Central de Solicitações.",
    category: "Convites",
    icon: <MessageCircle className="w-5 h-5" />
  },
  {
    id: "7",
    question: "Posso solicitar participação em uma viagem de outra pessoa?",
    answer: "Sim. Caso veja uma viagem interessante, você pode solicitar participação. A decisão de aceitar ou recusar é do criador da viagem.",
    category: "Convites",
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: "8",
    question: "Quem pode ver meu perfil?",
    answer: "Somente usuários logados têm acesso ao seu perfil, e mesmo assim, apenas informações básicas são exibidas. Além disso, você pode controlar a visibilidade do seu perfil, podendo desativá-lo temporariamente e reativar quando quiser.",
    category: "Privacidade",
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: "9",
    question: "Como funciona a geração de roteiros com IA?",
    answer: "Você pode gerar um roteiro personalizado para sua viagem com base no destino, tipo de viagem, número de dias e preferências. A geração com IA é limitada a 3 tentativas por viagem, então recomendamos utilizá-la quando os detalhes já estiverem definidos — principalmente o número de participantes.",
    category: "Roteiros",
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: "10",
    question: "Posso editar o roteiro gerado?",
    answer: "Sim. Após gerado, o roteiro pode ser editado manualmente. Você pode ajustar os dias, adicionar observações e até exportar em PDF ou enviar por e-mail.",
    category: "Roteiros",
    icon: <Settings className="w-5 h-5" />
  },
  {
    id: "11",
    question: "Posso convidar outras pessoas para uma viagem da qual participo?",
    answer: "Não. Apenas o criador da viagem pode enviar convites ou aceitar solicitações de participação.",
    category: "Convites",
    icon: <Users className="w-5 h-5" />
  },
  {
    id: "12",
    question: "Como denuncio um usuário?",
    answer: "Na página de participantes da viagem, clique no ícone de denúncia ao lado do usuário desejado. Um formulário será exibido para que você descreva a situação. Todas as denúncias são avaliadas com atenção.",
    category: "Segurança",
    icon: <Shield className="w-5 h-5" />
  }
];

const categories = [
  "Todos",
  "Geral",
  "Conta",
  "Viagens",
  "Pessoas",
  "Convites",
  "Roteiros",
  "Privacidade",
  "Segurança"
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const formatAnswer = (answer: string) => {
    return answer.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100">
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
        
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${4 + (i % 3) * 2} h-${4 + (i % 3) * 2} rounded-full`}
            style={{
              background: `linear-gradient(45deg, ${
                i % 2 === 0 ? 'rgba(234, 88, 12, 0.1)' : 'rgba(249, 115, 22, 0.1)'
              }, transparent)`,
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i * 8)}%`,
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
        ))}

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

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`question-${i}`}
            className="absolute text-primary/20"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${25 + (i * 12)}%`,
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
            <HelpCircle className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="p-4 bg-gradient-to-r from-primary to-orange-500 rounded-2xl shadow-xl"
              animate={{ 
                boxShadow: [
                  "0 10px 30px rgba(234, 88, 12, 0.3)",
                  "0 15px 40px rgba(249, 115, 22, 0.4)",
                  "0 10px 30px rgba(234, 88, 12, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <HelpCircle className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Perguntas Frequentes
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Encontre respostas rápidas para suas dúvidas sobre como usar o Unindo Destinos 
            e criar experiências de viagem inesquecíveis
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
          <div className="relative mb-8 max-w-2xl mx-auto">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-2xl blur-xl"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl overflow-hidden">
              <div className="flex items-center p-6">
                <Search className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Digite sua pergunta ou palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-lg"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchTerm("")}
                    className="ml-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.05) }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-xl shadow-primary/25"
                    : "bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80 border border-white/30"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <AnimatePresence mode="wait">
            {filteredFAQ.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/30 p-12 shadow-xl max-w-lg mx-auto">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Search className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">Nenhum resultado encontrado</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Não encontramos perguntas que correspondam à sua busca. 
                    Tente usar palavras-chave diferentes ou selecione outra categoria.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid gap-4"
              >
                {filteredFAQ.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <motion.button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-6 text-left flex items-center justify-between group"
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <motion.div
                          className="p-3 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-xl border border-primary/20"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.icon}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors duration-300">
                            {item.question}
                          </h3>
                          <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: openItems.has(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="ml-4"
                      >
                        <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {openItems.has(item.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <motion.div
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -10, opacity: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100"
                            >
                              <div className="text-gray-700 leading-relaxed">
                                {formatAnswer(item.answer)}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
            
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-3xl border border-primary/10 p-12 backdrop-blur-sm">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Não encontrou o que procurava?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Nossa equipe está sempre pronta para ajudar! Entre em contato conosco 
              e teremos o prazer de esclarecer suas dúvidas.
            </p>
            
            <motion.a
              href="mailto:contato@unindodestinos.com.br"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-orange-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5" />
              Entre em Contato
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
