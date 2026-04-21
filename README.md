import React, { useState } from 'react';

export default function ChatLayout() {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans">   
      {/* SIDEBAR - Toques de modernidade com degradê */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">🦙</div>
          <h1 className="font-bold text-lg tracking-tight">Llama Evolution</h1>
        </div>
      <nav className="flex-1 p-4 space-y-2">
          <button className="w-full text-left p-3 rounded-md bg-gray-800 hover:bg-gray-700 transition">
            ＋ Novo Chat
          </button>
        </nav>
        {/* SELETOR DE IDIOMAS QUE VOCÊ ADICIONOU */}
        <div className="p-4 border-t border-gray-800">
          <select className="bg-gray-800 text-sm rounded-md w-full p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="pt">🇧🇷 Português</option>
            <option value="es">🇪🇸 Español</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>
      </aside>
      {/* ÁREA PRINCIPAL DO CHAT */}
      <main className="flex-1 flex flex-col relative">
        {/* HEADER */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-400">Llama 3 8B - Local/Cloud</span>
          </div>
        </header>
        {/* MENSAGENS (Onde o map do chat acontece) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto w-full">
          {/* Exemplo de Mensagem do Usuário */}
          <div className="flex flex-col items-end">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg">
              Olá! Como o Llama 3 pode me ajudar hoje?
            </div>
          </div>
          {/* Exemplo de Resposta do Llama */}
          <div className="flex flex-col items-start">
            <div className="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] shadow-md">
              ¡Hola! Estoy listo para ayudarle. Como versão atualizada, posso rodar localmente ou na nuvem.
            </div>
          </div>
        </div>
        {/* INPUT DE MENSAGEM - Fixado embaixo */}
        <footer className="p-4 bg-transparent">
          <div className="max-w-3xl mx-auto relative">
            <textarea 
              rows="1"
              placeholder="Pergunte algo ao Llama..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-2xl"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-500 mt-2">
            Llama Chat Evolution - Rodando via Replicate/Local Engine
          </p>
        </footer>
      </main>
    </div>
  );
}
