import * as path from 'node:path';
import * as fs from 'node:fs';
import {generateMetricsReport} from './generateMetricsReport';
import {generate} from '@mapeo/mock-data';
import {positionToCountries} from './positionToCountries';
import {getPercentageOfNetworkAvailability} from './networkAvailability';
import type {Observation} from '@mapeo/schema';
import {addToSet} from '../lib/addToSet';

type MetricsReportOptions = Parameters<typeof generateMetricsReport>[0];

describe('generateMetricsReport', () => {
  const packageJson = readPackageJson();
  const count = 10;
  const observations: ReadonlyArray<Partial<Observation>> = [
    ...generate('observation', {count}),
    // Manually add Machias Seal Island, disputed territory
    {lat: 44.5, lon: -67.101111},
    {},
  ];

  const generatedCountries = new Set<string>();

  for (const {lat, lon} of observations) {
    if (typeof lat === 'number' && typeof lon === 'number') {
      addToSet(generatedCountries, positionToCountries(lat, lon));
    }
  }

  const generatedNetworkAvailabilityPercentage =
    getPercentageOfNetworkAvailability(observations);

  const defaultOptions = {
    packageJson,
    os: 'android',
    osVersion: 123,
    screen: {width: 12, height: 34, ignoredValue: 56},
    supportedAbis: ['test64'],
    observations,
  } as MetricsReportOptions;

  it('includes a report type', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.type).toBe('metrics-v1');
  });

  it('includes the app version', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.appVersion).toBe(packageJson.version);
  });

  it('includes the OS (Android style)', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.os).toBe('android');
    expect(report.osVersion).toBe(123);
  });

  it('includes the OS (iOS style)', () => {
    const options = {...defaultOptions, os: 'ios' as const, osVersion: '1.2.3'};
    const report = generateMetricsReport(options);
    expect(report.os).toBe('ios');
    expect(report.osVersion).toBe('1.2.3');
  });

  it('includes the OS (desktop style)', () => {
    const options = {
      ...defaultOptions,
      os: 'win32' as const,
      osVersion: '1.2.3',
    };
    const report = generateMetricsReport(options);
    expect(report.os).toBe('win32');
    expect(report.osVersion).toBe('1.2.3');
  });

  it('includes screen dimensions', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.screen).toEqual({width: 12, height: 34});
  });

  it('includes the architecture', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.arch).toBe('test64');
  });

  it("doesn't include the architecture if there are no supported ABIs", () => {
    const options = {...defaultOptions, supportedAbis: []};
    const report = generateMetricsReport(options);
    expect(report.arch).toBe(undefined);
  });

  it("doesn't include countries if no observations are provided", () => {
    const options = {...defaultOptions, observations: []};
    const report = generateMetricsReport(options);
    expect(report.countries).toBe(undefined);
  });

  it('includes countries where observations are found', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.countries).toHaveLength(new Set(report.countries).size);
    expect(new Set(report.countries)).toEqual(generatedCountries);
  });

  it('includes network availability data', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.percentageOfNetworkAvailability).toBe(
      generatedNetworkAvailabilityPercentage,
    );
  });
});

function readPackageJson() {
  const packageJsonPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'package.json',
  );
  const packageJsonData = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(packageJsonData);
}
