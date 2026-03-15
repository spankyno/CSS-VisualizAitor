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
 * Paragraph style variants for editorial variety.
 * Each variant has a CSS class name and its definition.
 */
const PARA_VARIANTS = [
  // 0 — Standard body: clean baseline, comfortable reading
  {
    cls: "p-body",
    css: `.p-body {
  font-size: 1.125rem;
  line-height: 1.85;
  color: #cccce0;
  margin-bottom: 1.75rem;
  font-family: 'Georgia', serif;
  letter-spacing: 0.01em;
}`,
  },
  // 1 — Lead / opener: larger, lighter, sets the scene
  {
    cls: "p-lead",
    css: `.p-lead {
  font-size: 1.3rem;
  line-height: 1.75;
  color: #e0e0f0;
  margin-bottom: 2rem;
  font-family: 'Georgia', serif;
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.015em;
  opacity: 0.92;
}`,
  },
  // 2 — Drop-cap: first letter enlarged for editorial feel
  {
    cls: "p-dropcap",
    css: `.p-dropcap {
  font-size: 1.125rem;
  line-height: 1.85;
  color: #cccce0;
  margin-bottom: 1.75rem;
  font-family: 'Georgia', serif;
}
.p-dropcap::first-letter {
  font-size: 3.8rem;
  font-weight: 700;
  line-height: 0.8;
  float: left;
  margin: 0.05em 0.12em 0 0;
  color: #00e5ff;
  font-family: 'Georgia', serif;
}`,
  },
  // 3 — Highlight box: subtle tinted background, accented border
  {
    cls: "p-highlight",
    css: `.p-highlight {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #d8d8f0;
  margin-bottom: 1.75rem;
  padding: 1.1rem 1.4rem;
  background: rgba(0, 229, 255, 0.05);
  border-left: 3px solid rgba(0, 229, 255, 0.45);
  border-radius: 0 8px 8px 0;
  font-family: 'Georgia', serif;
}`,
  },
  // 4 — Compact sans: change of rhythm, system-ui feel
  {
    cls: "p-compact",
    css: `.p-compact {
  font-size: 1rem;
  line-height: 1.7;
  color: #b0b0cc;
  margin-bottom: 1.75rem;
  font-family: system-ui, -apple-system, sans-serif;
  letter-spacing: 0.02em;
}`,
  },
  // 5 — Wide / spacious: generous letter-spacing, airy feel
  {
    cls: "p-spacious",
    css: `.p-spacious {
  font-size: 1.125rem;
  line-height: 2;
  color: #c8c8e0;
  margin-bottom: 2rem;
  font-family: 'Georgia', serif;
  letter-spacing: 0.04em;
  word-spacing: 0.08em;
}`,
  },
  // 6 — Aside / note: smaller, muted, indented — supplementary info
  {
    cls: "p-aside",
    css: `.p-aside {
  font-size: 0.95rem;
  line-height: 1.75;
  color: #8888a8;
  margin-bottom: 1.75rem;
  margin-left: 1.5rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(255,255,255,0.1);
  font-family: system-ui, sans-serif;
  font-style: italic;
}`,
  },
  // 7 — Strong / emphasis: heavier weight, brighter color
  {
    cls: "p-strong",
    css: `.p-strong {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #e8e8ff;
  margin-bottom: 1.75rem;
  font-family: 'Georgia', serif;
  font-weight: 600;
}`,
  },
  // 8 — Gradient text: editorial accent paragraph
  {
    cls: "p-gradient",
    css: `.p-gradient {
  font-size: 1.125rem;
  line-height: 1.85;
  margin-bottom: 1.75rem;
  font-family: 'Georgia', serif;
  background: linear-gradient(135deg, #c8c8e8 0%, #a0a0d0 40%, #b8b8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`,
  },
  // 9 — Monospace / data-feel: technical or code-adjacent content
  {
    cls: "p-mono",
    css: `.p-mono {
  font-size: 0.95rem;
  line-height: 1.75;
  color: #9090b8;
  margin-bottom: 1.75rem;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  background: rgba(255,255,255,0.03);
  padding: 0.9rem 1.1rem;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.06);
}`,
  },
] as const;

