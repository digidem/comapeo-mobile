import {useMapStyleUrl} from '@comapeo/core-react';
import {useQuery} from '@tanstack/react-query';
import * as v from 'valibot';

export function useMapStyleJsonUrl() {
  const {data, error, isRefetching} = useMapStyleUrl();

  // If we're running E2E tests (e.g. on BrowserStack), fall back to a
  // public Mapbox style rather than our local style server to avoid 502 errors.
  // (see https://github.com/digidem/comapeo-mobile/issues/1008)
  if (process.env.EXPO_PUBLIC_E2E_TEST) {
    if (!process.env.MAPBOX_ACCESS_TOKEN) {
      throw new Error('Missing mapbox access token');
    }
    return {
      data: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
      error: null,
      isRefetching: false,
    };
  }

  return {
    data,
    error,
    isRefetching,
  };
}

const StyleWithGlyphsSchema = v.object({
  glyphs: v.pipe(v.string(), v.nonEmpty()),
});

/**
 * Whether the current map style provides a glyphs (font) endpoint.
 *
 * A style without one cannot render text at all, and MapLibre fails the layout
 * of the whole source a symbol layer belongs to — so any shapes sharing that
 * source disappear too, not just the labels. Callers use this to skip symbol
 * layers entirely rather than lose their shapes.
 */
export function useMapStyleHasGlyphs() {
  const {data: styleUrl} = useMapStyleJsonUrl();

  return useQuery({
    queryKey: ['mapStyleHasGlyphs', styleUrl],
    queryFn: async () => {
      const response = await fetch(styleUrl);
      return v.is(StyleWithGlyphsSchema, await response.json());
    },
    staleTime: Infinity,
  });
}
