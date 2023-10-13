import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../../../api';
import {ClientGeneratedObservation} from '../../../sharedTypes';
import {Observation} from '@mapeo/schema';
import {Photo} from '../../../contexts/PhotoPromiseContext/types';
import {useProjectContext} from '../../../contexts/ProjectContext';

export function useCreateObservation() {
  const attachmentsMutation = useAttachmentsMutation();
  const observationMutation = useObservationMutation();

  return ({
    value,
    photos,
  }: {
    value: ClientGeneratedObservation;
    photos?: Photo[];
  }) =>
    attachmentsMutation.mutateAsync(photos).then(att => {
      observationMutation.mutate({value, att});
    });
}

function useObservationMutation() {
  const queryClient = useQueryClient();
  const project = useProjectContext();

  return useMutation({
    mutationFn: async ({
      value,
      att,
    }: {
      value: ClientGeneratedObservation;
      att: Observation['attachments'];
    }) =>
      await project.observation.create({
        schemaName: 'observation',
        ...value,
        attachments: att,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['observations']});
    },
  });
}

function useAttachmentsMutation() {
  return useMutation({
    mutationFn: async (photos?: Photo[]) => await mockBlobApi(photos),
  });
}

async function mockBlobApi(
  photos?: Photo[],
): Promise<Observation['attachments']> {
  if (!photos || photos?.length === 0) return [];
  return [
    {
      driveDiscoveryId: '',
      name: '',
      type: 'photo',
      hash: '',
    },
  ];
}
