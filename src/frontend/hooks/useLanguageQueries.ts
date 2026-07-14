import {useQueries, keepPreviousData} from '@tanstack/react-query';
import {AvailableLanguageTag, localeImports} from '../../../translations/index';
import {MessageFormatElement} from 'react-intl';

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
    combine: results => {
      const merged: Record<string, MessageFormatElement[]> = {};
      let isPending = true;

      // reversing languages mean the highest priority languages get merged last and overwites the lower priority languages
      for (const r of results.reverse()) {
        if (!r.isPending) {
          isPending = false;
        }

        if (r.data) {
          Object.assign(merged, r.data);
        }
      }
      return {data: merged, isPending};
    },
  });
}
