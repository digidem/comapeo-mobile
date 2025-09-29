import {orderPresets} from './orderPresets';
import type {Preset, ProjectSettings} from '@comapeo/schema';

function makePreset(
  docId: string,
  name: string,
  geometry: Array<'point' | 'line'>,
): Preset {
  return {docId, name, geometry} as unknown as Preset;
}

function settingsWith(overrides: Partial<ProjectSettings['defaultPresets']>) {
  const base: ProjectSettings['defaultPresets'] = {
    point: [],
    line: [],
    area: [],
    vertex: [],
    relation: [],
  };
  return {defaultPresets: {...base, ...overrides}};
}

describe('orderPresets', () => {
  const allPresets: Preset[] = [
    makePreset('a', 'Alpha', ['point']),
    makePreset('b', 'beta', ['point']),
    makePreset('c', 'Charlie', ['point']),
    makePreset('l1', 'Line One', ['line']),
    makePreset('l2', 'Line Two', ['line']),
    makePreset('both-1', 'Both One', ['point', 'line']),
  ];

  describe('geometry is point (observations)', () => {
    it('uses defaultPresets.point order when provided', () => {
      const settings = settingsWith({point: ['c', 'a', 'both-1']});
      const result = orderPresets({
        allPresets,
        settings,
        geometry: 'point',
      });

      expect(result.map(r => r.docId)).toEqual(['c', 'a', 'both-1']);
    });

    it('falls back to alphabetical when defaultPresets.point is empty', () => {
      const settings = settingsWith({point: []});
      const result = orderPresets({
        allPresets,
        settings,
        geometry: 'point',
      });

      expect(result.map(r => r.name)).toEqual([
        'Alpha',
        'beta',
        'Both One',
        'Charlie',
      ]);
    });

    it('falls back to alphabetical when defaultPresets is missing', () => {
      const result = orderPresets({
        allPresets,
        settings: null,
        geometry: 'point',
      });
      expect(result.map(r => r.name)).toEqual([
        'Alpha',
        'beta',
        'Both One',
        'Charlie',
      ]);
    });

    it('ignores unknown IDs; if none match, falls back to alphabetical', () => {
      const settingsNoMatches = settingsWith({point: ['zzz']});
      const resultNoMatches = orderPresets({
        allPresets,
        settings: settingsNoMatches,
        geometry: 'point',
      });
      expect(resultNoMatches.map(r => r.name)).toEqual([
        'Alpha',
        'beta',
        'Both One',
        'Charlie',
      ]);

      const settingsSomeMatches = settingsWith({point: ['zzz', 'b']});
      const resultSomeMatches = orderPresets({
        allPresets,
        settings: settingsSomeMatches,
        geometry: 'point',
      });
      expect(resultSomeMatches.map(r => r.docId)).toEqual(['b']);
    });
  });

  describe('geometry is line (tracks)', () => {
    it('uses defaultPresets.line order when provided', () => {
      const settings = settingsWith({line: ['l2', 'both-1']});
      const result = orderPresets({
        allPresets,
        settings,
        geometry: 'line',
      });
      expect(result.map(r => r.docId)).toEqual(['l2', 'both-1']);
    });

    it('falls back to alphabetical for line when defaultPresets.line empty', () => {
      const settings = settingsWith({line: []});
      const result = orderPresets({
        allPresets,
        settings,
        geometry: 'line',
      });
      expect(result.map(r => r.name)).toEqual([
        'Both One',
        'Line One',
        'Line Two',
      ]);
    });
  });
});
