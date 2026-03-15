export interface CSSClass {
  name: string;
  properties: Record<string, string>;
  raw: string;
}

export interface ParsedCSS {
  classes: CSSClass[];
  rawCSS: string;
  totalRules: number;
}

/**
 * Parses a CSS string and extracts class selectors with their properties.
 * Handles nested at-rules, multiple selectors, and pseudo-classes.
 */
export function parseCSS(cssText: string): ParsedCSS {
  const classes: CSSClass[] = [];
  const seen = new Set<string>();

  // Remove comments
  const stripped = cssText.replace(/\/\*[\s\S]*?\*\//g, "");

  // Match class rules: .classname { ... }
  // Also handles multiple selectors: .a, .b { ... }
  const ruleRegex = /([.#][\w\s,.:>+~[\]="'*-]+)\{([^{}]*)\}/g;
  let match;

  while ((match = ruleRegex.exec(stripped)) !== null) {
    const selectorPart = match[1].trim();
    const body = match[2].trim();

    // Split by comma for multiple selectors
    const selectors = selectorPart.split(",").map((s) => s.trim());

    for (const selector of selectors) {
      // Only process simple class selectors for the styleguide
      const classMatch = selector.match(/^\.([\w-]+)$/);
      if (!classMatch) continue;

      const className = classMatch[1];
      if (seen.has(className)) continue;
      seen.add(className);

      // Parse properties
      const properties: Record<string, string> = {};
      const propRegex = /([\w-]+)\s*:\s*([^;]+);/g;
      let propMatch;
      while ((propMatch = propRegex.exec(body)) !== null) {
        properties[propMatch[1].trim()] = propMatch[2].trim();
      }

      classes.push({
        name: className,
        properties,
        raw: `.${className} { ${body} }`,
      });
    }
  }

  // Count total rules (including non-class rules)
  const allRules = (stripped.match(/\{[^{}]*\}/g) || []).length;

  return {
    classes,
    rawCSS: cssText,
    totalRules: allRules,
  };
}

/**
 * Generates a preview text sample for a CSS class.
 */
export function getSampleText(className: string, properties: Record<string, string>): string {
  const hasColor = properties["color"] || properties["background"] || properties["background-color"];
  const hasFont = properties["font-size"] || properties["font-weight"] || properties["font-family"];
  const hasBorder = properties["border"] || properties["border-radius"];
  const hasPadding = properties["padding"] || properties["margin"];

  if (hasFont && !hasColor) {
    return `Este es un ejemplo del estilo aplicado con la clase .${className}. La tipografía define la personalidad de un diseño. Cada elección de fuente comunica algo diferente al usuario.`;
  }
  if (hasColor) {
    return `Explorando el estilo .${className} con sus valores de color y presentación visual. Un buen esquema de color refuerza la identidad de marca y mejora la legibilidad del contenido.`;
  }
  if (hasBorder) {
    return `La clase .${className} define los contornos y formas del elemento. Los bordes y el radio de curvatura añaden carácter y profundidad a los componentes de interfaz.`;
  }
  if (hasPadding) {
    return `Aplicando .${className} para gestionar el espaciado interno. El espacio en blanco es fundamental en el diseño: mejora la legibilidad y guía la atención del usuario.`;
  }
  return `Muestra de texto aplicando la clase .${className}. Este párrafo ilustra cómo se vería contenido real dentro de un componente con este estilo aplicado en un proyecto web.`;
}

/**
 * Exports a styleguide as a standalone HTML file.
 */
export function exportStyleguideHTML(classes: CSSClass[], rawCSS: string): string {
  const cards = classes
    .map(
      (cls) => `
    <div class="card">
      <div class="card-header">
        <span class="class-chip">.${cls.name}</span>
        <span class="prop-count">${Object.keys(cls.properties).length} propiedades</span>
      </div>
      <div class="preview-box">
        <div class="${cls.name}">${getSampleText(cls.name, cls.properties)}</div>
      </div>
      <details class="code-details">
        <summary>Ver CSS</summary>
        <pre><code>${escapeHtml(cls.raw)}</code></pre>
      </details>
    </div>
  `
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="author" content="Aitor Sánchez Gutiérrez" />
  <title>CSS Styleguide — CSS VisualizAitor</title>
  <style>
/* ===== CSS ORIGINAL ===== */
${rawCSS}

/* ===== STYLEGUIDE STYLES ===== */
*, *::before, *::after { box-sizing: border-box; }
:root {
  --bg: #0a0a0f;
  --surface: #13131a;
  --border: rgba(255,255,255,0.07);
  --text: #e0e0ec;
  --muted: #8888a0;
  --accent: #00e5ff;
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', system-ui, sans-serif;
  margin: 0;
  padding: 2rem;
}
.sg-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  border-bottom: 1px solid var(--border);
}
.sg-header h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #00e5ff, #b447eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem;
}
.sg-header p { color: var(--muted); margin: 0; }
.sg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid var(--border);
}
.class-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--accent);
  background: rgba(0,229,255,0.1);
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0,229,255,0.2);
}
.prop-count { font-size: 0.75rem; color: var(--muted); }
.preview-box { padding: 1.25rem; min-height: 80px; }
.code-details { border-top: 1px solid var(--border); }
.code-details summary {
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--muted);
  list-style: none;
}
.code-details summary:hover { color: var(--accent); }
.code-details pre {
  margin: 0;
  padding: 1rem;
  background: rgba(0,0,0,0.4);
  font-size: 0.75rem;
  overflow-x: auto;
  color: var(--muted);
}
.sg-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.85rem;
}
.sg-footer a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
  <header class="sg-header">
    <h1>CSS Styleguide</h1>
    <p>Generado con <strong>CSS VisualizAitor</strong> · ${classes.length} clases · ${new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</p>
  </header>
  <main class="sg-grid">
    ${cards}
  </main>
  <footer class="sg-footer">
    <p>Generado por <a href="https://aitorhub.vercel.app/" target="_blank">CSS VisualizAitor</a> · Aitor Sánchez Gutiérrez © 2026</p>
  </footer>
</body>
</html>`;
}

/**
 * Transforms plain text into an HTML blog post.
 */
export function txtToBlogHTML(text: string, rawCSS: string): string {
  const lines = text.split("\n").filter((l) => l.trim());

  let title = "";
  let subtitle = "";
  const contentLines: string[] = [];

  // First non-empty line = title
  let idx = 0;
  while (idx < lines.length && !lines[idx].trim()) idx++;
  if (idx < lines.length) {
    title = lines[idx].trim();
    idx++;
  }
  // Second non-empty line = subtitle if short
  if (idx < lines.length && lines[idx].trim().length < 120) {
    subtitle = lines[idx].trim();
    idx++;
  }
  // Rest = content
  contentLines.push(...lines.slice(idx));

  // Build paragraphs
  const paragraphs = buildParagraphs(contentLines, rawCSS);

  const dateStr = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="author" content="Aitor Sánchez Gutiérrez" />
  <title>${escapeHtml(title)} — CSS VisualizAitor Blog</title>
  <style>
/* ===== CSS ORIGINAL ===== */
${rawCSS}

/* ===== BLOG POST STYLES ===== */
*, *::before, *::after { box-sizing: border-box; }
:root {
  --bg: #0a0a0f;
  --surface: #13131a;
  --border: rgba(255,255,255,0.07);
  --text: #e0e0ec;
  --muted: #8888a0;
  --accent: #00e5ff;
  --serif: 'Georgia', serif;
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--serif);
  margin: 0;
  padding: 0;
  line-height: 1.8;
}
.blog-hero {
  max-width: 780px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem;
  text-align: center;
}
.blog-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.blog-meta .tag {
  color: #00e5ff;
  background: rgba(0,229,255,0.08);
  border: 1px solid rgba(0,229,255,0.2);
  padding: 3px 10px;
  border-radius: 4px;
}
.blog-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.2;
  margin: 0 0 1rem;
  color: #f0f0f8;
}
.blog-subtitle {
  font-size: 1.2rem;
  color: var(--muted);
  font-style: italic;
  margin-bottom: 2rem;
}
.blog-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #00e5ff, #b447eb);
  margin: 2rem auto;
  border: none;
}
.blog-body {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}
.blog-body p {
  font-size: 1.125rem;
  margin-bottom: 1.5em;
  color: #d0d0e0;
}
.blog-body h2 {
  font-size: 1.6rem;
  margin: 2.5rem 0 1rem;
  color: #f0f0f8;
}
.blog-body h3 {
  font-size: 1.3rem;
  margin: 2rem 0 0.75rem;
  color: #d8d8ec;
}
.blog-body blockquote {
  border-left: 3px solid #00e5ff;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: var(--muted);
}
.blog-footer {
  max-width: 780px;
  margin: 0 auto;
  padding: 2rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  color: var(--muted);
}
.blog-footer a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
  <article>
    <header class="blog-hero">
      <div class="blog-meta">
        <span class="tag">Blog Post</span>
        <span>${dateStr}</span>
        <span>Aitor Sánchez Gutiérrez</span>
      </div>
      <h1 class="blog-title">${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="blog-subtitle">${escapeHtml(subtitle)}</p>` : ""}
      <hr class="blog-divider" />
    </header>
    <div class="blog-body">
      ${paragraphs}
    </div>
  </article>
  <footer class="blog-footer">
    <span>Aitor Sánchez Gutiérrez © 2026</span>
    <a href="https://aitorhub.vercel.app/" target="_blank">CSS VisualizAitor</a>
  </footer>
</body>
</html>`;
}

function buildParagraphs(lines: string[], _rawCSS: string): string {
  const parts: string[] = [];
  let paraBuffer: string[] = [];

  const flush = () => {
    if (paraBuffer.length > 0) {
      parts.push(`<p>${paraBuffer.join(" ")}</p>`);
      paraBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    // Detect headings
    if (trimmed.startsWith("# ")) {
      flush();
      parts.push(`<h2>${escapeHtml(trimmed.slice(2))}</h2>`);
    } else if (trimmed.startsWith("## ")) {
      flush();
      parts.push(`<h3>${escapeHtml(trimmed.slice(3))}</h3>`);
    } else if (trimmed.startsWith("> ")) {
      flush();
      parts.push(`<blockquote><p>${escapeHtml(trimmed.slice(2))}</p></blockquote>`);
    } else {
      paraBuffer.push(escapeHtml(trimmed));
    }
  }
  flush();
  return parts.join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Downloads a string as a file.
 */
export function downloadFile(content: string, filename: string, mimeType = "text/html"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
