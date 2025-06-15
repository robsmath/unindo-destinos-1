"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const SkipLinks = ({ links }: SkipLinksProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const defaultLinks: SkipLink[] = [
    { href: "#main-content", label: "Pular para o conteúdo principal" },
    { href: "#navigation", label: "Pular para a navegação" },
    { href: "#footer", label: "Pular para o rodapé" },
    { href: "#search", label: "Pular para a busca" },
  ];

  const skipLinks = links || defaultLinks;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        if (!document.activeElement?.closest('.skip-links')) {
          setIsVisible(false);
        }
      }, 100);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return (
    <div 
      className={`skip-links fixed top-0 left-0 z-[9999] transition-transform duration-200 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="navigation"
      aria-label="Links de navegação rápida"
    >
      <div className="bg-white border-2 border-primary shadow-lg rounded-b-lg p-2 flex flex-wrap gap-2">
        {skipLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 focus:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            onFocus={() => setIsVisible(true)}
            onBlur={(e) => {
              if (!e.relatedTarget?.closest('.skip-links')) {
                setIsVisible(false);
              }
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SkipLinks;
