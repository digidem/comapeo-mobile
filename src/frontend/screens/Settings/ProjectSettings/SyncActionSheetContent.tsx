import * as React from 'react';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {defineMessages, useIntl} from 'react-intl';
import Warning from '../../../images/Warning.svg';
import {
  BottomSheetModal,
  BottomSheetModalContent,
} from '../../../sharedComponents/BottomSheetModal';

const m = defineMessages({
  cancel: {
    id: 'screens.SyncActionSheet.cancel',
    defaultMessage: 'Cancel',
  },
});

type SyncActionSheetContentProps = {
  title: string;
  description: string;
  confirmActionText: string;
  confirmAction: () => void;
  onDismiss: () => void;
};

export const SyncActionSheetContent = ({
  title,
  description,
  confirmActionText,
  confirmAction,
  onDismiss,
}: SyncActionSheetContentProps) => {
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
