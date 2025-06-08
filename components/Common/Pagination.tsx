import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  showInfo?: boolean;
  totalElements?: number;
  size?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  showInfo = true,
  totalElements = 0,
  size = 8
}) => {
  // Se não há páginas, não renderiza
  if (totalPages <= 1) return null;

  const generatePageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Se tem poucas páginas, mostra todas
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas relevantes
      if (currentPage <= 2) {
        // Início: 0, 1, 2, ..., last
        pages.push(0, 1, 2, -1, totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        // Fim: 0, ..., last-2, last-1, last
        pages.push(0, -1, totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // Meio: 0, ..., current-1, current, current+1, ..., last
        pages.push(0, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages - 1);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const startItem = currentPage * size + 1;
  const endItem = Math.min((currentPage + 1) * size, totalElements);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Informações */}
      {showInfo && totalElements > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30"
        >
          Mostrando {startItem} a {endItem} de {totalElements} resultados
        </motion.div>
      )}

      {/* Navegação */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/30 shadow-lg"
      >
        {/* Botão Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Números das páginas */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === -1) {
              return (
                <div key={`ellipsis-${index}`} className="px-2 py-2">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              );
            }

            const isActive = pageNum === currentPage;
            
            return (
              <motion.button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px]
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-primary/10'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                whileHover={!isActive && !loading ? { scale: 1.05 } : undefined}
                whileTap={!isActive && !loading ? { scale: 0.95 } : undefined}
              >
                {pageNum + 1}
              </motion.button>
            );
          })}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 text-gray-700"
        >
          <span className="hidden sm:inline">Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default Pagination; 