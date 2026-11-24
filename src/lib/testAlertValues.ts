import {RemoteDetectionAlert} from '@comapeo/schema';

type Geometry = RemoteDetectionAlert['geometry'];
type Position = [number, number];

const SIZE = 0.002;
const SPACING = SIZE * 6;

function square(lon: number, lat: number) {
  return [
    [lon - SIZE, lat - SIZE],
    [lon + SIZE, lat - SIZE],
    [lon + SIZE, lat + SIZE],
    [lon - SIZE, lat + SIZE],
    [lon - SIZE, lat - SIZE],
  ] satisfies [Position, Position, Position, Position, Position];
}

/**
 * One alert of every geometry type the map layer supports, laid out in a row so
 * they do not overlap. Each is labelled with its own geometry type, so the map
 * shows which types render.
 */
export function buildTestAlertValues(lon: number, lat: number) {
  const lonAt = (index: number) => lon + index * SPACING;
  const detectionDate = new Date().toISOString();

  const geometries: Geometry[] = [
    {type: 'Point', coordinates: [lonAt(0), lat]},
    {
      type: 'MultiPoint',
      coordinates: [
        [lonAt(1), lat - SIZE],
        [lonAt(1), lat + SIZE],
      ],
    },
    {
      type: 'LineString',
      coordinates: [
        [lonAt(2) - SIZE, lat - SIZE],
        [lonAt(2) + SIZE, lat + SIZE],
      ],
    },
    {
      type: 'MultiLineString',
      coordinates: [
        [
          [lonAt(3) - SIZE, lat - SIZE],
          [lonAt(3) + SIZE, lat - SIZE],
        ],
        [
          [lonAt(3) - SIZE, lat + SIZE],
          [lonAt(3) + SIZE, lat + SIZE],
        ],
      ],
    },
    {type: 'Polygon', coordinates: [square(lonAt(4), lat)]},
    {
      type: 'MultiPolygon',
      coordinates: [
        [square(lonAt(5), lat - SIZE * 2)],
        [square(lonAt(5), lat + SIZE * 2)],
      ],
    },
  ];

  return geometries.map(geometry => ({
    schemaName: 'remoteDetectionAlert' as const,
    detectionDateStart: detectionDate,
    detectionDateEnd: detectionDate,
    sourceId: `test-${geometry.type}-${detectionDate}`,
    metadata: {alert_type: geometry.type},
    geometry,
  }));
}