/**
 * Deterministic pseudo-random variant picker.
 * Uses paragraph index + a hash of the content so the sequence
 * is stable across re-renders but feels organic.
 */
function pickVariant(text: string, paraIndex: number): (typeof PARA_VARIANTS)[number] {
  // First paragraph always gets the lead style for editorial impact
  if (paraIndex === 0) return PARA_VARIANTS[1];

  // Second paragraph always gets drop-cap
  if (paraIndex === 1) return PARA_VARIANTS[2];

  // Remaining paragraphs cycle through the rest in a shuffled-feeling order
  const order = [0, 4, 3, 7, 5, 0, 6, 8, 0, 4, 3, 9, 0, 5, 7];
  const charSum = text.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const slot = (paraIndex + charSum) % order.length;
  return PARA_VARIANTS[order[slot]];
}

/**
 * Transforms plain text into an HTML blog post with rich editorial paragraph styles.
 */
export function txtToBlogHTML(text: string, rawCSS: string): string {
  const rawLines = text.split("\n");

  let title = "";
  let subtitle = "";
  const contentLines: string[] = [];

  // First non-empty line = title
  let idx = 0;
  while (idx < rawLines.length && !rawLines[idx].trim()) idx++;
  if (idx < rawLines.length) {
    title = rawLines[idx].trim();
    idx++;
  }
  // Second non-empty line = subtitle if reasonably short
  if (idx < rawLines.length && rawLines[idx].trim().length < 160 && !rawLines[idx].trim().startsWith("#")) {
    subtitle = rawLines[idx].trim();
    idx++;
  }
  // Rest = content
  contentLines.push(...rawLines.slice(idx));

  // Build the body and collect which variant CSS classes are actually used
  const { html: bodyHtml, usedVariants } = buildEditorialBody(contentLines);

  // Collect CSS for used variants only
  const variantCSS = usedVariants
    .map((cls) => PARA_VARIANTS.find((v) => v.cls === cls)?.css ?? "")
    .join("\n");

  const dateStr = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Reading time estimate (avg 200 wpm)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="author" content="Aitor Sánchez Gutiérrez" />
  <meta name="description" content="${escapeHtml(subtitle || title)}" />
  <title>${escapeHtml(title)} — CSS VisualizAitor Blog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
  <style>
/* ===== CSS ORIGINAL DEL USUARIO ===== */
${rawCSS}

/* ===== BLOG POST — BASE ===== */
*, *::before, *::after { box-sizing: border-box; }

:root {
  --bg:        #080810;
  --bg2:       #0e0e18;
  --surface:   #13131e;
  --border:    rgba(255,255,255,0.07);
  --text:      #d8d8ec;
  --muted:     #7878a0;
  --accent:    #00e5ff;
  --violet:    #b447eb;
  --gold:      #ffd166;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  margin: 0;
  padding: 0;
  font-family: 'Georgia', serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Progress bar ── */
#progress-bar {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, var(--accent), var(--violet));
  z-index: 100;
  transition: width 0.1s linear;
}

/* ── Top bar ── */
.blog-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(8,8,16,0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 52px;
}
.blog-topbar-brand {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.blog-topbar-brand span { color: var(--accent); }
.blog-topbar-meta {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  color: var(--muted);
  display: flex;
  gap: 1.2rem;
}

/* ── Hero ── */
.blog-hero {
  max-width: 860px;
  margin: 0 auto;
  padding: 5rem 2rem 3rem;
  text-align: center;
  position: relative;
}
.blog-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.blog-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  background: rgba(0,229,255,0.07);
  border: 1px solid rgba(0,229,255,0.2);
  padding: 0.3rem 0.9rem;
  border-radius: 100px;
  margin-bottom: 1.8rem;
}
.blog-kicker::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}

.blog-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.2rem, 5.5vw, 3.8rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #f4f4ff;
  margin: 0 0 1.4rem;
}

.blog-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--muted);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  font-weight: 300;
}

