# CodePoetica ✨

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4)

> **Where Code Becomes Poetry** — Transform your code into beautiful classical Chinese poetry, visualize abstract syntax trees, and hide secret messages in plain sight.

---

## Features

### 📜 Code-to-Poetry Converter
Transform JavaScript/TypeScript code into classical Chinese poetry. Choose from three poetic styles:
- **Free Verse** — Keywords become poetic terms, preserving code structure
- **Haiku (俳句)** — Code condensed into a 5-7-5 syllabic pattern
- **Sonnet (十四行诗)** — 14-line poetic interpretation with keyword frequency annotations

### 🔐 Steganography Module
Hide secret messages within your poetry using zero-width Unicode characters:
- **Zero-Width Encoding**: ZWSP (U+200B) for binary 0, ZWNJ (U+200C) for binary 1
- **Comment Steganography**: Hide messages in code comments using first-letter encoding
- **Encode/Decode Tabs**: Easily hide and extract hidden messages
- **Stats Panel**: See capacity, usage, and visible difference metrics

### ✨ Visualization Canvas
Watch your code come alive with an interactive AST visualization:
- **Tree Graph**: Nodes colored by token type (keyword=gold, identifier=blue, string=green, etc.)
- **Particle Effects**: Code characters become falling particles
- **Animation Controls**: Play/Pause/Reset with configurable speed
- **Smooth Transitions**: Nodes animate to their positions for a fluid experience

### 🎨 Theming & Controls
- **4 Color Themes**: Dark, Light, Cyberpunk, Nature
- **Animation Speed**: 0.5x to 3x playback speed
- **Steganography Strength**: Adjustable encoding strength (1-10)

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript 6** | Type safety |
| **Vite 8** | Build tool |
| **Tailwind CSS 4** | Utility-first styling |
| **Custom Lexer** | Code tokenization |
| **Canvas API** | AST visualization |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/CodePoetica.git
cd CodePoetica

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Usage Guide

### 1. Code-to-Poetry Converter
1. Type or paste JavaScript/TypeScript code in the left panel (or load an example)
2. Select a poem style from the sidebar (Free Verse / Haiku / Sonnet)
3. Click **✨ Generate Poetry**
4. View your poetic output in the right panel
5. Use **📋 Copy** or **💾 Download** to save your poem

### 2. Steganography
1. Switch to the **Steganography** tab
2. **Encode**: Enter a secret message, click **🔒 Encode Message**
3. View the encoded result with highlighted zero-width characters
4. **Decode**: Paste encoded text, click **🔓 Decode Message** to extract hidden content

### 3. Visualization
1. Switch to the **Visualization** tab
2. Click **▶ Play** to see your code's AST tree and particle effects
3. Use the sidebar to adjust animation speed and toggle particles
4. Click **🔄 Reset** to regenerate the tree after code changes

---

## Code-to-Poetry Mapping

| Code Keyword | Poetic Term | Meaning |
|-------------|------------|---------|
| `function` | 如是我闻 | Thus I have heard |
| `return` | 归来 | Return home |
| `if` | 倘若 | If, supposing |
| `else` | 若非 | If not |
| `const` | 恒久 | Eternal |
| `let` | 暂寄 | Temporarily entrusted |
| `var` | 无常 | Impermanent |
| `for` | 轮回 | Cycle of rebirth |
| `while` | 守望 | Keep vigil |
| `class` | 万类 | All things |
| `import` | 借取 | Borrow |
| `export` | 馈赠 | Bestow |
| `await` | 静候 | Wait quietly |
| `async` | 远行 | Journey afar |
| `try` | 涉险 | Venture into danger |
| `catch` | 逢难 | Encounter hardship |
| `throw` | 掷出 | Cast out |
| `break` | 断弦 | Broken string |
| `continue` | 续章 | Continue the chapter |
| `switch` | 择途 | Choose a path |
| `case` | 若此 | If this be so |
| `default` | 常道 | The constant Way |
| `new` | 新生 | New life |
| `this` | 此身 | This body |
| `true` | 真言 | True words |
| `false` | 虚妄 | False illusion |
| `null` | 空寂 | Empty silence |
| `undefined` | 未名 | Unnamed |
| `extends` | 承袭 | Inherit |
| `super` | 先灵 | Ancestral spirit |
| `static` | 静立 | Stand still |
| `get` | 取之 | Take it |
| `set` | 置之 | Place it |

---

## Example

### Input (Bubble Sort)
```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
```

### Output (Free Verse)
```
如是我闻 bubbleSort(arr) {
  恒久 n = arr.length;
  轮回 (暂寄 i = 0; i < n - 1; i++) {
    轮回 (暂寄 j = 0; j < n - i - 1; j++) {
      倘若 (arr[j] > arr[j + 1]) {
        恒久 temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  归来 arr;
}
```

---

## Project Structure

```
CodePoetica/
├── index.html                 # Entry HTML
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite + React + Tailwind config
├── README.md                  # This file
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Main app component (state management)
│   ├── App.css                # Complete application styles
│   ├── index.css              # Tailwind directives + CSS variables + fonts
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   ├── codeParser.ts      # Lexer + tokenizer + AST builder
│   │   ├── poetryConverter.ts # Code-to-poetry conversion engine
│   │   └── steganography.ts   # Zero-width character steganography
│   ├── hooks/
│   │   └── useVisualization.ts # Canvas animation hook
│   └── components/
│       ├── Layout.tsx          # App shell (header, tab bar, footer)
│       ├── CodeInput.tsx       # Code editor with examples
│       ├── PoetryOutput.tsx    # Poem display with copy/download
│       ├── SteganographyPanel.tsx # Encode/decode panel
│       ├── VisualizationCanvas.tsx # AST tree + particle canvas
│       ├── ControlPanel.tsx    # Settings sidebar
│       └── TabBar.tsx          # Tab navigation
```

---

## Build & Deploy

### Production Build
```bash
npm run build
```
Output goes to `dist/`.

### GitHub Pages
The `vite.config.ts` is pre-configured with `base: '/CodePoetica/'` for GitHub Pages deployment. After building, deploy the `dist/` folder to the `gh-pages` branch.

### Docker
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## License

MIT © CodePoetica Contributors

---

*Made with ✨ by developers who believe code is poetry*
