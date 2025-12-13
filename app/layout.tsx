import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import { SidebarProvider } from "@/contexts/sidebar-context";
import ToastProvider from "@/components/toast-container";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "In Next.js and Tailwind CSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`  ${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <SidebarProvider>
          <Sidebar />

          {/* MAIN CONTENT */}
          <main className="md:ml-64 w-full h-screen overflow-y-auto bg-gray-50">
            {children}
          </main>
          <ToastProvider />
        </SidebarProvider>
      </body>
    </html>
  );
}
