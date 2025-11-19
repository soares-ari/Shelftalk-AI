import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShelfTalk AI",
  description: "Geração automática de conteúdo para e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e293b", // slate-800
              color: "#f1f5f9", // slate-100
              border: "1px solid #334155", // slate-700
            },
            success: {
              iconTheme: {
                primary: "#10b981", // emerald-500
                secondary: "#f1f5f9",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444", // red-500
                secondary: "#f1f5f9",
              },
            },
          }}
        />
      </body>
    </html>
  );
}