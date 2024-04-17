import {calculateTotalDistance} from './distance';

describe('calculateTotalDistance', () => {
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
  it('calculateTotalDistance between different points Cracow - Warsaw - Vienna - Berlin - Amsterdam ', () => {
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
});
