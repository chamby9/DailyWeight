import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

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
      <body className={GeistSans.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-base-100 text-base-content">
            <header className="navbar bg-base-200">
              <div className="flex-1">
                <a href="/" className="btn btn-ghost text-xl">DailyWeight</a>
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