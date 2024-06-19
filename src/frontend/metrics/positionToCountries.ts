import borders from '@osm_borders/maritime_10000m';
import GeojsonGeometriesLookup from 'geojson-geometries-lookup';

let lookup: undefined | GeojsonGeometriesLookup;

export function positionToCountries(
  latitude: number,
  longitude: number,
): Set<string> {
  lookup ??= new GeojsonGeometriesLookup(borders);

  const result = new Set<string>();

  const {features} = lookup.getContainers({
    type: 'Point',
    coordinates: [longitude, latitude],
  });
  for (const {properties} of features) {
    if (
      properties &&
      'isoA3' in properties &&
      typeof properties.isoA3 === 'string'
    ) {
      result.add(properties.isoA3);
    }
  }

  return result;
}
