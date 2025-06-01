"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Users, Bell, Settings } from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const ChatDemo = () => {
  const { hasUnreadMessages, totalUnreadCount, mensagensNaoLidas } = useUnreadMessages();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-primary/5 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <MessageCircle className="text-primary" />
            Sistema de Chat - Demo
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Status Global */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-xl p-6 border border-primary/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Status Global</h3>
                <Bell className={`w-5 h-5 ${hasUnreadMessages ? 'text-red-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Mensagens não lidas: 
                  <span className="ml-2 font-bold text-primary">{totalUnreadCount}</span>
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${hasUnreadMessages ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-sm">{hasUnreadMessages ? 'Tem mensagens' : 'Sem mensagens'}</span>
                </div>
              </div>
            </motion.div>

            {/* Funcionalidades */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Funcionalidades</h3>
                <Settings className="w-5 h-5 text-blue-500" />
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Chat icon nos participantes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Modal responsivo
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Notificações não lidas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Ícone global no header
                </li>
              </ul>
            </motion.div>

            {/* Polling Info */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Polling Status</h3>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Intervalo: 30 segundos</p>
                <p>Status: Ativo</p>
                <p>Última verificação: Agora</p>
              </div>
            </motion.div>
          </div>

          {/* Detalhes das Mensagens */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-primary hover:text-orange-600 transition-colors mb-4"
            >
              <Users className="w-4 h-4" />
              {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes das Mensagens
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {mensagensNaoLidas.length > 0 ? (
                  mensagensNaoLidas.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-800">
                          Remetente ID: {mensagem.remetenteId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(mensagem.dataEnvio).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{mensagem.conteudo}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma mensagem não lida</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Instruções */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Como Testar:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>Acesse uma página de participantes de viagem</li>
              <li>Clique no ícone 💬 de um participante para abrir o chat</li>
              <li>Envie mensagens e observe as notificações</li>
              <li>Verifique o ícone global no header</li>
              <li>Teste com múltiplos usuários para ver as notificações funcionando</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatDemo;
