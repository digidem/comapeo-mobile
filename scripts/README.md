# CoMapeo Build scripts

## [`build-intl-polyfills.mjs`](./build-intl-polyfills.mjs)

Script used for generating a file that serves as a module to import polyfill-related code from [`@formatjs`](https://formatjs.io/). This polyfils various `Intl` APIs that are necessary for internationalization support in the app.

https://formatjs.io/docs/polyfills

Currently, we polyfill the following APIs:

- [`Intl.getCanonicalLocales`](https://formatjs.io/docs/polyfills/intl-getcanonicallocales)
- [`Intl.locale`](https://formatjs.io/docs/polyfills/intl-locale/)
- [`Intl.PluralRules`](https://formatjs.io/docs/polyfills/intl-pluralrules)
- [`Intl.RelativeTimeFormat`](https://formatjs.io/docs/polyfills/intl-relativetimeformat)
