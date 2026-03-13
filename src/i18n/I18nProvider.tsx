"use client";

import React, { useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

import en from "./messages/en.json";
import pl from "./messages/pl.json";
import de from "./messages/de.json";

const MESSAGES: Record<string, typeof en> = { en, pl, de };
const SUPPORTED_LOCALES = ["en", "pl", "de"];

function detectLocale(): string {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
    const browserLang = navigator.language.slice(0, 2);
    return SUPPORTED_LOCALES.includes(browserLang) ? browserLang : "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState("en");

    useEffect(() => {
        const detected = detectLocale();
        setLocale(detected);
        localStorage.setItem("lang", detected);

        // Listen for locale changes from LanguageSwitcher
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "lang" && e.newValue && SUPPORTED_LOCALES.includes(e.newValue)) {
                setLocale(e.newValue);
            }
        };
        window.addEventListener("storage", handleStorage);

        // Custom event for same-tab locale changes
        const handleLocaleChange = (e: Event) => {
            const detail = (e as CustomEvent<string>).detail;
            if (SUPPORTED_LOCALES.includes(detail)) {
                setLocale(detail);
            }
        };
        window.addEventListener("localeChange", handleLocaleChange);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("localeChange", handleLocaleChange);
        };
    }, []);

    return (
        <NextIntlClientProvider locale={locale} messages={MESSAGES[locale] || MESSAGES.en} timeZone="Europe/Warsaw">
            {children}
        </NextIntlClientProvider>
    );
}
