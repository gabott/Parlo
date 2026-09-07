export const SUPPORT_LOCALES = ["en", "fr"] as const;
export const FRENCH_VARIETIES = ["neutral", "fr-FR", "fr-CA"] as const;

export type SupportLocale = (typeof SUPPORT_LOCALES)[number];
export type FrenchVariety = (typeof FRENCH_VARIETIES)[number];
export type LocalizedText = Partial<Record<SupportLocale, string>> & { en: string };

export function localize(text: LocalizedText, locale: SupportLocale): string {
  return text[locale] ?? text.en;
}
