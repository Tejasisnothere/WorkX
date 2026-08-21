import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  languages,
  type LanguageCode,
} from "@/i18n/config";

const LANGUAGE_KEY = "preferred_language";

export async function saveLanguage(
  language: LanguageCode,
) {
  await AsyncStorage.setItem(
    LANGUAGE_KEY,
    language,
  );
}

export async function getSavedLanguage(): Promise<LanguageCode | null> {
  const value = await AsyncStorage.getItem(
    LANGUAGE_KEY,
  );

  if (!value || !(value in languages)) {
    return null;
  }

  return value as LanguageCode;
}