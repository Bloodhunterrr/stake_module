export const ALLOWED_LANGUAGES = {
    en: { name: "English", code: "en" },
    it: { name: "Italiano", code: "it" },
    es: { name: "Español", code: "es" },
    fr: { name: "Français", code: "fr" },
    sq: { name: "Shqip", code: "sq" },
  } as const;
  
  export type Language = keyof typeof ALLOWED_LANGUAGES;
  