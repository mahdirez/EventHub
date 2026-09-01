import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/site-header";
import { getTranslations } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <NeonAuthUIProvider authClient={authClient} emailOTP defaultTheme="system">
          <I18nProvider locale={locale} dictionary={dictionary}>
            <SiteHeader />
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
              {children}
            </main>
          </I18nProvider>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
