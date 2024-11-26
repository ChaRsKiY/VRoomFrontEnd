'use client';

import React from 'react'
import { I18nextProvider } from 'react-i18next';
import { createInstance, Namespace, Resources } from 'i18next';
import initTranslations from "@/app/i18n";

interface ITranslationProvider {
    children: React.ReactNode,
    locale: string,
    namespaces: Namespace[],
    resources: Resources
}

export default function TranslationsProvider({
    children,
    locale,
    namespaces,
    resources
}: ITranslationProvider) {
    const i18n = createInstance();

    initTranslations(locale, namespaces, i18n, resources);

    return <I18nextProvider i18n={i18n}> {children} </I18nextProvider>;
}