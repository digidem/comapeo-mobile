import {type Track} from '@comapeo/schema';

export function findAssociatedTrack({
  tracks,
  observationId,
}: {
  tracks: Track[];
  observationId: string;
}) {
  return tracks.find(trackData =>
    trackData.observationRefs.some(ref => ref.docId === observationId),
  );
}
