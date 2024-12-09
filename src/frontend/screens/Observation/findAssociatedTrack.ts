import {type Track} from '@comapeo/schema';

export function findAssociatedTrack({
  tracks,
  observationId,
}: {
  tracks: Track[] | undefined;
  observationId: string;
}) {
  if (!tracks) return undefined;
  return tracks.find(trackData =>
    trackData.observationRefs.some(ref => ref.docId === observationId),
  );
}