.blog-meta-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  color: var(--muted);
  flex-wrap: wrap;
}
.blog-meta-row .sep { opacity: 0.3; }
.blog-meta-row .author { color: #a0a0c8; font-weight: 500; }

.blog-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 3rem auto;
  max-width: 200px;
}
.blog-divider::before,
.blog-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent);
}
.blog-divider-icon {
  color: var(--accent);
  opacity: 0.5;
  font-size: 1rem;
}

/* ── Body layout ── */
.blog-body {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1.5rem 6rem;
}

/* ── Headings ── */
.blog-body h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.25;
  color: #eeeeff;
  margin: 3.5rem 0 1.2rem;
  letter-spacing: -0.01em;
  position: relative;
  padding-top: 1rem;
}
.blog-body h2::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 36px; height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--violet));
  border-radius: 2px;
}

.blog-body h3 {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #d0d0f0;
  margin: 2.5rem 0 0.9rem;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  color: var(--accent);
}

/* ── Blockquote ── */
.blog-body blockquote {
  position: relative;
  margin: 2.5rem 0;
  padding: 1.5rem 2rem 1.5rem 3rem;
  background: linear-gradient(135deg, rgba(0,229,255,0.04), rgba(180,71,235,0.04));
  border-radius: 0 12px 12px 0;
  border-left: none;
  overflow: hidden;
}
.blog-body blockquote::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--accent), var(--violet));
  border-radius: 2px;
}
.blog-body blockquote::after {
  content: '\u201C';
  position: absolute;
  top: -0.5rem; left: 1rem;
  font-size: 4rem;
  line-height: 1;
  color: var(--accent);
  opacity: 0.15;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 900;
  pointer-events: none;
}
.blog-body blockquote p {
  font-family: 'Playfair Display', Georgia, serif !important;
  font-size: 1.2rem !important;
  line-height: 1.7 !important;
  font-style: italic;
  color: #c8c8e8 !important;
  margin: 0 !important;
  background: none !important;
  -webkit-text-fill-color: initial !important;
  padding: 0 !important;
  border: none !important;
  float: none !important;
}
.blog-body blockquote p::first-letter {
  font-size: inherit !important;
  float: none !important;
  margin: 0 !important;
  color: inherit !important;
}

/* ── Section break ── */
.section-break {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin: 2.5rem 0;
  opacity: 0.35;
}
.section-break span {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--muted);
  display: inline-block;
}

/* ── Pull quote ── */
.pull-quote {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.55rem;
  font-weight: 700;
  line-height: 1.45;
  color: transparent;
  background: linear-gradient(135deg, #e0e0ff 0%, #a0a0e0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  text-align: center;
  margin: 3rem -2rem;
  padding: 2rem 3rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  font-style: italic;
  letter-spacing: -0.01em;
}

/* ── Paragraph variants ── */
${variantCSS}

/* ── Footer ── */
.blog-end-rule {
  max-width: 700px;
  margin: 0 auto 2rem;
  padding: 0 1.5rem;
}
.blog-end-rule hr {
  border: none;
  border-top: 1px solid var(--border);
}

.blog-author-card {
  max-width: 700px;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
}
.blog-author-card-inner {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.2rem 1.5rem;
}
.blog-author-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--violet));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0a0a14;
  flex-shrink: 0;
}
.blog-author-info { flex: 1; }
.blog-author-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #d0d0f0;
  margin: 0 0 0.2rem;
}
.blog-author-bio {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}
.blog-author-links {
  display: flex;
  gap: 0.6rem;
}
.blog-author-links a {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  color: var(--accent);
  text-decoration: none;
  padding: 0.25rem 0.7rem;
  border: 1px solid rgba(0,229,255,0.2);
  border-radius: 100px;
  transition: all 0.2s;
  white-space: nowrap;
}
.blog-author-links a:hover {
  background: rgba(0,229,255,0.08);
  border-color: rgba(0,229,255,0.4);
}

