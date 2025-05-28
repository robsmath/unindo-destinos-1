"use client";

import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonicalUrl?: string;
  structuredData?: object;
}

const SEOHead = ({
  title = "Unindo Destinos - Sua Plataforma de Viagens",
  description = "Descubra destinos incríveis, planeje suas viagens e conecte-se com outros viajantes na plataforma Unindo Destinos.",
  keywords = ["viagem", "turismo", "destinos", "planejamento", "reservas", "hotéis", "passagens"],
  image = "/images/og-image.jpg",
  url = "https://unindo-destinos.com",
  type = "website",
  author = "Unindo Destinos",
  publishedTime,
  modifiedTime,
  locale = "pt_BR",
  siteName = "Unindo Destinos",
  twitterHandle = "@unindo_destinos",
  noindex = false,
  nofollow = false,
  canonicalUrl,
  structuredData,
}: SEOProps) => {
  const fullTitle = title.includes("Unindo Destinos") ? title : `${title} | Unindo Destinos`;
  const fullUrl = canonicalUrl || url;
  const fullImage = image.startsWith("http") ? image : `${url}${image}`;

  // Dados estruturados padrão para organização
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Unindo Destinos",
    "url": url,
    "logo": `${url}/images/logo.png`,
    "description": description,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Portuguese"]
    },
    "sameAs": [
      "https://facebook.com/unindo.destinos",
      "https://instagram.com/unindo.destinos",
      "https://twitter.com/unindo_destinos"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Título e descrição básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />

      {/* Meta tags de indexação */}
      {noindex && <meta name="robots" content="noindex" />}
      {nofollow && <meta name="robots" content="nofollow" />}
      {(noindex || nofollow) && (
        <meta name="robots" content={`${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`} />
      )}

      {/* URL canônica */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph (Facebook) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Meta tags específicas para artigos */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:author" content={author} />
        </>
      )}

      {/* Meta tags para aplicativo móvel */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Unindo Destinos" />      {/* Links para PWA */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

      {/* Meta tags para tema */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Preconnect para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Dados estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />

      {/* Meta tags adicionais para SEO local (se aplicável) */}
      <meta name="geo.region" content="BR" />
      <meta name="geo.placename" content="Brasil" />

      {/* Meta tags para cache */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      <meta httpEquiv="Pragma" content="cache" />
      <meta httpEquiv="Expires" content="31536000" />

      {/* Meta tags para segurança */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Meta tags para acessibilidade */}
      <meta name="color-scheme" content="light dark" />
    </Head>
  );
};

export default SEOHead;
