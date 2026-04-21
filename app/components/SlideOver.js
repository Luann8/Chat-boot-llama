import { Fragment } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  XMarkIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useLang } from "../LangContext";

export default function SlideOver({
  open,
  setOpen,
  systemPrompt,
  setSystemPrompt,
  replicateApiToken,
  setReplicateApiToken,
  temp,
  setTemp,
  topP,
  setTopP,
  maxTokens,
  setMaxTokens,
  models,
  size,
  setSize,
  handleSubmit,
  provider,
  setProvider,
  ollamaUrl,
  setOllamaUrl,
  ollamaModel,
  setOllamaModel,
}) {
  const { t } = useLang();
  return (
    <Transition.Root show={open ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="flex h-full flex-col divide-y divide-gray-200 bg-surface text-gray-200 border-gray-700 shadow-xl"
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-gray-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            {t("chatWith")} Llama
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-gray-700 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Fechar painel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-300">
                            {t("subtitle")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          {/* ── Provider Toggle ── */}
                          <div className="space-y-4 pb-5 pt-6">
                            <div>
                              <label className="block font-bold text-sm leading-6 text-gray-200 mb-2">
                                {t("providerLabel")}
                              </label>
                              <div className="flex rounded-xl overflow-hidden border border-gray-700/50">
                                <button type="button" onClick={() => setProvider("replicate")}
                                  className={`flex-1 py-2 text-sm font-medium transition-all ${provider === "replicate" ? "bg-primary text-background" : "bg-surface text-gray-400 hover:bg-gray-700"}`}>
                                  ☁️ {t("cloudProvider")}
                                </button>
                                <button type="button" onClick={() => setProvider("ollama")}
                                  className={`flex-1 py-2 text-sm font-medium transition-all ${provider === "ollama" ? "bg-primary text-background" : "bg-surface text-gray-400 hover:bg-gray-700"}`}>
                                  🖥️ {t("localProvider")}
                                </button>
                              </div>
                            </div>

                            {provider === "ollama" && (
                              <>
                                <div>
                                  <label className="block font-bold text-sm leading-6 text-gray-200">{t("ollamaModel")}</label>
                                  <p className="mt-1 text-xs text-gray-500">{t("ollamaModelDesc")}</p>
                                  <input type="text" value={ollamaModel} onChange={(e) => setOllamaModel(e.target.value)} placeholder="llama3"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 bg-surface text-gray-200 ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm" />
                                </div>
                                <div>
                                  <label className="block font-bold text-sm leading-6 text-gray-200">{t("ollamaUrl")}</label>
                                  <p className="mt-1 text-xs text-gray-500">{t("ollamaUrlDesc")}</p>
                                  <input type="text" value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} placeholder="http://localhost:11434"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 bg-surface text-gray-200 ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm" />
                                </div>
                              </>
                            )}
                          </div>

                          {provider !== "ollama" && (
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="description"
                                className="block font-bold text-sm leading-6 text-gray-200"
                              >
                                {t("model")}
                              </label>

                              <p
                                id="system-prompt-description"
                                className="mt-2 text-xs text-gray-500"
                              >
                                {t("modelDesc") || "Tamanhos maiores = mais inteligência, mas mais lentos."}
                              </p>
                              <div className="relative mt-1">
                                <Listbox value={size} onChange={setSize}>
                                  <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-surface text-gray-200 border-gray-700 py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                      <span className="block truncate">
                                        {size ? size.name : "carregando..."}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute mt-1 max-h-60 w-full shadow-md overflow-auto border-gray-700 rounded-md bg-surface text-gray-200 border-gray-700 py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {models
                                          ? models.map((model, modelIdx) => (
                                              <Listbox.Option
                                                key={modelIdx}
                                                className={({ active }) =>
                                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active
                                                      ? "bg-surface text-white"
                                                      : "text-gray-300"
                                                  }`
                                                }
                                                value={model}
                                              >
                                                {({ selected }) => (
                                                  <>
                                                    <span
                                                      className={`block truncate ${
                                                        selected
                                                          ? "font-medium"
                                                          : "font-normal"
                                                      }`}
                                                    >
                                                      {model.name}
                                                    </span>
                                                    {selected ? (
                                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                        <CheckIcon
                                                          className="h-5 w-5"
                                                          aria-hidden="true"
                                                        />
                                                      </span>
                                                    ) : null}
                                                  </>
                                                )}
                                              </Listbox.Option>
                                            ))
                                          : null}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </Listbox>
                              </div>
                            </div>
                          </div>
                          )}

                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="description"
                                className="block font-bold text-sm leading-6 text-gray-200"
                              >
                                {t("systemPromptTitle")}
                              </label>
                              <p
                                id="system-prompt-description"
                                className="mt-2 text-xs text-gray-500"
                              >
                                {t("systemPromptDesc")}
                              </p>
                              <div className="mt-3">
                                <textarea
                                  id="systemPrompt"
                                  name="systemPrompt"
                                  rows={4}
                                  className="block w-full rounded-md border-0 py-1.5 bg-surface text-gray-200 ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  value={systemPrompt}
                                  onChange={(e) =>
                                    setSystemPrompt(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="description"
                                className="block font-bold text-sm leading-6 text-gray-200"
                              >
                                {t("apiTokenTitle")}
                              </label>
                              <p
                                id="system-prompt-description"
                                className="mt-2 text-xs text-gray-500"
                              >
                                {t("apiTokenDesc")}
                              </p>
                              <div className="mt-3">
                                <input
                                  id="replicateApiToken"
                                  name="replicateApiToken"
                                  type="password"
                                  className="block w-full rounded-md border-0 py-1.5 bg-surface text-gray-200 ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  value={replicateApiToken}
                                  onChange={(e) =>
                                    setReplicateApiToken(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="temperature"
                                className="block text-sm font-bold leading-6 text-gray-200"
                              >
                                {t("temperature")} - {temp}
                              </label>
                              <p
                                className="mt-2 text-xs text-gray-500"
                                id="temperature-description"
                              >
                                {t("temperatureDesc")}
                              </p>
                              <div className="mt-3">
                                <input
                                  id="temperature"
                                  type="range"
                                  min="0.01"
                                  onChange={(e) => setTemp(e.target.value)}
                                  value={temp}
                                  max="5"
                                  step="0.01"
                                  name="temperature"
                                  className="w-full h-1 bg-gray-700 accent-primary rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="temperature"
                                className="block text-sm font-bold leading-6 text-gray-200"
                              >
                                {t("topP")} - {topP}
                              </label>
                              <p
                                className="mt-2 text-xs text-gray-500"
                                id="temperature-description"
                              >
                                {t("topPDesc")}
                              </p>
                              <div className="mt-3">
                                <input
                                  id="topP"
                                  type="range"
                                  min="0.01"
                                  onChange={(e) => setTopP(e.target.value)}
                                  value={topP}
                                  max="1"
                                  step="0.01"
                                  name="topP"
                                  className="w-full h-1 bg-gray-700 accent-primary rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="temperature"
                                className="block text-sm font-bold leading-6 text-gray-200"
                              >
                                {t("maxTokens")} - {maxTokens}
                              </label>
                              <p
                                className="mt-2 text-xs text-gray-500"
                                id="temperature-description"
                              >
                                {t("maxTokensDesc")}
                              </p>
                              <div className="mt-3">
                                <input
                                  id="maxTokens"
                                  type="range"
                                  min="1"
                                  onChange={(e) => setMaxTokens(e.target.value)}
                                  value={maxTokens}
                                  max="500"
                                  step="1"
                                  name="maxTokens"
                                  className="w-full h-1 bg-gray-700 accent-primary rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 px-4 py-4 flex justify-end space-x-3">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            {t("save")}
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-surface text-gray-200 border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
