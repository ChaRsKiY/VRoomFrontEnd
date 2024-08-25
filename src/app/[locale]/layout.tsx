import type { Metadata } from "next";
import "../../styles/globals.css";
import {
    ClerkProvider,
} from '@clerk/nextjs'
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import i18nConfig from '@/../i18nConfig';
import { dir } from 'i18next';
import TranslationsProvider from "@/components/providers/translations.provider";
import initTranslations from "@/app/i18n";

export const metadata: Metadata = {
  title: "VRoom",
  description: "VRoom Platform"
};

export function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({ locale }));
}

const i18nNamespaces = ['common', 'categories']

async function RootLayout({ children, params: { locale } }: Readonly<{ children: React.ReactNode, params: { locale } }>) {
    const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
      <ClerkProvider>
        <html lang={locale} dir={dir(locale)} className="light">
                <body>
                <TranslationsProvider namespaces={i18nNamespaces}
                                      locale={locale}
                                      resources={resources}>
                    <HeaderHome t={t}/>
                    <div className="flex pt-20 overflow-hidden">
                        {children}
                    </div>
                </TranslationsProvider>
                </body>
        </html>
      </ClerkProvider>
  );
}

export default RootLayout;