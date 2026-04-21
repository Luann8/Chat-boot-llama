import Link from "next/link";

export default function TokenForm({ handleTokenSubmit, t }) {
  // Fallback for t if not provided
  const tr = t || ((k) => k);
  return (
    <div className="landing-page container flex-column mx-auto mt-24 p-4">
      <div className="hero mx-auto">
        <div className="hero-text text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            🦙 {tr("tokenTitle") === "tokenTitle" ? "Ready to chat?" : tr("tokenTitle")}
          </h1>
        </div>

        <div className="mt-12 max-w-xl mx-auto text-center">
            <p className="text-lg text-gray-400">
              {tr("tokenDesc") === "tokenDesc"
                ? "You need a Replicate API token to start."
                : tr("tokenDesc")}{" "}
              <Link
                className="underline"
                href="https://replicate.com/account/api-tokens?utm_campaign=llama2ai&utm_source=project"
                target="_blank"
                rel="noopener noreferrer"
              >
                Replicate API token
              </Link>{" "}
            </p>

            <form onSubmit={handleTokenSubmit} className="bg-surface/80 backdrop-blur-md p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
              <label htmlFor="api-key" className="sr-only">
                API token
              </label>
              <input
                type="text"
                name="api-key"
                id="api-key"
                className="block mt-6 w-full p-4 rounded-xl border border-gray-700/50 bg-background/50 text-white placeholder-gray-500 shadow-sm focus:border-primary focus:ring-primary text-lg transition-colors"
                placeholder="Cole seu token da API Replicate aqui..."
                minLength="40"
                maxLength="40"
                required
              />
              <div className="mt-8 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-primary to-secondary p-4 text-lg font-bold text-background shadow-lg hover:from-secondary hover:to-primary hover:scale-[1.02] transform transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {tr("saveToken") === "saveToken" ? "Start chatting →" : tr("saveToken")}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
