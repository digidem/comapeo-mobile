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

type SyncActionSheetProps = {
  title: string;
  description: string;
  confirmActionText: string;
  confirmAction: () => void;
  isOpen: boolean;
  onDismiss: () => void;
};

export const SyncActionSheet = React.forwardRef<
  BottomSheetModalMethods,
  SyncActionSheetProps
>(
  (
    {title, description, confirmActionText, confirmAction, isOpen, onDismiss},
    sheetRef,
  ) => {
    const {formatMessage: t} = useIntl();

    return (
      <BottomSheetModal isOpen={isOpen} ref={sheetRef} onDismiss={onDismiss}>
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
      </BottomSheetModal>
    );
  },
);
