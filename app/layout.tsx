import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ABNovaMart",
  description:
    "Your one-stop shop for all your needs. E-Commerce store built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ReduxProvider>
          {/* Wrap with Cart Context (Provider) */}

          {/* Header goes here */}
          <Header />

          {/* Main content area - grows to fill space */}
          <main className="flex-1">{children}</main>

          {/* Footer goes here */}
          <Footer />
        </ReduxProvider>

        {/* shadcn Toast component */}
        <Toaster position="top-right" toastOptions={{ duration: 4500 }} />
      </body>
    </html>
  );
}
