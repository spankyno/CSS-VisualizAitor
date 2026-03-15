"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, EyeOff, FileText, Maximize2, X } from "lucide-react";
import DropZone from "@/components/DropZone";
import { txtToBlogHTML, downloadFile } from "@/lib/cssParser";

interface BlogSimulatorProps {
  rawCSS: string;
}

export default function BlogSimulator({ rawCSS }: BlogSimulatorProps) {
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [txtContent, setTxtContent] = useState("");
  const [blogHTML, setBlogHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [modal, setModal] = useState(false);

  const handleTxt = useCallback(
    (f: File, content: string) => {
      setTxtFile(f);
      setTxtContent(content);
      setLoading(true);
      setBlogHTML("");
      setTimeout(() => {
        const css = rawCSS || `/* No CSS loaded — using default styles */`;
        const html = txtToBlogHTML(content, css);
        setBlogHTML(html);
        setLoading(false);
        setPreview(true);
      }, 800);
    },
    [rawCSS]
  );

  const handleClear = () => {
    setTxtFile(null);
    setTxtContent("");
    setBlogHTML("");
    setPreview(false);
  };

  const handleExport = () => {
    if (!blogHTML) return;
    downloadFile(blogHTML, "blog-post.html");
  };

  // Parse title for the preview header
  const firstLine = txtContent.split("\n").find((l) => l.trim()) || "Blog Post";

  return (
    <section id="blog" className="py-24 px-4 sm:px-6 relative">
      {/* Subtle separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

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
            <div className="w-8 h-8 rounded-lg bg-aurora-violet/10 border border-aurora-violet/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-aurora-violet" />
            </div>
            <span className="chip" style={{ borderColor: "rgba(180,71,235,0.3)", color: "rgba(180,71,235,0.8)", background: "rgba(180,71,235,0.08)" }}>
              02 — Blog Simulator
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            TXT to <span style={{ background: "linear-gradient(135deg, #b447eb, #00e5ff)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Blog Post</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl font-sans">
            Transforma un archivo de texto plano en un post editorial HTML listo para publicar, usando el CSS que subiste.
          </p>
          {!rawCSS && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-aurora-gold/8 border border-aurora-gold/20 text-aurora-gold/80 text-sm font-sans">
              <span>⚠</span>
              Sube primero un archivo CSS para aplicar tus estilos al post.
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: upload + actions */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <DropZone
                accept=".txt"
                onFile={handleTxt}
                file={txtFile}
                onClear={handleClear}
                label="Arrastra tu archivo TXT aquí"
                hint="Se transformará en un post de blog editorial"
              />
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5 glass rounded-xl p-4 border border-white/5"
            >
              <p className="text-xs text-white/30 font-mono mb-3 uppercase tracking-wider">Formato del TXT</p>
              <div className="space-y-2 text-sm font-sans">
                {[
                  ["Primera línea", "→ Título del post"],
                  ["Segunda línea", "→ Subtítulo / descripción"],
                  ["# Texto", "→ Encabezado H2"],
                  ["## Texto", "→ Encabezado H3"],
                  ["> Texto", "→ Cita / blockquote"],
                  ["Línea vacía", "→ Nuevo párrafo"],
                ].map(([key, val]) => (
                  <div key={key} className="flex items-start gap-3">
                    <span className="font-mono text-xs text-aurora-cyan/50 w-24 flex-shrink-0">{key}</span>
                    <span className="text-white/40">{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Export button */}
            <AnimatePresence>
              {blogHTML && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex gap-3"
                >
                  <button
                    onClick={handleExport}
                    className="btn-aurora inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium font-sans flex-1 justify-center"
                    style={{ borderColor: "rgba(180,71,235,0.3)", color: "#b447eb" }}
                  >
                    <Download className="w-4 h-4" />
                    Descargar Blog Post
                  </button>
                  <button
                    onClick={() => setModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium glass border border-white/10 text-white/50 hover:text-white/80 transition-all"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: preview */}
          <div className="relative">
            <div className="glass rounded-2xl overflow-hidden border border-white/5 h-full min-h-[480px] flex flex-col">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 glass rounded-md px-3 py-1 text-xs text-white/25 font-mono mx-2">
                  {txtFile ? `preview — ${firstLine.slice(0, 40)}` : "blog-post.html"}
                </div>
                {blogHTML && (
                  <button
                    onClick={() => setPreview(!preview)}
                    className="text-white/30 hover:text-white/60 transition-colors"
                  >
                    {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 relative overflow-hidden">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-10 h-10 border-2 border-aurora-violet/30 border-t-aurora-violet rounded-full animate-spin" />
                    <p className="text-sm text-white/30 font-sans">Generando post editorial…</p>
                  </div>
                ) : blogHTML && preview ? (
                  <iframe
                    srcDoc={blogHTML}
                    className="w-full h-full min-h-[420px] border-0"
                    title="Blog post preview"
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8 py-16">
                    <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mb-2">
                      <FileText className="w-7 h-7 text-white/15" />
                    </div>
                    <p className="text-white/25 font-sans text-sm max-w-xs leading-relaxed">
                      {blogHTML
                        ? "Haz clic en el ojo para activar la vista previa"
                        : "Sube un archivo TXT para ver la vista previa del post editorial aquí"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen modal */}
      <AnimatePresence>
        {modal && blogHTML && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-sm font-mono text-white/40">Vista previa completa</span>
              <button
                onClick={() => setModal(false)}
                className="p-2 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              srcDoc={blogHTML}
              className="flex-1 border-0"
              title="Blog post fullscreen"
              sandbox="allow-same-origin"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
