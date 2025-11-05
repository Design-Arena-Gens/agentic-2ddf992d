import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apostila Matemática | Operações com Naturais",
  description:
    "Apostila didática ilustrada sobre as operações fundamentais com números naturais, incluindo teoria, exemplos e exercícios contextualizados.",
  authors: [{ name: "Equipe Didática" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
