import * as React from 'react'
import { IntlProvider as IntlProviderOrig, CustomFormats } from 'react-intl'

import messages from '../../../translations/messages.json'
import languages from '../languages.json'
import { usePersistedLocale } from '../hooks/persistedState/usePersistedLocale'

export const formats: CustomFormats = {
  date: {
    long: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
}

type TranslatedLocales = keyof typeof messages
type SupportedLanguageLocales = keyof typeof languages

interface LanguageName {
  /** IETF BCP 47 langauge tag with region code. */
  locale: SupportedLanguageLocales
  /** Localized name for language */
  nativeName: string
  /** English name for language */
  englishName: string
}

const translatedLocales = Object.keys(messages) as Array<TranslatedLocales>

export const supportedLanguages: LanguageName[] = translatedLocales
  .filter((locale) => {
    const hasAtLeastOneTranslatedString =
      Object.keys(messages[locale]).length > 0
    // This will show a typescript error if the language name does not exist
    const hasTranslatedLanguageName = languages[locale]
    if (!hasTranslatedLanguageName) {
      console.warn(
        `Locale "${locale}" is not available in Mapeo because we do not have
a language name and translations in \`src/frontend/languages.json\``,
      )
    }
    return hasAtLeastOneTranslatedString && hasTranslatedLanguageName
  })
  .map((locale) => ({
    locale,
    ...languages[locale],
  }))
  .sort((a, b) => {
    return a.englishName.localeCompare(b.englishName)
  })

export const IntlProvider = ({ children }: { children: React.ReactNode }) => {
  const appLocale = usePersistedLocale((store) => store.locale)

  const languageCode = appLocale.split('-')[0]

  // Add fallbacks for non-regional locales (e.g. "en" for "en-GB")
  const localeMessages = {
    ...messages[languageCode as TranslatedLocales],
    ...(messages[appLocale as TranslatedLocales] || {}),
  }

  return (
    <IntlProviderOrig
      key={appLocale}
      locale={appLocale}
      messages={localeMessages}
      formats={formats}
      onError={onError}
      wrapRichTextChunksInFragment
    >
      {children}
    </IntlProviderOrig>
  )
}

function onError(e: Error) {
  console.log(e)
}

// Device locale can be regional e.g. `en-US` but we might only have
// translations for `en`. If we don't have translations for a given device
// language, then we ignore it and fallback to `en` or the user selected
// language for the app
export function getSupportedLocale(
  locale: string,
): keyof typeof languages | undefined {
  if (supportedLanguages.find((lang) => lang.locale === locale))
    return locale as keyof typeof languages
  const nonRegionalLocale = locale.split('-')[0]
  if (supportedLanguages.find(({ locale }) => locale === nonRegionalLocale))
    return nonRegionalLocale as keyof typeof languages
}
