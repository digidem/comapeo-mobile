import {type UnitSystem} from '../contexts/UnitSystemStoreContext';

// --- Conversion factors ---
const M_TO_FT = 3.28084;
const KM_TO_MI = 0.621371;
const MS_TO_MPH = 2.23694;

export function metersOrConversion(
  meters: number,
  unitSystem: UnitSystem,
  decimals = 0,
): {value: string; unit: string} {
  if (unitSystem === 'imperial') {
    return {value: (meters * M_TO_FT).toFixed(decimals), unit: 'ft'};
  }
  return {value: meters.toFixed(decimals), unit: 'm'};
}

export function kmOrConversion(
  km: number,
  unitSystem: UnitSystem,
): {value: string; unit: string} {
  if (unitSystem === 'imperial') {
    return {value: (km * KM_TO_MI).toFixed(2), unit: 'mi'};
  }
  return {value: km.toFixed(2), unit: 'km'};
}

export function metersPerSecondOrConversion(
  mps: number,
  unitSystem: UnitSystem,
): {value: string; unit: string} {
  if (unitSystem === 'imperial') {
    return {value: (mps * MS_TO_MPH).toFixed(2), unit: 'mph'};
  }
  return {value: mps.toFixed(2), unit: 'm/s'};
}
