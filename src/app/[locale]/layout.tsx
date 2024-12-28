import type { Metadata } from "next";
import "../../styles/globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import i18nConfig from '@/../i18nConfig';
import { VideoProvider } from '@/app/[locale]/channel/videocontext';
import { dir } from 'i18next';
import TranslationsProvider from "@/components/providers/translations.provider";
import initTranslations from "@/app/i18n";
import "@/styles/clerk-edit.css"
import { ReactNode } from "react";
import { clerkLocalization } from "@/utils/clerk-localization-tool";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme.provider";

export const metadata: Metadata = {
  title: "VRoom",
  description: "VRoom Platform"
};

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

const i18nNamespaces = ['common', 'categories','tagname','admin-main'];

interface IRootLayoutProps {
  children: ReactNode,
  params: { locale: string }
}

async function RootLayout({ children, params: { locale } }: Readonly<IRootLayoutProps>) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <VideoProvider>
      <ThemeProvider>
        <ClerkProvider localization={clerkLocalization(locale)}>
          <html lang={locale} dir={dir(locale)} className="light">
            <body>
              <TranslationsProvider namespaces={i18nNamespaces}
                locale={locale}
                resources={resources}>
                <div className="flex overflow-hidden">
                  {children}
                </div>
                <Toaster />
              </TranslationsProvider>
            </body>
          </html>
        </ClerkProvider>
      </ThemeProvider>
    </VideoProvider>
  );
}

export default RootLayout;