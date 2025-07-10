import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/lib/auth-context";
import { NextAuthProvider } from "@/lib/next-auth-provider";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/components/theme-provider";
import { SonnerProvider } from "@/components/sonner-provider";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wesley van der Kraan | Portfolio & Blog",
  description:
    "Portfolio and blog showcasing professional development experiences and personal projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <AuthProvider>
              <LanguageProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1 max-w-7xl mx-auto w-full px-4">
                    {children}
                    <Analytics />
                  </main>
                  <Footer />
                  <SonnerProvider />
                </div>
              </LanguageProvider>
            </AuthProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
