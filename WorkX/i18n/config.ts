export const languages = {
  en: {
    nativeName: "English",
    englishName: "English",
  },

  hi: {
    nativeName: "हिंदी",
    englishName: "Hindi",
  },
} as const;

export type LanguageCode = keyof typeof languages;