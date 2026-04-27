import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSS VisualizAitor — Premium CSS Analyzer & Blog Simulator",
  description:
    "CSS Parser. Analiza tus archivos CSS, genera styleguides visuales y simula posts de blog con un entorno editorial moderno. Herramienta premium para desarrolladores y diseñadores.",
  authors: [{ name: "Aitor Sánchez Gutiérrez" }],
  keywords: ["CSS analyzer", "styleguide generator", "blog simulator", "CSS visualizer", "web tools"],
  
  // Configuración de OpenGraph (Redes sociales en general)
  openGraph: {
    title: "CSS VisualizAitor",
    description: "Premium CSS Analyzer & Blog Simulator",
    url: "https://css-visualizaitor.vercel.app/",
    siteName: "CSS VisualizAitor",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Next.js busca automáticamente en la carpeta public
        width: 1200,
        height: 630,
        alt: "Preview de CSS VisualizAitor",
      },
    ],
  },

  // Configuración específica para X (Twitter)
  twitter: {
    card: "summary_large_image",
    title: "CSS VisualizAitor",
    description: "Analiza y visualiza tus archivos CSS con un entorno editorial moderno.",
    images: ["/og-image.png"],
  },

  // URL Canónica (Muy recomendada para SEO)
  alternates: {
    canonical: "https://css-visualizaitor.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CSS VisualizAitor",
    "operatingSystem": "Web",
    "applicationCategory": "UtilityTool",
    "url": "https://css-visualizaitor.vercel.app/",
    "description": "Parsea archivos CSS mostrando una vista previa y generando HTML para visualización",
    "author": {
      "@type": "Person",
      "name": "Aitor Sánchez Gutiérrez",
      "url": "https://aitorsanchez.pages.dev/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AitorHub",
      "url": "https://aitorhub.vercel.app/"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  return (
    <html lang="es" className="dark">
      <head>
        <meta name="google-site-verification" content="MEiDmnJOvnWITHUi0HCLxuoulOEm0oTM4fwQMugxoyY" />
        <meta name="author" content="Aitor Sánchez Gutiérrez" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
