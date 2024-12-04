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
    <html lang="en" data-theme="weightLight">
      <body className={`${inter.className} min-h-screen bg-base-100`}>
        <ThemeProvider>
          <div className="min-h-screen">
            <header className="navbar bg-base-200 shadow-md">
              <div className="flex-1 px-4">
                <Link href="/" className="btn btn-ghost text-xl normal-case">
                  DailyWeight
                </Link>
              </div>
              <div className="flex-none px-4">
                <ThemeSwitcher />
              </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}