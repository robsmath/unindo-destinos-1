"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "../context/AuthContext";
import { PerfilProvider } from "../context/PerfilContext";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
          <AuthProvider>
            <PerfilProvider> {/* 🔥 Adiciona o PerfilProvider aqui */}
              <Lines />
              <Header />
              <Toaster richColors position="top-center" />
              {children}
              <Footer />
              <ScrollToTop />
            </PerfilProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
