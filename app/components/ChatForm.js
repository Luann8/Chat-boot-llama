import { useRef, useState } from "react";
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLang } from "../LangContext";

const ChatForm = ({ prompt, setPrompt, onSubmit, disabled, handleFileUpload, image, audio, video, clearMedia }) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { t } = useLang();

  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = prompt.trim();
    // Allow submit if there is media attached OR there is prompt text
    if (disabled || (!value && !image && !audio && !video)) return;

    onSubmit(value);
    setPrompt("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleChange = (e) => {
    setPrompt(e.target.value);
    autoResize(e.target);
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
      // Reset input so the same file can be selected again if needed
      e.target.value = null;
    }
  };


  // Determine if there's any active media
  const activeMedia = image || audio || video;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-xl border-t border-gray-800/50 py-3 px-4">
      <div className="container max-w-2xl mx-auto flex flex-col space-y-2">
        {/* Media Preview Area */}
        {activeMedia && (
          <div className="flex items-center space-x-3 bg-surface/80 border border-gray-700/50 rounded-xl px-4 py-2 w-max shadow-sm">
            {image && <span className="text-sm text-gray-300 font-medium">{t("imageAttached")}</span>}
            {audio && <span className="text-sm text-gray-300 font-medium">{t("audioAttached")}</span>}
            {video && <span className="text-sm text-gray-300 font-medium">{t("videoAttached")}</span>}
            
            <button
              type="button"
              onClick={clearMedia}
              className="text-gray-400 hover:text-red-400 transition-colors bg-gray-800 rounded-full p-1"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="relative flex w-full rounded-2xl shadow-2xl bg-surface/80 backdrop-blur-md border border-gray-700/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all group"
        >
          {/* Glow/border effect removed as the parent handles it */}

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex items-center justify-center rounded-l-2xl border-0 bg-transparent px-4 text-gray-400 hover:text-primary transition-colors z-10"
            disabled={disabled}
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
            accept="image/*,audio/*,video/*,.txt,.csv,.md"
          />

          <textarea
            ref={textareaRef}
            name="prompt"
            value={prompt}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            autoFocus
            autoComplete="off"
            rows={1}
            disabled={disabled}
            className="relative flex-1 resize-none overflow-hidden border-0 bg-transparent px-2 py-3 text-white placeholder:text-gray-500 focus:outline-none !ring-0 !border-transparent transition-all text-sm"
          />

          <button
            type="submit"
            disabled={disabled || (!prompt.trim() && !activeMedia)}
            className="relative rounded-r-2xl bg-primary px-4 py-3 text-sm font-bold text-background transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("send")}
          </button>
        </form>
      </div>
    </footer>
  );
};

export default ChatForm;