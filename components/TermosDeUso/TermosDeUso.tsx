"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const TermosDeUso = () => {
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
            key={`document-${i}`}
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
            <FileText className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
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
              <FileText className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Termos de Uso
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Leia atentamente os termos antes de utilizar a plataforma Unindo Destinos.
          </p>
        </motion.div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-10 text-gray-700 leading-relaxed space-y-8 text-justify">
          <p><strong>1. Aceitação dos Termos:</strong> Ao utilizar o Unindo Destinos, você concorda com estes Termos de Uso. Caso não concorde, interrompa imediatamente o uso da plataforma.</p>

          <p><strong>2. Objetivo:</strong> A plataforma visa conectar viajantes com interesses em comum, permitindo criação de viagens colaborativas e geração de roteiros personalizados com IA.</p>

          <p><strong>3. Cadastro e Uso:</strong> O usuário deve fornecer dados verdadeiros e manter sua conta segura. O uso da conta é pessoal e intransferível.</p>

          <p><strong>4. Visibilidade do Perfil:</strong> Seu perfil só é visível para usuários logados. Você pode ativar ou desativar a visibilidade do seu perfil a qualquer momento.</p>

          <p><strong>5. Viagens e Participações:</strong> Apenas usuários verificados podem criar viagens ou solicitar participação. O criador gerencia os convites e aprovações.</p>

          <p><strong>6. Status da Viagem:</strong><br />
            • <strong>RASCUNHO</strong>: invisível nas buscas.<br />
            • <strong>PENDENTE</strong>: visível nas buscas.<br />
            • <strong>CONFIRMADA</strong>: com participantes definidos.<br />
            • <strong>CANCELADA</strong>: encerrada manualmente.<br />
            • <strong>CONCLUÍDA</strong>: viagem finalizada.
          </p>

          <p><strong>7. Roteiros com IA:</strong> Cada viagem permite até 3 gerações de roteiro. Use essa funcionalidade quando a viagem estiver mais definida, especialmente o número de participantes.</p>

          <p><strong>8. Conduta:</strong> É proibido usar a plataforma para fins ofensivos, ilegais ou discriminatórios. Condutas inadequadas podem levar à suspensão ou exclusão da conta.</p>

          <p><strong>9. Limitação de Responsabilidade:</strong> A plataforma não se responsabiliza por encontros presenciais, roteiros gerados, nem decisões tomadas com base no conteúdo da plataforma.</p>

          <p><strong>10. Atualizações:</strong> Os Termos de Uso podem ser modificados a qualquer momento. O uso contínuo da plataforma implica concordância com os novos termos.</p>
        </div>
      </div>
    </section>
  );
};

export default TermosDeUso;
