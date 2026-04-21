import { useLang } from "../LangContext";

export default function EmptyState({ setOpen, setPrompt }) {
  const { t } = useLang();
  return (
    <div className="flex gap-x-4 mb-8">
      <span className="text-xl sm:text-2xl pt-4" title="IA">
        🦙
      </span>
      <div className="flex flex-col text-sm sm:text-base flex-1 gap-y-4 mt-1 rounded-2xl bg-surface/80 backdrop-blur-md border border-gray-700/50 text-gray-200 py-6 px-6 shadow-xl">
        <p className="font-medium text-lg text-primary">
          {t("emptyTitle")}
        </p>
        <p className="text-gray-400 font-light">{t("emptySubtitle")}</p>
      </div>
    </div>
  );
}
