import {useQueries, keepPreviousData} from '@tanstack/react-query';
import {AvailableLanguageTag, localeImports} from '../../../translations/index';

/**
 *
 * @description The tanstack query option `placeholderData` is set to `keepPreviousData`. This means this query will only ever be `pending` on initial load
 */
export function useLanguageQueries(languageCodes: AvailableLanguageTag[]) {
  return useQueries({
    queries: languageCodes.map(code => ({
      queryKey: ['language', code],
      queryFn: () =>
        localeImports[code]?.().then(m => m.default) ?? Promise.resolve({}),
      staleTime: Infinity,
      // see: https://tanstack.com/query/latest/docs/react/guides/paginated-queries#better-paginated-queries-with-placeholderdata
      placeholderData: keepPreviousData,
    })),
  });
}
