import React from 'react';
import {
  type FilterSpecification,
  GeoJSONSource,
  Layer,
} from '@maplibre/maplibre-react-native';

import {RemoteDetectionAlert} from '@comapeo/schema';
import {FeatureCollection} from 'geojson';
import {useRemoteDetectionAlerts} from '../../../hooks/server/remoteDetectionAlert';

// Use modern MapLibre expression syntax (`geometry-type`) rather than the
// legacy `$type` filter form. The legacy form crashes MapLibre iOS 6.17.1's
// `predicateWithMLNJSONObject:` with an unrecognized-selector abort when the
// layer is added to the map (Android's SDK tolerates it; iOS does not).
const LABEL_FILTER: FilterSpecification = [
  'all',
  [
    'match',
    ['geometry-type'],
    [
      'Polygon',
      'LineString',
      'Point',
      'MultiLineString',
      'MultiPolygon',
      'MultiPoint',
    ],
    true,
    false,
  ],
  ['has', 'alertType'],
  ['has', 'monthDetec'],
  ['has', 'yearDetec'],
];

const POINT_FILTER: FilterSpecification = [
  'match',
  ['geometry-type'],
  ['Point', 'MultiPoint'],
  true,
  false,
];

const LINESTRING_FILTER: FilterSpecification = [
  'match',
  ['geometry-type'],
  ['LineString', 'MultiLineString'],
  true,
  false,
];

const POLYGON_STROKE_FILTER: FilterSpecification = [
  'match',
  ['geometry-type'],
  ['Polygon', 'MultiPolygon'],
  true,
  false,
];

const POLYGON_FILL_FILTER: FilterSpecification = [
  'match',
  ['geometry-type'],
  ['Polygon', 'MultiPolygon'],
  true,
  false,
];

export const RemoteDetectionAlertsMapLayer = () => {
  const {data: alerts} = useRemoteDetectionAlerts();

  if (!alerts) {
    return null;
  }

  return (
    <GeoJSONSource
      id="alerts-source"
      data={convertRemoteDetectionAlertsToFeatures(alerts)}>
      {/* Fill Layer for Polygon Fill */}
      <Layer
        type="fill"
        id="comapeo-alerts-polygon-fill"
        filter={POLYGON_FILL_FILTER}
        paint={{
          'fill-color': '#FF0000',
          'fill-opacity': 0.5,
        }}
      />

      {/* Line Layer for Polygon Stroke */}
      <Layer
        type="line"
        id="comapeo-alerts-polygon-stroke"
        filter={POLYGON_STROKE_FILTER}
        paint={{
          'line-color': '#FF0000',
          'line-width': 2,
        }}
      />

      {/* Line Layer for LineStrings and MultiLineStrings */}
      <Layer
        type="line"
        id="comapeo-alerts-linestring"
        filter={LINESTRING_FILTER}
        paint={{
          'line-color': '#FF0000',
          'line-width': 3,
          'line-opacity': 0.8,
        }}
      />

      {/* Circle Layer for Points */}
      <Layer
        type="circle"
        id="comapeo-alerts-point"
        filter={POINT_FILTER}
        paint={{
          'circle-radius': 5,
          'circle-color': '#FF0000',
        }}
      />

      {/* Symbol Layer for Labels */}
      <Layer
        type="symbol"
        id="comapeo-alerts-label"
        filter={LABEL_FILTER}
        style={{
          textField: [
            'concat',
            ['get', 'alertType'],
            ' (',
            ['get', 'monthDetec'],
            '-',
            ['get', 'yearDetec'],
            ')',
          ],
          textOffset: [0, 0.5],
          textAnchor: 'top',
          textColor: '#FFFFFF',
          textHaloColor: '#000000',
          textHaloWidth: 1,
          textHaloBlur: 1,
        }}
      />
    </GeoJSONSource>
  );
};

function convertRemoteDetectionAlertsToFeatures(
  alerts: RemoteDetectionAlert[],
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: alerts.map(alert => {
      const dateStart = new Date(alert.detectionDateStart);
      return {
        type: 'Feature',
        geometry: alert.geometry,
        properties: {
          alertType: alert.metadata.alert_type,
          detectionDateStart: alert.detectionDateStart,
          detectionDateEnd: alert.detectionDateEnd,
          sourceId: alert.sourceId,
          monthDetec: dateStart.getMonth() + 1,
          yearDetec: dateStart.getFullYear(),
        },
      };
    }),
  };
}
