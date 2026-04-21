import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import { LangProvider } from "./LangContext";

export const metadata = {
  title: {
    default: "Plataforma AI White-Label",
    template: "%s | Plataforma AI White-Label",
  },
  description:
    "Um assistente de inteligência artificial personalizável e de código aberto.",
  openGraph: {
    title: "Plataforma AI White-Label",
    description:
      "Um assistente de inteligência artificial personalizável e de código aberto.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦙</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <LangProvider>
          {children}
          <Analytics />
        </LangProvider>
      </body>
    </html>
  );
}