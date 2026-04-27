# 🎨 CSS VisualizAitor

**Premium CSS Analyzer & Blog Simulator** — Una herramienta minimalista y potente para desarrolladores y diseñadores que quieren visualizar su sistema de estilos al instante.

> Construido con Next.js 14 · Tailwind CSS · Framer Motion · 100% Client-side

---

## ✨ Funcionalidades

### 1. CSS Analyzer & Styleguide Generator
- Sube cualquier archivo `.css` (hasta 2 MB)
- Extrae automáticamente todas las clases CSS y sus propiedades
- Genera un **muestrario visual** con tarjetas interactivas por cada clase
- Muestra texto de muestra real aplicando el estilo correspondiente
- Buscador en tiempo real para filtrar clases
- **Exporta el Styleguide** como un archivo `styleguide.html` standalone con el CSS embebido

### 2. Blog Simulator (TXT → HTML)
- Sube un archivo `.txt` con el contenido de tu post
- Aplica automáticamente el CSS que hayas subido previamente
- Genera una vista previa editorial interactiva (tipo iframe) 
- Soporte de formato Markdown ligero:
  - `# Título` → H2
  - `## Subtítulo` → H3
  - `> Cita` → Blockquote
  - Línea vacía → Párrafo nuevo
- **Exporta el Blog Post** como `blog-post.html` listo para publicar
- Vista previa a pantalla completa

---

## 🏗️ Estructura del Proyecto

```
css-visualizaitor/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── globals.css        # Estilos globales + utilidades
│   │   ├── layout.tsx         # Root layout + metadatos + SEO
│   │   └── page.tsx           # Página principal (estado global)
│   ├── components/
│   │   ├── Navbar.tsx         # Navegación responsive con scroll effect
│   │   ├── Hero.tsx           # Sección hero animada
│   │   ├── CSSAnalyzer.tsx    # Analizador CSS + grid de tarjetas
│   │   ├── BlogSimulator.tsx  # Simulador TXT→Blog con iframe preview
│   │   ├── About.tsx          # Sección de características
│   │   ├── DropZone.tsx       # Componente drag-and-drop reutilizable
│   │   ├── SkeletonCard.tsx   # Loading skeletons
│   │   └── Footer.tsx         # Footer con links y copyright
│   └── lib/
│       ├── cssParser.ts       # Parser CSS, exportadores HTML, utilidades
│       └── utils.ts           # cn() helper (clsx + tailwind-merge)
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 🚀 Instalación y Desarrollo

### Requisitos
- Node.js 18.17+ 
- npm 9+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/css-visualizaitor.git
cd css-visualizaitor

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en localhost:3000 |
| `npm run build` | Build de producción optimizado |
| `npm run start` | Servidor de producción local |
| `npm run lint` | Lint con ESLint |

---

## 🌐 Deploy en Vercel

### Opción A — Un clic

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/css-visualizaitor)

### Opción B — CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Opción C — Dashboard de Vercel
1. Haz push de tu repositorio a GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa el repositorio
4. Vercel detecta Next.js automáticamente → **Deploy**

> ⚡ El `vercel.json` incluido configura la región `mad1` (Madrid) para latencia óptima.

---

## 🛠️ Stack Técnico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 14.2 | Framework React (App Router) |
| React | 18 | UI |
| Tailwind CSS | 3.4 | Estilos utility-first |
| Framer Motion | 11 | Animaciones |
| Lucide React | 0.400 | Iconos |
| TypeScript | 5 | Tipado estático |

---

## 🎨 Decisiones de Diseño

- **Dark mode**: Paleta `obsidian` (#060608 → #0d0d12) como base
- **Aurora accent**: Cyan `#00e5ff` y Violet `#b447eb` como colores de acento
- **Glassmorphism**: `backdrop-blur` + bordes semitransparentes en tarjetas
- **Tipografía**: Playfair Display (display) + DM Sans (body) + JetBrains Mono (código)
- **Grid pattern**: Overlay sutil para profundidad visual
- **Noise texture**: Capa de ruido SVG para textura premium

---

## 🔒 Privacidad

**Ningún archivo se envía a ningún servidor.** Todo el procesamiento (parseo CSS, generación HTML, exportación) ocurre íntegramente en el navegador del usuario. Sin cookies. Sin tracking. Sin dependencias externas en runtime.

---

## 📝 Formato del TXT para Blog Simulator

```
Mi Título Principal Aquí
Una descripción o subtítulo opcional

Primer párrafo del artículo. Puedes escribir todo lo que quieras
y se formateará automáticamente.

# Un nuevo encabezado de sección

Más contenido aquí...

## Un sub-encabezado

> Una cita importante o destacada

Último párrafo de cierre.
```

---

## 👤 Autor

**Aitor Sánchez Gutiérrez**

- 📧 Email: [blog.cottage627@passinbox.com](mailto:blog.cottage627@passinbox.com)
- 🌐 Contacto: [aitor-blog-contacto.vercel.app](https://aitor-blog-contacto.vercel.app/)
- 🚀 Más apps: [aitorhub.vercel.app](https://aitorhub.vercel.app/)
- 📖 Blog: [aitorblog.infinityfreeapp.com](https://aitorsanchez.pages.dev/)

---

## 📄 Licencia

© 2026 Aitor Sánchez Gutiérrez — Reservados todos los derechos.

---

<p align="center">
  Construido con ❤️ y mucho café · CSS VisualizAitor
</p>
