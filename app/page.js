"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";
import SlideOver from "./components/SlideOver";
import EmptyState from "./components/EmptyState";
import QueuedSpinner from "./components/QueuedSpinner";
import CallToAction from "./components/CallToAction";
import Dropdown from "./components/Dropdown";
import { Cog6ToothIcon, CodeBracketIcon } from "@heroicons/react/20/solid";
import { useCompletion } from "ai/react";
import { Toaster, toast } from "react-hot-toast";
import { LlamaTemplate, Llama3Template } from "../src/prompt_template";
import TokenForm from "./components/TokenForm";
import { useLang } from "./LangContext";

import { countTokens } from "./src/tokenizer.js";

const MODELS = [
  {
    id: "meta/meta-llama-3-8b-instruct",
    name: "Meta Llama 3 8B",
    shortened: "8B",
    emoji: "🦙",
    description: "A Llama mais rápida e barata.",
    new: true,
  },
  {
    id: "meta/meta-llama-3-70b-instruct",
    name: "Meta Llama 3 70B",
    shortened: "70B",
    emoji: "🦙",
    description: "A Llama média, forte e flexível.",
    new: true,
  },
  {
    id: "meta/meta-llama-3.1-405b-instruct",
    name: "Meta Llama 3.1 405B",
    shortened: "405B",
    emoji: "🦙",
    description: "A Llama de próxima geração mais precisa e poderosa.",
    new: true,
  },
  {
    id: "meta/llama-2-70b-chat",
    name: "Meta Llama 2 70B",
    shortened: "70B",
    emoji: "🦙",
    description: "A Llama 2 mais precisa e poderosa.",
  },
  {
    id: "meta/llama-2-13b-chat",
    name: "Meta Llama 2 13B",
    shortened: "13B",
    emoji: "🦙",
    description: "Llama 2 mais rápida e barata à custa de precisão.",
  },
  {
    id: "meta/llama-2-7b-chat",
    name: "Meta Llama 2 7B",
    shortened: "7B",
    emoji: "🦙",
    description: "O menor e mais rápido modelo de chat Llama 2.",
  },
];

const llamaTemplate = LlamaTemplate();
const llama3Template = Llama3Template();

const generatePrompt = (template, systemPrompt, messages) => {
  const chat = messages.map((message) => ({
    role: message.isUser ? "user" : "assistant",
    content: message.text,
  }));

  return template([
    {
      role: "system",
      content: systemPrompt,
    },
    ...chat,
  ]);
};

const metricsReducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { startedAt: new Date() };
    case "FIRST_MESSAGE":
      return { ...state, firstMessageAt: new Date() };
    case "COMPLETE":
      return { ...state, completedAt: new Date() };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

