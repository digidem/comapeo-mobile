import {calculateTotalDistance} from './distance';

describe('calculateTotalDistance', () => {
  it('calculates the total distance for a single point (should be 0)', () => {
    const points = [
      {latitude: 40.7128, longitude: -74.006}, // New York City, USA
    ];

    expect(calculateTotalDistance(points)).toBe(0);
  });
  it('calculateTotalDistance between two different points Warsaw - Cracow', () => {
    const distance = 251.98;
    const listOfPoints = [
      {latitude: 52.229675, longitude: 21.01223},
      {latitude: 50.064651, longitude: 19.944981},
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBe(
      distance,
    );
  });
  it('calculateTotalDistance between different points Cracow - Warsaw - Vienna', () => {
    const distance = 807.54;
    const listOfPoints = [
      {latitude: 50.064651, longitude: 19.944981},
      {latitude: 52.229675, longitude: 21.01223},
      {latitude: 48.2083537, longitude: 16.3725042},
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBe(
      distance,
    );
  });
  it('calculateTotalDistance between different points Cracow - Warsaw - Vienna - Berlin', () => {
    const distance = 1331.19;
    const listOfPoints = [
      {latitude: 50.064651, longitude: 19.944981},
      {latitude: 52.229675, longitude: 21.01223},
      {latitude: 48.2083537, longitude: 16.3725042},
      {latitude: 52.523403, longitude: 13.4114},
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBe(
      distance,
    );
  });
  it('calculateTotalDistance between different points Cracow - Warsaw - Vienna - Berlin - Amsterdam', () => {
    const distance = 1908.61;
    const listOfPoints = [
      {latitude: 50.064651, longitude: 19.944981},
      {latitude: 52.229675, longitude: 21.01223},
      {latitude: 48.2083537, longitude: 16.3725042},
      {latitude: 52.523403, longitude: 13.4114},
      {latitude: 52.37403, longitude: 4.88969},
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBe(
      distance,
    );
  });

  it('calculates the total distance for two points', () => {
    const points = [
      {latitude: 40.7128, longitude: -74.006}, // New York City, USA
      {latitude: 51.5074, longitude: -0.1278}, // London, UK
    ];

    expect(calculateTotalDistance(points)).toBeCloseTo(5571, -1);
  });

  it('calculates the total distance for multiple points', () => {
    const points = [
      {latitude: 40.7128, longitude: -74.006}, // New York City, USA
      {latitude: 51.5074, longitude: -0.1278}, // London, UK
      {latitude: 35.6895, longitude: 139.6917}, // Tokyo, Japan
      {latitude: 34.0522, longitude: -118.2437}, // Los Angeles, USA
    ];

    expect(calculateTotalDistance(points)).toBeCloseTo(23944.409, 1);
  });
  it('calculateTotalDistance between different points New York City - London', () => {
    const distance = 5567.83;
    const listOfPoints = [
      {latitude: 40.7128, longitude: -74.006}, // New York City, USA
      {latitude: 51.5074, longitude: -0.1278}, // London, UK
    ];

    expect(calculateTotalDistance(listOfPoints)).toBeCloseTo(distance, -1);
  });

  it('calculateTotalDistance between different points Tokyo - Sydney', () => {
    const distance = 7825.21;
    const listOfPoints = [
      {latitude: 35.6895, longitude: 139.6917}, // Tokyo, Japan
      {latitude: -33.8688, longitude: 151.2093}, // Sydney, Australia
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBeCloseTo(
      distance,
      -1,
    );
  });
  it('calculateTotalDistance between different points Rio de Janeiro, Brazil - Rome', () => {
    const distance = 9200.25;
    const listOfPoints = [
      {latitude: -22.9068, longitude: -43.1729}, // Rio de Janeiro, Brazil
      {latitude: 41.9028, longitude: 12.4964}, // Rome, Italy
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBeCloseTo(
      distance,
      -1,
    );
  });
  it('calculateTotalDistance between different points New Delhi - Los Angeles', () => {
    const distance = 12857.05;
    const listOfPoints = [
      {latitude: 28.6139, longitude: 77.209}, // New Delhi, India
      {latitude: 34.0522, longitude: -118.2437}, // Los Angeles, USA
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBeCloseTo(
      distance,
      -1,
    );
  });
  it('calculateTotalDistance between different points Stockholm - Nairobi', () => {
    const distance = 6936.42;
    const listOfPoints = [
      {latitude: 59.3293, longitude: 18.0686},
      {latitude: -1.2864, longitude: 36.8172},
    ];

    expect(Number(calculateTotalDistance(listOfPoints).toFixed(2))).toBeCloseTo(
      distance,
      -1,
    );
  });
});
