import {Observation} from '@mapeo/schema';
import {BlobVariant} from '@mapeo/core/dist/types';
import {useMutation, useQuery} from '@tanstack/react-query';

import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {useProject} from './projects';

export function useCreateAttachmentsMutation() {
  const project = useProject();

  return useMutation({
    mutationFn: async (photos: Photo[]) => {
      if (!project) throw new Error('Project instance does not exist');

      return Promise.all(
        photos.map(p => {
          // TODO: Fix
          return project.$blobs.create(
            {original: 'abc'},
            {mimeType: 'img/png'},
          );
        }),
      );
    },
  });
}

// TODO: Fix `type` issues
export function useObservationAttachmentUrl(
  attachment: Observation['attachments'][number],
  // @ts-expect-error
  variant: BlobVariant<(typeof attachment)['type']>,
) {
  const project = useProject();

  return useQuery({
    queryKey: ['attachmentUrl'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.$blobs.getUrl({
        driveId: attachment.driveDiscoveryId,
        // @ts-expect-error
        type: attachment.type,
        variant,
      });
    },
    enabled: !!project,
    // setting staleTime and CacheTime to infinity means it will only call the api once (aka photos do not get editted so we do not need to keep getting from the server)
    staleTime: Infinity,
    cacheTime: Infinity,
  });
}
