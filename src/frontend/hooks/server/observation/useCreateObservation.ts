import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../../../api';
import {ClientGeneratedObservation} from '../../../sharedTypes';
import {Observation} from '@mapeo/schema';
import {DraftPhoto} from '../../../contexts/PhotoPromiseContext/types';

export function useCreateObservation() {
  const attachmentsMutation = useAttachmentsMutation();
  const observationMutation = useObservationMutation();

  return (value: ClientGeneratedObservation) =>
    attachmentsMutation.mutateAsync().then(att => {
      observationMutation.mutate({value, att});
    });
}

function useObservationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      value,
      att,
    }: {
      value: ClientGeneratedObservation;
      att: Observation['attachments'];
    }) =>
      await api.observation.create({
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
    mutationFn: async () => await mockBlobApi(),
  });
}

async function mockBlobApi(
  photos?: DraftPhoto[],
): Promise<Observation['attachments']> {
  return [
    {
      driveDiscoveryId: '',
      name: '',
      type: 'photo',
      hash: '',
    },
  ];
}
