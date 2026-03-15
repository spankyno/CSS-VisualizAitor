"use client";

import { motion } from "framer-motion";
import { ArrowDown, Code2, FileText, Palette } from "lucide-react";

export default function Hero() {
  const features = [
    { icon: <Palette className="w-4 h-4" />, label: "CSS Analyzer" },
    { icon: <Code2 className="w-4 h-4" />, label: "Styleguide Generator" },
    { icon: <FileText className="w-4 h-4" />, label: "Blog Simulator" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background aurora blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurora-cyan/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-aurora-violet/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-aurora-cyan/3 rounded-full blur-[80px]" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 border border-aurora-cyan/20"
        >
          <span className="w-2 h-2 rounded-full bg-aurora-green animate-pulse" />
          <span className="text-xs text-aurora-cyan/80 font-mono tracking-wider uppercase">
            Premium CSS Toolkit
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
        >
          <span className="text-white">Visualiza, Analiza</span>
          <br />
          <span className="aurora-text">y Exporta</span>
          <br />
          <span className="text-white">tu CSS</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed"
        >
          Sube tu archivo CSS y genera automáticamente un styleguide visual interactivo.
          Transforma texto plano en posts de blog con tu propio estilo.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2 glass rounded-lg px-4 py-2 text-sm text-white/60 border border-white/5"
            >
              <span className="text-aurora-cyan">{f.icon}</span>
              {f.label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#analyzer"
            className="btn-aurora inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium font-sans"
          >
            Empezar ahora
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="https://aitorblog.infinityfreeapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium font-sans text-white/50 hover:text-white/80 glass border border-white/8 transition-all duration-300 hover:border-white/20"
          >
            Ver el Blog
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/30 font-mono tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-aurora-cyan/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
