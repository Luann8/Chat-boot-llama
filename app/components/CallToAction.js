import { useLang } from "../LangContext";

export default function CallToAction() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface via-white/[0.03] to-background border-b border-gray-700/30 py-12 text-center z-10">
      {/* Background glow system */}
      <div className="absolute inset-0 -z-10">
        {/* Main bright spotlight */}
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-400/20 blur-[120px] rounded-full" />

        {/* Secondary warm glow */}
        <div className="absolute bottom-[-120px] right-[-80px] w-[500px] h-[500px] bg-blue-400/15 blur-[130px] rounded-full" />

        {/* Soft center lift */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />

        {/* Grid with stronger visibility */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff30_1px,transparent_1px),linear-gradient(to_bottom,#ffffff30_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="flex flex-col items-center px-4 max-w-3xl mx-auto space-y-6">
        {/* Logo */}
        <div className="relative flex items-center justify-center w-28 h-28 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-md">
          {/* glow ring */}
          <div className="absolute inset-[-8px] rounded-2xl border border-emerald-300/20 animate-pulse" />

          {/* inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl opacity-60" />

          <img
            src="/logo.png"
            alt="Logo"
            className="relative h-16 w-auto object-contain grayscale-0 opacity-100"
          />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-emerald-200">
            {t("title")}
          </h1>

          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Badge (more visible) */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 shadow-md hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300" />
          </div>

          <p className="text-xs font-medium text-gray-200 tracking-wide">
            {t("badge")}
          </p>
        </div>
      </div>
    </section>
  );
}