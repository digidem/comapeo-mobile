import {useEffect, useState} from 'react';
import {Attachment} from '../sharedTypes';
import {useAttachmentUrlQueries} from './server/media';

export function useMediaAvailability(attachments: Attachment[]) {
  const [availability, setAvailability] = useState<
    'full' | 'preview' | 'both' | null
  >(null);

  const originalQueries = useAttachmentUrlQueries(attachments, 'original');
  const previewQueries = useAttachmentUrlQueries(attachments, 'preview');

  useEffect(() => {
    if (
      originalQueries.some(q => q.isPending) ||
      previewQueries.some(q => q.isPending)
    ) {
      setAvailability(null);
      return;
    }

    const hasFullSize = originalQueries.some(q => q.data?.url);
    const hasPreviews = previewQueries.some(q => q.data?.url);

    if (hasFullSize && hasPreviews) {
      setAvailability('both');
    } else if (hasFullSize) {
      setAvailability('full');
    } else if (hasPreviews) {
      setAvailability('preview');
    } else {
      setAvailability(null);
    }
  }, [originalQueries, previewQueries]);

  return availability;
}
