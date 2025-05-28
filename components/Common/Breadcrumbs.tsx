"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

const Breadcrumbs = ({ items, className = "", showHome = true }: BreadcrumbsProps) => {
  const pathname = usePathname();

  // Gerar breadcrumbs automaticamente baseado na URL se não fornecidos
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: "Início",
        href: "/",
        icon: <Home className="w-4 h-4" />
      });
    }

    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;
      
      // Mapear segmentos para labels mais amigáveis
      const labelMap: { [key: string]: string } = {
        'profile': 'Perfil',
        'viagens': 'Viagens',
        'pets': 'Pets',
        'auth': 'Autenticação',
        'encontrar': 'Encontrar Pessoas',
        'central-solicitacoes': 'Central de Solicitações',
        'verificacao-conta': 'Verificação de Conta'
      };

      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbs.push({
        label,
        href: isLast ? undefined : href
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`mb-6 ${className}`}
      role="navigation"
    >
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="w-4 h-4 text-gray-400 mx-2" 
                  aria-hidden="true"
                />
              )}
              
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors focus:outline-none focus:text-primary"
                  aria-label={`Navegar para ${item.label}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (                <span 
                  className={`flex items-center space-x-1 ${
                    isLast ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}
                  {...(isLast && { 'aria-current': 'page' as const })}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
