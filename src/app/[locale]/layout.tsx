import type { Metadata } from "next";
import "../../styles/globals.css";
import {
    ClerkProvider,
} from '@clerk/nextjs'
import i18nConfig from '@/../i18nConfig';
import { dir } from 'i18next';
import TranslationsProvider from "@/components/providers/translations.provider";
import initTranslations from "@/app/i18n";
import "@/styles/clerk-edit.css"
import {ReactNode} from "react";
import {clerkLocalization} from "@/utils/clerk-localization-tool";
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "VRoom",
  description: "VRoom Platform"
};

export function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ locale }));
}

const i18nNamespaces = ['common', 'categories']

interface IRootLayoutProps {
    children: ReactNode,
    params: { locale: string }
}

async function RootLayout({ children, params: { locale } }: Readonly<IRootLayoutProps>) {
    const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
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
  );
}

export default RootLayout;