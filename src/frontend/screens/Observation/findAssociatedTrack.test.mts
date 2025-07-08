import {findAssociatedTrack} from './findAssociatedTrack';
import * as mock from '@mapeo/mock-data';
import {assert} from '../../lib/assert';

describe('Tests findAssociatedTrack', () => {
  it('returns the correct track with the associated observationId', () => {
    const [observation] = mock.generate('observation');
    assert(observation);
    const tracks = mock.generate('track', {count: 10});
    const targetTrack = tracks[3];
    assert(targetTrack);
    targetTrack.observationRefs.push({
      docId: observation.docId,
      versionId: observation.versionId,
    });
    const track = findAssociatedTrack({
      tracks,
      observationId: observation.docId,
    });
    expect(track).toStrictEqual(targetTrack);
  });

  it('returns undefined when there is no matching observation docId', () => {
    const [observation] = mock.generate('observation');
    assert(observation);
    const tracks = mock.generate('track', {count: 10});
    const track = findAssociatedTrack({
      tracks,
      observationId: observation.docId,
    });
    expect(track).toBeUndefined();
  });

  it('returns undefined when tracks array is empty', () => {
    const [observation] = mock.generate('observation');
    assert(observation);
    const track = findAssociatedTrack({
      tracks: [],
      observationId: observation.docId,
    });
    expect(track).toBeUndefined();
  });
});
