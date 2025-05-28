"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/Common/ErrorBoundary";
import PWANotifications from "@/components/Common/PWANotifications";
import AccessibilityToolbar from "@/components/Common/AccessibilityToolbar";
import SkipLinks from "@/components/Common/SkipLinks";
import SEOHead from "@/components/Common/SEOHead";
import PerformanceMonitor from "@/components/Common/PerformanceMonitor";
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
      <head>
        <SEOHead />
      </head>
      <body className={`dark:bg-black ${inter.className}`}>
        <SkipLinks />
        <ThemeProvider enableSystem={false} attribute="class" defaultTheme="light">
          <ErrorBoundary>
            <AuthProvider>
              <PerfilProvider>
                <Lines />
                <Header />
                <Toaster richColors position="top-center" />
                <main id="main-content" className="focus:outline-none" tabIndex={-1}>
                  <ErrorBoundary fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Erro no conteúdo</h2>
                        <p className="text-gray-600">Recarregue a página para tentar novamente.</p>
                      </div>
                    </div>
                  }>
                    {children}
                  </ErrorBoundary>
                </main>
                <Footer />
                <ScrollToTop />
                <PWANotifications />
                <AccessibilityToolbar />
                <PerformanceMonitor enableDeviceInfo={process.env.NODE_ENV === 'development'} />
              </PerfilProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
