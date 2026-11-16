declare module 'geojson-geometries-lookup' {
  import type {
    GeoJSON,
    Point,
    LineString,
    Polygon,
    FeatureCollection,
  } from '@types/geojson';

  export default class GeojsonGeometriesLookup {
    constructor(geoJson: GeoJSON);

    getContainers(geometry: Point | LineString | Polygon): FeatureCollection;
  }
}
