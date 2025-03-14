import React from 'react';
import MapboxGL from '@rnmapbox/maps';

import {RemoteDetectionAlert} from '@comapeo/schema';
import {FeatureCollection} from 'geojson';
import {useActiveProject} from '../../../contexts/ActiveProjectContext';
import {useManyDocs} from '@comapeo/core-react';

const LABEL_FILTER = [
  'all',
  [
    'in',
    '$type',
    'Polygon',
    'LineString',
    'Point',
    'MultiLineString',
    'MultiPolygon',
    'MultiPoint',
  ],
  ['has', 'alertType'],
  ['has', 'monthDetec'],
  ['has', 'yearDetec'],
];

const POINT_FILTER = ['in', '$type', 'Point', 'MultiPoint'];

const LINESTRING_FILTER = ['in', '$type', 'LineString', 'MultiLineString'];

const POLYGON_STROKE_FILTER = ['in', '$type', 'Polygon', 'MultiPolygon'];

const POLYGON_FILL_FILTER = ['in', '$type', 'Polygon', 'MultiPolygon'];

export const RemoteDetectionAlertsMapLayer = () => {
  const {projectId} = useActiveProject();
  const {data: alerts} = useManyDocs({
    projectId,
    docType: 'remoteDetectionAlert',
  });

  if (!alerts) {
    return null;
  }

  return (
    <MapboxGL.ShapeSource
      id="alerts-source"
      shape={convertRemoteDetectionAlertsToFeatures(alerts)}>
      {/* Fill Layer for Polygon Fill */}
      <MapboxGL.FillLayer
        id="comapeo-alerts-polygon-fill"
        filter={POLYGON_FILL_FILTER}
        style={{
          fillColor: '#FF0000',
          fillOpacity: 0.5,
        }}
      />

      {/* Line Layer for Polygon Stroke */}
      <MapboxGL.LineLayer
        id="comapeo-alerts-polygon-stroke"
        filter={POLYGON_STROKE_FILTER}
        style={{
          lineColor: '#FF0000',
          lineWidth: 2,
        }}
      />

      {/* Line Layer for LineStrings and MultiLineStrings */}
      <MapboxGL.LineLayer
        id="comapeo-alerts-linestring"
        filter={LINESTRING_FILTER}
        style={{
          lineColor: '#FF0000',
          lineWidth: 3,
          lineOpacity: 0.8,
        }}
      />

      {/* Circle Layer for Points */}
      <MapboxGL.CircleLayer
        id="comapeo-alerts-point"
        filter={POINT_FILTER}
        style={{
          circleRadius: 5,
          circleColor: '#FF0000',
        }}
      />

      {/* Symbol Layer for Labels */}
      <MapboxGL.SymbolLayer
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
          textFont: ['Open Sans Regular'],
          textOffset: [0, 0.5],
          textAnchor: 'top',
          textColor: '#FFFFFF',
          textHaloColor: '#000000',
          textHaloWidth: 1,
          textHaloBlur: 1,
        }}
      />
    </MapboxGL.ShapeSource>
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
