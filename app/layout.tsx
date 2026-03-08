import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { CartHydrator } from "@/components/providers/CartHydrator";
import { BASE_URL } from "@/constants/apiUrl";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryData = await fetch(`${BASE_URL}/product-categories`)
    .then((res) => res.json())
    .catch((err) => console.log("Cannot fetch categories: ", err));

  console.log("Categories: ", categoryData);

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ReduxProvider>
          <CartHydrator />
          {/* Header goes here */}
          <Header categoryData={categoryData?.categories} />

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
