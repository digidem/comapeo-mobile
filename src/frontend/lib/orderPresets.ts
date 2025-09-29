import {Preset, ProjectSettings} from '@comapeo/schema';

type Geometry = 'point' | 'line';

export function orderPresets(opts: {
  allPresets: Preset[];
  settings?: Pick<ProjectSettings, 'defaultPresets'> | null;
  geometry: Geometry;
}): Preset[] {
  const {allPresets, settings, geometry} = opts;

  const byGeometry = allPresets.filter(p => p.geometry.includes(geometry));

  const alphaSorted = [...byGeometry].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );

  const defaultPresetsExist =
    settings?.defaultPresets?.[geometry] &&
    settings.defaultPresets[geometry].length > 0
      ? settings.defaultPresets[geometry]
      : null;

  if (!defaultPresetsExist) return alphaSorted;

  const byDefaultPreset = new Map(byGeometry.map(p => [p.docId, p]));

  const orderedByDefaultPresets = defaultPresetsExist
    .map(id => byDefaultPreset.get(id))
    .filter((p): p is Preset => Boolean(p));

  return orderedByDefaultPresets.length > 0
    ? orderedByDefaultPresets
    : alphaSorted;
}
