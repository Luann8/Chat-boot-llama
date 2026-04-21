import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function Dropdown({ models, selectedModel, setModel }) {
  return (
    <Menu as="div" className="relative inline-flex text-left">
      <div className="items-center">
        <Menu.Button className="inline-flex items-center w-full justify-center gap-x-1.5 rounded-md bg-surface/80 backdrop-blur-sm text-gray-200 border border-gray-700/50 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-700/50 hover:bg-surface transition-colors">
          {selectedModel.name}
          {selectedModel.new && (
            <span className="ml-2 inline-flex items-center rounded-md bg-primary/20 px-2 py-1 text-xs text-primary ring-1 ring-inset ring-primary/30">
              NEW
            </span>
          )}

          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-xl bg-surface/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {models.map((model) => (
              <Menu.Item key={model.id}>
                <button
                  className={`text-left text-gray-300 block w-full px-4 py-3 text-sm hover:bg-white/5 hover:text-white transition-colors`}
                  onClick={() => setModel(model)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={"font-medium"}>
                        {model.emoji} {model.name}{" "}
                        {model.new && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-primary/20 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/30">
                            NEW
                          </span>
                        )}
                      </p>
                      <p className="text-xs pt-1 font-light text-gray-500">
                        {model.description}
                      </p>
                    </div>

                    {selectedModel.id === model.id && (
                      <div className="flex items-center">
                        <CheckIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                </button>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
