import {fromLatLon} from 'utm';
import {toLatLon} from './UtmForm';

describe('toLatLon()', () => {
  const validLonLatFixtures: Array<[number, number]> = [
    [45, -45],
    [-45, 45],
    [0, 0],
  ];

  for (const fixture of validLonLatFixtures) {
    const expectedLon = fixture[0];
    const expectedLat = fixture[1];

    const utmFixture = fromLatLon(expectedLat, expectedLon);

    it('returns expected latitude and longitude', () => {
      const result = toLatLon({
        zoneLetter: utmFixture.zoneLetter,
        zoneNum: utmFixture.zoneNum.toString(),
        easting: utmFixture.easting.toString(),
        northing: utmFixture.northing.toString(),
      });

      expect(result.longitude).toBeCloseTo(expectedLon);
      expect(result.latitude).toBeCloseTo(expectedLat);
    });

    it('throws when zone letter is not specified', () => {
      expect(() => {
        toLatLon({
          zoneLetter: '',
          zoneNum: utmFixture.zoneLetter.toString(),
          easting: utmFixture.easting.toString(),
          northing: utmFixture.northing.toString(),
        });
      }).toThrow();
    });

    it('throws when zone number is not specified', () => {
      expect(() => {
        toLatLon({
          zoneLetter: utmFixture.zoneLetter,
          zoneNum: '',
          easting: utmFixture.easting.toString(),
          northing: utmFixture.northing.toString(),
        });
      }).toThrow();
    });

    it('throws when northing is not specified', () => {
      expect(() => {
        toLatLon({
          zoneLetter: utmFixture.zoneLetter,
          zoneNum: utmFixture.zoneNum.toString(),
          easting: utmFixture.easting.toString(),
          northing: '',
        });
      }).toThrow();
    });

    it('throws when easting is not specified', () => {
      expect(() => {
        toLatLon({
          zoneLetter: utmFixture.zoneLetter,
          zoneNum: utmFixture.zoneNum.toString(),
          easting: '',
          northing: utmFixture.northing.toString(),
        });
      }).toThrow();
    });
  }
});
