"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Code2, Palette } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "100% Client-side",
      desc: "Todo el procesamiento ocurre en tu navegador. Tus archivos nunca se envían a ningún servidor.",
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "CSS Parser Avanzado",
      desc: "Extrae clases, propiedades y genera muestrarios con visualización en tiempo real.",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Styleguide Visual",
      desc: "Cada clase CSS se muestra como una tarjeta con texto de muestra real aplicando el estilo.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Export listo para producción",
      desc: "Descarga un HTML standalone con todo el CSS embebido, listo para compartir o desplegar.",
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl p-8 sm:p-12 border border-white/5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-aurora-violet/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-aurora-cyan/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-12"
            >
              <span className="chip mb-4 inline-block">03 — Acerca de</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                Diseñado para <span className="aurora-text">devs & diseñadores</span>
              </h2>
              <p className="text-white/50 text-lg font-sans leading-relaxed">
                CSS VisualizAitor nació de la necesidad de ver rápidamente cómo luce un sistema de diseño sin tener que montar un proyecto entero. Una herramienta minimalista, rápida y potente.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-hover rounded-2xl p-5 border border-white/5"
                >
                  <div className="w-10 h-10 rounded-xl bg-aurora-cyan/10 border border-aurora-cyan/20 flex items-center justify-center mb-4 text-aurora-cyan">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-white/90 mb-2 font-sans">{f.title}</h3>
                  <p className="text-sm text-white/40 font-sans leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
