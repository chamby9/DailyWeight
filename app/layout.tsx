import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Link from 'next/link';
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DailyWeight",
  description: "Track your daily weight progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-base-100 text-base-content">
            <header className="navbar bg-base-200">
              <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                  DailyWeight
                </Link>
              </div>
              <div className="flex-none">
                <ThemeSwitcher />
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}