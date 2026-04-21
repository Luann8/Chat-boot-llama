
# 🦙 Chat-boot-llama

**Plataforma de chat com IA — White-Label, Open-Source e Multimodal**

Uma interface de chat moderna e personalizável para modelos de linguagem, suportando execução **local via Ollama** ou **na nuvem via Replicate**. Construída com Next.js 14 e design Glassmorphism.

<p align="center">
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

---

## 📋 Tabela de Conteúdos

- [✨ Features](#-features)
- [🧱 Tech Stack](#-tech-stack)
- [🖼️ Live Preview](#️-live-preview)
- [🌍 Internacionalização (i18n)](#-internacionalização-i18n)
- [📦 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Quick Start](#-quick-start)
- [🎨 Design Highlights](#-design-highlights)
- [📄 License](#-license)

---

## ✨ Features

### 🎨 UI / Design
- **Tema Glassmorphism** — fundo escuro `#0f1115`, painéis com `backdrop-blur` e bordas sutis
- **CallToAction animado** — spotlight, grid sutil e badge pulsante
- **Totalmente responsivo** — mobile-first
- **Micro-interações** — hover effects, transições suaves

### 🌐 Internacionalização (i18n)
- Suporte a **3 idiomas**: 🇧🇷 Português, 🇺🇸 Inglês, 🇪🇸 Espanhol
- Seletor de idioma no navbar — muda toda a interface instantaneamente
- Contexto React (`LangContext`) com hook `useLang()`

### 🤖 Provedores de IA (alternáveis nas configurações)

| Provedor | Modelos | Tipo |
|----------|---------|------|
| **☁️ Replicate** | Llama 3 8B/70B, Llama 3.1 405B, LLaVA 13B, Salmonn, VideoLLaMA | Texto/Visão/Áudio/Vídeo |
| **🖥️ Ollama** | Qualquer modelo local (llama3, llava, mistral, gemma2) | Texto/Visão (100% offline) |

### 📎 Suporte Multimodal
- **Imagens** — enviadas como base64, processadas por LLaVA
- **Áudio** — processado pelo modelo Salmonn
- **Vídeo** — processado pelo VideoLLaMA 3
- **Arquivos de texto** (`.txt`, `.csv`, `.md`) — conteúdo injetado no chat

### 🛡️ Tratamento de Erros
- **402** (sem créditos) → toast com link para billing
- **429** (rate limit) → toast com tempo de espera
- **503** (Ollama offline) → toast com instrução `ollama serve`

---

## 🧱 Tech Stack

| Categoria | Tecnologia | Badge |
|-----------|------------|-------|
| **Framework** | Next.js 14 (App Router) | <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /> |
| **UI** | React 18 | <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" alt="React" /> |
| **Estilização** | Tailwind CSS 3 | <img src="https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" /> |
| **IA na Nuvem** | Replicate API | <img src="https://img.shields.io/badge/Replicate-Cloud_AI-purple?style=flat-square" alt="Replicate" /> |
| **IA Local** | Ollama | <img src="https://img.shields.io/badge/Ollama-Local_AI-000?style=flat-square" alt="Ollama" /> |
| **Streaming** | Vercel AI SDK (`ai`) | <img src="https://img.shields.io/badge/Vercel_AI-SDK-black?style=flat-square" alt="Vercel AI" /> |
| **i18n** | React Context API (custom) | <img src="https://img.shields.io/badge/i18n-Context_API-4B32C3?style=flat-square" alt="i18n" /> |
| **Notificações** | react-hot-toast | <img src="https://img.shields.io/badge/Toasts-hot--toast-FF6B6B?style=flat-square" alt="Toast" /> |
| **Componentes UI** | Headless UI | <img src="https://img.shields.io/badge/Headless_UI-66E3FF?style=flat-square" alt="Headless UI" /> |
| **Ícones** | Heroicons | <img src="https://img.shields.io/badge/Heroicons-3B82F6?style=flat-square" alt="Heroicons" /> |

---

## 🖼️ Live Preview


┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                    🌐 EN | PT | ES  │
│                                                             │
│                 [  ● SYSTEM ONLINE  ]  ← animated badge     │
│                                                             │
│                    BUILD SOMETHING AMAZING                  │
│            Modern AI chat interface for your next project   │
│                                                             │
│              ┌─────────────────────────┐                    │
│              │  🚀 Get Started →       │                    │
│              └─────────────────────────┘                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  💬 Chat messages appear here...                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📎 Attach  │  Type your message...        │  📤    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘


## 🌍 Internacionalização (i18n)

O componente usa **Context API** e o hook `useLang()` para gerenciar traduções.

### Idiomas suportados:
- 🇺🇸 **English** (default)
- 🇧🇷 **Português (BR)**
- 🇪🇸 **Español**

### Uso dentro do componente:

```jsx
const { t, language, setLanguage } = useLang();

return (
    <h1>{t("title")}</h1>
    <p>{t("subtitle")}</p>
    <span>{t("badge")}</span>
);
```

### Arquivos de tradução:

**📄 en.json**
```json
{
  "title": "Build something amazing",
  "subtitle": "Modern AI chat interface for your application",
  "badge": "✅ System online"
}
```

**📄 pt.json**
```json
{
  "title": "Construa algo incrível",
  "subtitle": "Interface de chat moderna para seu aplicativo",
  "badge": "✅ Sistema online"
}
```

**📄 es.json**
```json
{
  "title": "Construye algo increíble",
  "subtitle": "Interfaz de chat moderna para tu aplicación",
  "badge": "✅ Sistema en línea"
}
```

---

## 📦 Estrutura do Projeto

```
app/
├── api/
│   └── route.js              # Roteamento Replicate / Ollama
├── components/
│   ├── CallToAction.jsx      # Header animado (glassmorphism)
│   ├── ChatForm.jsx          # Input com anexo de mídia
│   ├── Dropdown.jsx          # Seletor de modelos
│   ├── EmptyState.jsx        # Estado inicial do chat
│   ├── Message.jsx           # Renderização de mensagens
│   ├── Metrics.jsx           # Métricas de performance
│   ├── SlideOver.jsx         # Painel de configurações
│   └── TokenForm.jsx         # Tela de configuração do token
├── LangContext/
│   ├── index.js              # Context provider + useLang hook
│   ├── en.json               # English translations
│   ├── pt.json               # Portuguese (BR) translations
│   └── es.json               # Spanish translations
├── layout.js                 # Layout raiz com LangProvider
└── page.js                   # Orquestrador principal
styles/
└── globals.css               # Design system (tokens, glassmorphism)
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Luann8/Chat-boot-llama.git

# Entre na pasta
cd Chat-boot-llama

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

---

### Modo Local (Ollama — Gratuito)

```bash
# 1. Instale o Ollama
# https://ollama.com/download

# 2. Baixe um modelo de texto
ollama pull llama3

# 3. (Opcional) Baixe um modelo de visão para usar com imagens
ollama pull llava
```

O serviço inicia automaticamente. No app, vá em **⚙️ Configurações → 🖥️ Ollama (Local)**.

---

### Modo Nuvem (Replicate)

1. Crie uma conta em [replicate.com](https://replicate.com)
2. Gere um token em [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
3. Ao abrir o app, cole o token na tela inicial
4. Selecione **☁️ Replicate (Nuvem)** nas configurações

> ⚠️ O Replicate é pago por uso. O modelo **Llama 3 8B** é o mais barato para testes.

---

## 🎨 Design Highlights

- 🌟 **Dynamic spotlight glow** — Gradientes radiais que seguem o mouse
- 🧊 **Glassmorphism card** — `backdrop-blur` + bordas semi-transparentes
- 💡 **Subtle noise texture** — Textura sutil para sensação premium
- ⚡ **Micro-interactions** — Badge pulsante, hover com scale, troca suave de idioma
- 📐 **Responsive typography** — `clamp()` para tamanhos de fonte fluidos

---

## 🧠 Inspiração & Créditos

Este projeto é inspirado no trabalho incrível da **Replicate** e sua interface Llama Chat.

<p align="center">
    <a href="https://github.com/replicate/llama-chat">
        <img src="https://img.shields.io/badge/Original_Project-Llama_Chat_·_Replicate-000?style=for-the-badge&logo=github" alt="Llama Chat Repo" />
    </a>
</p>

Agradecimentos especiais à comunidade open-source e ao time do Tailwind CSS.

---

## 📄 License

MIT © [Luann8](https://github.com/Luann8)

---

<p align="center">
    <strong>Feito com ☁️ · React · Next.js · Tailwind · i18n</strong><br />
    <sub>🇺🇸 English | 🇧🇷 Português (BR) | 🇪🇸 Español — mude o idioma seamless</sub>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Built_for-Startups_and_SaaS-FF6B6B?style=flat-square" />
    <img src="https://img.shields.io/badge/Ready_for-Vercel_·_Netlify-000?style=flat-square&logo=vercel" />
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</p>
```

Este README agora está completo e unificado, combinando:
- A tabela de tech stack do projeto original
- O componente CallToAction com suas características
- Guia completo de instalação e uso
- Estrutura de internacionalização
- Design highlights e créditos
