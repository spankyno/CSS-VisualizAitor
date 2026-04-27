"use client";

import { motion } from "framer-motion";
import { Sparkles, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const links = [
    { label: "Blog", href: "https://aitorsanchez.pages.dev/", external: true },
    { label: "Contacto", href: "https://aitor-blog-contacto.vercel.app/", external: true },
    { label: "Más Apps", href: "https://aitorhub.vercel.app/", external: true },
  ];

  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Logo + copyright */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-aurora-cyan/20 to-aurora-violet/20 border border-aurora-cyan/25 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-aurora-cyan" />
              </div>
              <span className="font-display font-bold text-base">
                <span className="aurora-text">CSS</span>
                <span className="text-white/80"> VisualizAitor</span>
              </span>
            </div>
            <p className="text-sm text-white/30 font-sans text-center md:text-left">
              Aitor Sánchez Gutiérrez © 2026 — Reservados todos los derechos
            </p>
            <a
              href="mailto:blog.cottage627@passinbox.com"
              className="flex items-center gap-2 text-sm text-white/30 hover:text-aurora-cyan/70 transition-colors font-sans"
            >
              <Mail className="w-3.5 h-3.5" />
              blog.cottage627@passinbox.com
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 px-4 py-2 glass rounded-xl text-sm text-white/40 hover:text-white/80 border border-white/5 hover:border-aurora-cyan/20 transition-all font-sans"
              >
                {link.label}
                {link.external && <ExternalLink className="w-3 h-3 opacity-60" />}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20 font-mono">
            Construido con Next.js · Tailwind CSS · Framer Motion
          </p>
          <p className="text-xs text-white/20 font-mono">
            Procesamiento 100% client-side · Sin servidores · Sin cookies
          </p>
        </div>
      </div>
    </footer>
  );
}
