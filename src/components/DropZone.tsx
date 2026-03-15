"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileCode, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  accept: ".css" | ".txt";
  onFile: (file: File, content: string) => void;
  file?: File | null;
  onClear?: () => void;
  label: string;
  hint: string;
}

export default function DropZone({ accept, onFile, file, onClear, label, hint }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (f: File) => {
      setError(null);
      const ext = f.name.toLowerCase().endsWith(accept);
      if (!ext) {
        setError(`Solo se permiten archivos ${accept}`);
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        setError("El archivo no puede superar 2 MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        onFile(f, e.target?.result as string);
      };
      reader.readAsText(f, "utf-8");
    },
    [accept, onFile]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const Icon = accept === ".css" ? FileCode : FileText;

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: file ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "drop-zone relative rounded-2xl p-8 cursor-pointer transition-all duration-300 glass glass-hover",
          dragging && "active",
          file && "border-aurora-green/30 bg-aurora-green/3",
          error && "border-red-500/30 bg-red-500/5"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />

        {file ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-aurora-green/10 border border-aurora-green/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-aurora-green" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{file.name}</p>
              <p className="text-sm text-white/40">
                {(file.size / 1024).toFixed(1)} KB · {accept.toUpperCase()} listo
              </p>
            </div>
            {onClear && (
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); setError(null); }}
                className="p-2 text-white/30 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <motion.div
              animate={{ y: dragging ? -4 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
            >
              {dragging ? (
                <Upload className="w-7 h-7 text-aurora-cyan" />
              ) : (
                <Icon className="w-7 h-7 text-white/30" />
              )}
            </motion.div>
            <div>
              <p className="font-medium text-white/80 mb-1">{label}</p>
              <p className="text-sm text-white/40">{hint}</p>
              <p className="text-xs text-white/25 mt-2 font-mono">{accept} · máx. 2 MB</p>
            </div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-red-500/10 border-t border-red-500/20 px-4 py-2 rounded-b-2xl"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">{error}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
