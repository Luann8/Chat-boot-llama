"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("pt");

  useEffect(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem("language");
    if (saved && translations[saved]) {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem("language", newLang);
    }
  };

  const t = (key) => {
    return translations[lang][key] || translations["pt"][key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
