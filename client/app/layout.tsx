import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real Estate Platform",
  description: "Find your dream property",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Header />
            <main className="container mx-auto p-4">{children}</main>
            <Toaster />
            <footer className="bg-[#2C3E50] text-white p-4 mt-8">
              <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} EstatePro. All rights reserved.</p>
              </div>
            </footer>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
