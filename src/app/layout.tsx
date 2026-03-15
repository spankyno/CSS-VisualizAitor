import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSS VisualizAitor — Premium CSS Analyzer & Blog Simulator",
  description:
    "Analiza tus archivos CSS, genera styleguides visuales y simula posts de blog con un entorno editorial moderno. Herramienta premium para desarrolladores y diseñadores.",
  authors: [{ name: "Aitor Sánchez Gutiérrez" }],
  keywords: ["CSS analyzer", "styleguide generator", "blog simulator", "CSS visualizer", "web tools"],
  openGraph: {
    title: "CSS VisualizAitor",
    description: "Premium CSS Analyzer & Blog Simulator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="google-site-verification" content="MEiDmnJOvnWITHUi0HCLxuoulOEm0oTM4fwQMugxoyY" />
        <meta name="author" content="Aitor Sánchez Gutiérrez" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise">{children}</body>
    </html>
  );
}
