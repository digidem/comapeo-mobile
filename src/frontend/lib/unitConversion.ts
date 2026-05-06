import {type UnitSystem} from '../contexts/UnitSystemStoreContext';

// --- Conversion factors ---
const M_TO_FT = 3.28084;
const KM_TO_MI = 0.621371;
const MS_TO_FTS = 3.28084;

export type LengthUnit = 'ft' | 'm';
export type DistanceUnit = 'mi' | 'km';
export type SpeedUnit = 'ft/s' | 'm/s';

export function getLengthUnit(unitSystem: UnitSystem): LengthUnit {
  return unitSystem === 'imperial' ? 'ft' : 'm';
}

export function getDistanceUnit(unitSystem: UnitSystem): DistanceUnit {
  return unitSystem === 'imperial' ? 'mi' : 'km';
}

export function getSpeedUnit(unitSystem: UnitSystem): SpeedUnit {
  return unitSystem === 'imperial' ? 'ft/s' : 'm/s';
}

export function metersOrConversion(
  meters: number,
  unitSystem: UnitSystem,
): {value: number; unit: LengthUnit} {
  if (unitSystem === 'imperial') {
    return {value: meters * M_TO_FT, unit: 'ft'};
  }
  return {value: meters, unit: 'm'};
}

export function kmOrConversion(
  km: number,
  unitSystem: UnitSystem,
): {value: number; unit: DistanceUnit} {
  if (unitSystem === 'imperial') {
    return {value: km * KM_TO_MI, unit: 'mi'};
  }
  return {value: km, unit: 'km'};
}

export function metersPerSecondOrConversion(
  mps: number,
  unitSystem: UnitSystem,
): {value: number; unit: SpeedUnit} {
  if (unitSystem === 'imperial') {
    return {value: mps * MS_TO_FTS, unit: 'ft/s'};
  }
  return {value: mps, unit: 'm/s'};
}
