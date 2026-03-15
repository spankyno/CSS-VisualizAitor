"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, Search, ChevronDown, ChevronUp, Code2 } from "lucide-react";
import DropZone from "@/components/DropZone";
import { SkeletonCard, SkeletonStats } from "@/components/SkeletonCard";
import { parseCSS, getSampleText, exportStyleguideHTML, downloadFile, type CSSClass } from "@/lib/cssParser";

interface StyleguideProps {
  onCSSReady: (raw: string) => void;
}

export default function CSSAnalyzer({ onCSSReady }: StyleguideProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rawCSS, setRawCSS] = useState<string>("");
  const [classes, setClasses] = useState<CSSClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const handleFile = useCallback(
    (f: File, content: string) => {
      setFile(f);
      setLoading(true);
      setClasses([]);
      setTimeout(() => {
        const parsed = parseCSS(content);
        setRawCSS(content);
        setClasses(parsed.classes);
        onCSSReady(content);
        setLoading(false);
      }, 600);
    },
    [onCSSReady]
  );

  const handleClear = () => {
    setFile(null);
    setRawCSS("");
    setClasses([]);
    setSearch("");
    onCSSReady("");
  };

  const toggleCard = (name: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const html = exportStyleguideHTML(classes, rawCSS);
    downloadFile(html, "styleguide.html");
  };

  return (
    <section id="analyzer" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-aurora-cyan/10 border border-aurora-cyan/20 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-aurora-cyan" />
            </div>
            <span className="chip">01 — Analizador CSS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            CSS <span className="aurora-text">Analyzer</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl font-sans">
            Sube tu archivo CSS para extraer todas las clases y generar un styleguide visual interactivo.
          </p>
        </motion.div>

        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 max-w-xl"
        >
          <DropZone
            accept=".css"
            onFile={handleFile}
            file={file}
            onClear={handleClear}
            label="Arrastra tu archivo CSS aquí"
            hint="o haz clic para seleccionar"
          />
        </motion.div>

        {/* Stats + actions */}
        <AnimatePresence>
          {(loading || classes.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              {loading ? (
                <SkeletonStats />
              ) : (
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { label: "Clases encontradas", value: classes.length },
                    { label: "Propiedades totales", value: classes.reduce((s, c) => s + Object.keys(c.properties).length, 0) },
                    { label: "Tamaño CSS", value: `${(rawCSS.length / 1024).toFixed(1)} KB` },
                  ].map((stat) => (
                    <div key={stat.label} className="glass rounded-xl px-5 py-3 flex-1 min-w-[120px]">
                      <p className="text-xs text-white/30 font-mono mb-1">{stat.label}</p>
                      <p className="text-2xl font-display font-bold aurora-text">{stat.value}</p>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExport}
                      className="btn-aurora inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium font-sans h-full"
                    >
                      <Download className="w-4 h-4" />
                      Exportar HTML
                    </button>
                    <button
                      onClick={handleClear}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium font-sans text-white/40 hover:text-white/70 glass border border-white/8 hover:border-white/20 transition-all h-full"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Search */}
              {!loading && classes.length > 0 && (
                <div className="relative mb-6 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Buscar clase..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder-white/25 bg-transparent border border-white/8 focus:border-aurora-cyan/40 focus:outline-none transition-all font-mono"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`sk-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))
              : filtered.map((cls, i) => (
                  <motion.div
                    key={cls.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4) }}
                    layout
                  >
                    <ClassCard
                      cls={cls}
                      expanded={expandedCards.has(cls.name)}
                      onToggle={() => toggleCard(cls.name)}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && !loading && classes.length > 0 && (
          <div className="text-center py-16 text-white/30 font-sans">
            No se encontraron clases con &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </section>
  );
}

function ClassCard({
  cls,
  expanded,
  onToggle,
}: {
  cls: CSSClass;
  expanded: boolean;
  onToggle: () => void;
}) {
  const propEntries = Object.entries(cls.properties);
  const sample = getSampleText(cls.name, cls.properties);

  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
        <span className="chip">.{cls.name}</span>
        <span className="text-xs text-white/25 font-mono">
          {propEntries.length} props
        </span>
      </div>

      {/* Preview */}
      <div className="px-5 py-4 flex-1">
        <p className="text-sm text-white/60 leading-relaxed font-sans" style={{ fontFamily: "inherit" }}>
          {sample}
        </p>
      </div>

      {/* Property tags */}
      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
        {propEntries.slice(0, 4).map(([key]) => (
          <span
            key={key}
            className="text-xs font-mono px-2 py-0.5 rounded bg-white/4 text-white/30 border border-white/6"
          >
            {key}
          </span>
        ))}
        {propEntries.length > 4 && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/4 text-white/25">
            +{propEntries.length - 4}
          </span>
        )}
      </div>

      {/* Expand CSS */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-5 py-2.5 text-xs text-white/30 hover:text-aurora-cyan/70 border-t border-white/5 hover:bg-aurora-cyan/3 transition-all w-full text-left font-mono"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? "Ocultar CSS" : "Ver CSS"}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <pre className="code-preview p-4 bg-black/30 text-white/40 overflow-x-auto">
              {propEntries.map(([k, v]) => (
                <div key={k}>
                  <span className="text-aurora-cyan/60">{k}</span>
                  <span className="text-white/30">: </span>
                  <span className="text-aurora-green/60">{v}</span>
                  <span className="text-white/30">;</span>
                </div>
              ))}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
