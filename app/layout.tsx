import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import { I18nProvider } from "@/components/i18n-provider";
import { AppHeader } from "@/components/layout/app-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getTranslations } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();

  return {
    title: {
      default: t("site.name"),
      template: `%s | ${t("site.name")}`,
    },
    description: t("site.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dictionary } = await getTranslations();

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] ${locale === "fa" ? vazirmatn.className : geistSans.className}`}
      >
        <ThemeProvider>
          <NeonAuthUIProvider authClient={authClient} emailOTP defaultTheme="dark">
            <I18nProvider locale={locale} dictionary={dictionary}>
              <AppHeader />
              <main className="flex w-full flex-1 flex-col">{children}</main>
            </I18nProvider>
          </NeonAuthUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