.blog-footer {
  background: var(--bg2);
  border-top: 1px solid var(--border);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.blog-footer-copy {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: var(--muted);
}
.blog-footer-links {
  display: flex;
  gap: 1rem;
}
.blog-footer-links a {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.blog-footer-links a:hover { color: var(--accent); }

/* ── Scroll fade-in animation ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.blog-body > * {
  animation: fadeUp 0.55s ease both;
}
  </style>
</head>
<body>
  <div id="progress-bar"></div>

  <header class="blog-topbar">
    <div class="blog-topbar-brand">
      <span>CSS VisualizAitor</span> · Blog
    </div>
    <div class="blog-topbar-meta">
      <span>${readingMinutes} min de lectura</span>
      <span>${wordCount} palabras</span>
    </div>
  </header>

  <article>
    <header class="blog-hero">
      <div class="blog-kicker">Blog Post</div>
      <h1 class="blog-title">${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="blog-subtitle">${escapeHtml(subtitle)}</p>` : ""}
      <div class="blog-meta-row">
        <span class="author">Aitor Sánchez Gutiérrez</span>
        <span class="sep">·</span>
        <span>${dateStr}</span>
        <span class="sep">·</span>
        <span>${readingMinutes} min lectura</span>
      </div>
      <div class="blog-divider"><span class="blog-divider-icon">✦</span></div>
    </header>

    <div class="blog-body">
      ${bodyHtml}
    </div>
  </article>

  <div class="blog-end-rule"><hr /></div>

  <div class="blog-author-card">
    <div class="blog-author-card-inner">
      <div class="blog-author-avatar">A</div>
      <div class="blog-author-info">
        <p class="blog-author-name">Aitor Sánchez Gutiérrez</p>
        <p class="blog-author-bio">Desarrollador &amp; diseñador · Creador de CSS VisualizAitor</p>
      </div>
      <div class="blog-author-links">
        <a href="https://aitorblog.infinityfreeapp.com" target="_blank">Blog</a>
        <a href="https://aitor-blog-contacto.vercel.app/" target="_blank">Contacto</a>
      </div>
    </div>
  </div>

  <footer class="blog-footer">
    <span class="blog-footer-copy">Aitor Sánchez Gutiérrez © 2026 — Reservados todos los derechos</span>
    <div class="blog-footer-links">
      <a href="https://aitorhub.vercel.app/" target="_blank">Más apps</a>
      <a href="https://aitorblog.infinityfreeapp.com" target="_blank">Blog</a>
      <a href="https://aitor-blog-contacto.vercel.app/" target="_blank">Contacto</a>
    </div>
  </footer>

  <script>
    // Reading progress bar
    window.addEventListener('scroll', () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      document.getElementById('progress-bar').style.width = pct + '%';
    });
    // Staggered fade-in for body children
    document.querySelectorAll('.blog-body > *').forEach((el, i) => {
      el.style.animationDelay = (i * 0.06) + 's';
    });
  </script>
</body>
</html>`;
}

/**
 * Parses lines into editorial HTML, assigning a variant class to each paragraph.
 * Returns the HTML string and the list of variant class names actually used.
 */
function buildEditorialBody(lines: string[]): { html: string; usedVariants: string[] } {
  const parts: string[] = [];
  const usedVariants: string[] = [];
  const usedSet = new Set<string>();

  let paraBuffer: string[] = [];
  let paraIndex = 0;

  // After how many paragraphs to inject a pull-quote or section-break
  const pullQuoteAt = new Set([3, 8, 14]);
  const sectionBreakAt = new Set([5, 11]);

  const flush = () => {
    if (paraBuffer.length === 0) return;
    const text = paraBuffer.join(" ");
    const variant = pickVariant(text, paraIndex);

    // Every ~6th paragraph (and never the first two) becomes a pull-quote instead
    if (paraIndex > 2 && paraIndex % 6 === 0 && text.length > 80 && text.length < 300) {
      parts.push(`<p class="pull-quote">${text}</p>`);
    } else {
      parts.push(`<p class="${variant.cls}">${text}</p>`);
      if (!usedSet.has(variant.cls)) {
        usedSet.add(variant.cls);
        usedVariants.push(variant.cls);
      }
    }

    // Inject decorative section break
    if (sectionBreakAt.has(paraIndex)) {
      parts.push(`<div class="section-break"><span></span><span></span><span></span></div>`);
    }

    paraIndex++;
    paraBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }

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

  return { html: parts.join("\n"), usedVariants };
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
