import React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {Destructive} from './Destructive';

const m = defineMessages({
  title: {
    id: 'sharedComponents.BottomSheet.ContentVariants.ObservationDiscard.title',
    defaultMessage: 'Discard Observation?',
  },
  description: {
    id: 'sharedComponents.BottomSheet.ContentVariants.ObservationDiscard.description',
    defaultMessage:
      'Your observation will not be saved. This cannot be undone.',
  },
  discardButtonText: {
    id: 'sharedComponents.BottomSheet.ContentVariants.ObservationDiscard.discardButtonText',
    defaultMessage: 'Discard Observation',
  },
  cancelButtonText: {
    id: 'sharedComponents.BottomSheet.ContentVariants.ObservationDiscard.cancleButtonText',
    defaultMessage: 'Continue Editing',
  },
});

interface Props {
  onCancel: () => void;
  onDiscard: () => void;
}

export const ObservationDiscard = ({onCancel, onDiscard}: Props) => {
  const {formatMessage: t} = useIntl();

  return (
    <Destructive
      title={t(m.title)}
      description={t(m.description)}
      cancelButtonText={t(m.cancelButtonText)}
      onCancel={onCancel}
      destructiveButtonText={t(m.discardButtonText)}
      onDestructivePress={onDiscard}
    />
  );
};