export default function HomePage() {
  const { lang, changeLang, t } = useLang();
  const MAX_TOKENS = 8192;
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);
  const [tokenFormVisible, setTokenFormVisible] = useState(false);
  const [replicateApiToken, setReplicateApiToken] = useState(null);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    const token = e.target[0].value;
    console.log({ token });
    localStorage.setItem("replicate_api_token", token);
    setReplicateApiToken(token);
    setTokenFormVisible(false);
  };

  //   Llama params
  const [model, setModel] = useState(MODELS[0]); // default to 405B
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é um assistente de inteligência artificial prestativo, inteligente e amigável. Responda em português brasileiro."
  );
  const [temp, setTemp] = useState(0.75);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(800);

  //  Llava params
  const [image, setImage] = useState(null);

  // Salmonn params
  const [audio, setAudio] = useState(null);

  // VideoLlama params
  const [video, setVideo] = useState(null);

  // Provider: "replicate" | "ollama"
  const [provider, setProvider] = useState("replicate");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("llama3");

  const [metrics, dispatch] = useReducer(metricsReducer, {
    startedAt: null,
    firstMessageAt: null,
    completedAt: null,
  });

  const { complete, completion, setInput, input } = useCompletion({
    api: "/api",
    body: {
      replicateApiToken,
      model: model.id,
      systemPrompt: systemPrompt,
      temperature: parseFloat(temp),
      topP: parseFloat(topP),
      maxTokens: parseInt(maxTokens),
      image: image,
      audio: audio,
      video: video,
      provider,
      ollamaUrl,
      ollamaModel,
    },
    onError: (e) => {
      const errorText = e.toString();
      console.error(`Error converted to text: ${errorText}`);
      if (errorText.includes("402") || errorText.toLowerCase().includes("insufficient credit")) {
        toast.error(t("insufficientCredit"), { duration: 8000, icon: "💳" });
      } else if (errorText.includes("429") || errorText.toLowerCase().includes("too many requests")) {
        toast.error("⏳ Muitas requisições. Aguarde alguns segundos antes de tentar novamente.", { duration: 6000 });
      } else if (errorText.includes("503") || errorText.toLowerCase().includes("ollama")) {
        toast.error("🖥️ Ollama offline. Execute 'ollama serve' no terminal e tente novamente.", { duration: 8000 });
      } else {
        setError(e);
      }
    },
    onResponse: (response) => {
      setStarting(false);
      setError(null);
      dispatch({ type: "FIRST_MESSAGE" });
    },
    onFinish: () => {
      dispatch({ type: "COMPLETE" });
    },
  });

  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setInput((prev) => prev + `\n\n[Conteúdo do arquivo ${file.name}]:\n${text}\n`);
        toast.success("Texto do arquivo adicionado ao chat.");
      };
      reader.readAsText(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target.result;
      if (file.type.startsWith("audio/")) {
        setAudio(dataUri);
        toast.success(t("audioToast"));
      } else if (file.type.startsWith("image/")) {
        setImage(dataUri);
        toast.success(t("imageToast"));
      } else if (file.type.startsWith("video/")) {
        setVideo(dataUri);
        toast.success(t("videoToast"));
      } else {
        toast.error(`${t("unsupportedFile")}: ${file.type}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const setAndSubmitPrompt = (newPrompt) => {
    handleSubmit(newPrompt);
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    setSystemPrompt(event.target.systemPrompt.value);
    setReplicateApiToken(event.target.replicateApiToken.value);
    localStorage.setItem(
      "replicate_api_token",
      event.target.replicateApiToken.value
    );
  };

  const handleSubmit = async (userMessage) => {
    // Warn if Ollama is active, image is attached, but model is not a vision model
    if (provider === "ollama" && image) {
      const isVisionModel = ollamaModel.toLowerCase().includes("llava") ||
                            ollamaModel.toLowerCase().includes("vision") ||
                            ollamaModel.toLowerCase().includes("bakllava");
      if (!isVisionModel) {
        toast.error(
          `⚠️ O modelo "${ollamaModel}" não suporta imagens. Use um modelo de visão como "llava".\n\nInstale com: ollama pull llava`,
          { duration: 8000 }
        );
        return; // block the submission
      }
    }

    setStarting(true);
    const SNIP = "<!-- snip -->";

    const messageHistory = [...messages];
    if (completion.length > 0) {
      messageHistory.push({
        text: completion,
        isUser: false,
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
    });

    // Generate initial prompt and calculate tokens
    let prompt = `${generatePrompt(
      model.name.includes("Llama 3") ? llama3Template : llamaTemplate,
      systemPrompt,
      messageHistory
    )}\n`;

    console.log(prompt);

    // Check if we exceed max tokens and truncate the message history if so.
    while (countTokens(prompt) > MAX_TOKENS) {
      if (messageHistory.length < 3) {
        setError(
          "Your message is too long. Please try again with a shorter message."
        );

        return;
      }

      // Remove the third message from history, keeping the original exchange.
      messageHistory.splice(1, 2);

      // Recreate the prompt
      prompt = `${SNIP}\n${generatePrompt(
        llamaTemplate,
        systemPrompt,
        messageHistory
      )}\n`;
    }

    setMessages(messageHistory);

    dispatch({ type: "START" });

    complete(prompt);
  };

  useEffect(() => {
    if (messages?.length > 0 || completion?.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (localStorage.getItem("replicate_api_token")) {
      setReplicateApiToken(localStorage.getItem("replicate_api_token"));
      setTokenFormVisible(false);
    } else {
      setTokenFormVisible(true);
    }
  }, [messages, completion]);

  if (tokenFormVisible) {
    return <TokenForm handleTokenSubmit={handleTokenSubmit} t={t} />;
  }

  return (
    <>
      <CallToAction />
      <nav className="sm:pt-4 pt-4 px-4 sm:px-12 flex items-center justify-between w-full relative z-10 mb-4">
        <div className="flex items-center space-x-3 p-2 bg-surface/50 backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-lg">
          <div className="pl-4 font-semibold text-gray-200">{t("chatWith")}</div>
          <div className="font-semibold text-gray-200 sm:text-center">
            <Dropdown models={MODELS} selectedModel={model} setModel={setModel} />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={lang} 
            onChange={(e) => changeLang(e.target.value)}
            className="bg-surface/50 backdrop-blur-md border border-gray-800/50 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-lg"
          >
            <option value="pt">🇧🇷 PT-BR</option>
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
          </select>
          <a
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-300 bg-surface/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg hover:bg-surface hover:text-white transition-all hover:-translate-y-0.5"
            href="https://github.com/replicate/chat"
          >
            <CodeBracketIcon
              className="w-5 h-5 text-primary sm:mr-2"
              aria-hidden="true"
            />{" "}
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-300 bg-surface/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg hover:bg-surface hover:text-white transition-all hover:-translate-y-0.5"
            onClick={() => setOpen(true)}
          >
            <Cog6ToothIcon
              className="w-5 h-5 text-secondary sm:mr-2"
              aria-hidden="true"
            />{" "}
            <span className="hidden sm:inline">{t("settings")}</span>
          </button>
        </div>
      </nav>

      <Toaster position="top-left" reverseOrder={false} />

      <main className="max-w-2xl pb-5 mx-auto mt-4 sm:px-4">
        <div className="text-center"></div>

        <SlideOver
          open={open}
          setOpen={setOpen}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          replicateApiToken={replicateApiToken}
          setReplicateApiToken={setReplicateApiToken}
          handleSubmit={handleSettingsSubmit}
          temp={temp}
          setTemp={setTemp}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          topP={topP}
          setTopP={setTopP}
          models={MODELS}
          size={model}
          setSize={setModel}
          provider={provider}
          setProvider={setProvider}
          ollamaUrl={ollamaUrl}
          setOllamaUrl={setOllamaUrl}
          ollamaModel={ollamaModel}
          setOllamaModel={setOllamaModel}
        />

        <ChatForm
          prompt={input}
          setPrompt={setInput}
          onSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          image={image}
          audio={audio}
          video={video}
          clearMedia={() => {
            setImage(null);
            setAudio(null);
            setVideo(null);
          }}
          completion={completion}
          metrics={metrics}
        />

        {error && <div className="text-red-500">{error.toString()}</div>}

        <article className="pb-16">
          <EmptyState setPrompt={setAndSubmitPrompt} setOpen={setOpen} />

          {messages.map((message, index) => (
            <Message
              key={`message-${index}`}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          <Message message={completion} isUser={false} />

          {starting && <QueuedSpinner />}

          <div ref={bottomRef} />
        </article>
      </main>
    </>
  );
}
