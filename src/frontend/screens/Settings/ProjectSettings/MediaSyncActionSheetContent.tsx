import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import Warning from '../../../images/Warning.svg';
import {BottomSheetModalContent} from '../../../sharedComponents/BottomSheetModal';

const m = defineMessages({
  cancel: {
    id: 'screens.MediaSyncActionSheetContent.cancel',
    defaultMessage: 'Cancel',
  },
});

type MediaSyncActionSheetContentProps = {
  title: string;
  description: React.ReactNode;
  confirmActionText: string;
  confirmAction: () => void;
  onDismiss: () => void;
};

export const MediaSyncActionSheetContent = ({
  title,
  description,
  confirmActionText,
  confirmAction,
  onDismiss,
}: MediaSyncActionSheetContentProps) => {
  const {formatMessage: t} = useIntl();

  return (
    <BottomSheetModalContent
      title={title}
      description={description}
      icon={<Warning width={60} height={60} />}
      buttonConfigs={[
        {
          text: t(m.cancel),
          onPress: onDismiss,
          variation: 'outlined',
        },
        {
          text: confirmActionText,
          variation: 'filled',
          onPress: confirmAction,
        },
      ]}
    />
  );
};
