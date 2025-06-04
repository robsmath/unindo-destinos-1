"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Users, FileText } from "lucide-react";

const PoliticaPrivacidade = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-orange-50 to-blue-100">
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
        
        {/* Floating Security Elements */}
        {[Shield, Lock, Eye, Database, Users].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20"
            style={{
              left: `${15 + (i * 18)}%`,
              top: `${20 + (i * 15)}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + (i * 0.5),
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        {/* Large floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-primary/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* Cabeçalho */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <motion.div
              className="p-4 bg-gradient-to-r from-blue-500 to-primary rounded-2xl shadow-xl"
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(59, 130, 246, 0.3)",
                  "0 15px 40px rgba(234, 88, 12, 0.4)",
                  "0 10px 30px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
              Política de Privacidade
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Sua privacidade é nossa prioridade. Entenda como coletamos, usamos e protegemos seus dados.
          </p>
        </motion.div>

        {/* Conteúdo */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-10 text-gray-700 leading-relaxed space-y-8 text-justify">
          
          <div className="border-l-4 border-blue-500 pl-6 bg-blue-50/50 rounded-r-lg p-4 mb-8">
            <p className="text-blue-800 font-medium">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                1. Informações que Coletamos
              </h2>
              <div className="space-y-3 ml-8">
                <p><strong>Dados de Cadastro:</strong> Nome completo, e-mail, CPF, telefone, data de nascimento, gênero e endereço.</p>
                <p><strong>Perfil de Viagem:</strong> Preferências de viagem, interesses, foto de perfil e informações sobre pets (se aplicável).</p>
                <p><strong>Dados de Uso:</strong> Informações sobre como você utiliza a plataforma, viagens criadas, participações e interações.</p>
                <p><strong>Dados Técnicos:</strong> Endereço IP, tipo de dispositivo, navegador, localização aproximada e cookies.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                2. Como Utilizamos suas Informações
              </h2>
              <div className="space-y-3 ml-8">
                <p><strong>Conexão de Viajantes:</strong> Para encontrar pessoas com interesses similares e recomendar viagens compatíveis.</p>
                <p><strong>Geração de Roteiros:</strong> Utilizamos IA para criar roteiros personalizados baseados em suas preferências.</p>
                <p><strong>Comunicação:</strong> Para enviar notificações sobre viagens, mensagens de outros usuários e atualizações da plataforma.</p>
                <p><strong>Segurança:</strong> Para verificar identidades, prevenir fraudes e manter a segurança da comunidade.</p>
                <p><strong>Melhoria da Plataforma:</strong> Para analisar tendências de uso e melhorar nossos serviços.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                3. Compartilhamento de Informações
              </h2>
              <div className="space-y-3 ml-8">
                <p><strong>Com Outros Usuários:</strong> Seu perfil é visível apenas para usuários logados e verificados. Você controla a visibilidade.</p>
                <p><strong>Em Viagens:</strong> Ao participar de uma viagem, seus dados básicos são compartilhados com outros participantes.</p>
                <p><strong>Não Vendemos Dados:</strong> Nunca vendemos suas informações pessoais para terceiros.</p>
                <p><strong>Casos Especiais:</strong> Podemos compartilhar dados quando exigido por lei ou para proteger direitos legais.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                4. Proteção de Dados
              </h2>
              <div className="space-y-3 ml-8">
                <p><strong>Criptografia:</strong> Utilizamos HTTPS e criptografia de ponta para proteger suas informações.</p>
                <p><strong>Acesso Restrito:</strong> Apenas funcionários autorizados têm acesso aos dados pessoais.</p>
                <p><strong>Monitoramento:</strong> Sistemas de segurança monitoram tentativas de acesso não autorizado.</p>
                <p><strong>Backup Seguro:</strong> Realizamos backups seguros e regulares dos dados.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                5. Seus Direitos
              </h2>
              <div className="space-y-3 ml-8">
                <p><strong>Acesso:</strong> Você pode visualizar e baixar seus dados a qualquer momento no seu perfil.</p>
                <p><strong>Correção:</strong> Pode alterar informações incorretas diretamente na plataforma.</p>
                <p><strong>Exclusão:</strong> Pode solicitar a exclusão de sua conta e dados associados.</p>
                <p><strong>Portabilidade:</strong> Pode solicitar seus dados em formato legível por máquina.</p>
                <p><strong>Visibilidade:</strong> Pode desativar a visibilidade do seu perfil a qualquer momento.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies e Tecnologias</h2>
              <div className="space-y-3 ml-8">
                <p>Utilizamos cookies para melhorar sua experiência, manter login e personalizar conteúdo. Você pode gerenciar cookies nas configurações do navegador.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Retenção de Dados</h2>
              <div className="space-y-3 ml-8">
                <p>Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão, alguns dados podem ser mantidos por período legal necessário.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Menores de Idade</h2>
              <div className="space-y-3 ml-8">
                <p>Nossa plataforma é destinada a maiores de 18 anos. Não coletamos intencionalmente dados de menores.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Alterações na Política</h2>
              <div className="space-y-3 ml-8">
                <p>Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por e-mail ou na plataforma.</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contato</h2>
              <div className="space-y-3 ml-8">
                <p>Para dúvidas sobre privacidade, entre em contato conosco através da seção de Suporte na plataforma.</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
            <p className="text-primary font-medium text-center">
              <FileText className="w-5 h-5 inline mr-2" />
              Esta política está em conformidade com a LGPD (Lei Geral de Proteção de Dados)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoliticaPrivacidade; 