import * as React from 'react';
import {CommonActions} from '@react-navigation/native';
import {defineMessages, useIntl} from 'react-intl';

import {rootNavigationRef} from '../../AppNavigator';
import GreenCheck from '../../images/GreenCheck.svg';
import {BottomSheetModalContent} from '../BottomSheetModal';

const m = defineMessages({
  goToMap: {
    id: 'sharedComponents.ProjectInviteBottomSheet.goToMap',
    defaultMessage: 'Go To Map',
  },
  success: {
    id: 'sharedComponents.ProjectInviteBottomSheet.success',
    defaultMessage: 'Success',
  },
  youHaveJoined: {
    id: 'sharedComponents.ProjectInviteBottomSheet.youHaveJoined',
    defaultMessage: 'You have joined {projectName}',
  },
  goToSync: {
    id: 'sharedComponents.ProjectInviteBottomSheet.goToSync',
    defaultMessage: 'Go To Sync',
  },
});

type InviteSuccessBottomSheetContentProps = {
  closeSheet: () => void;
  projectName?: string;
};

export const InviteSuccessBottomSheetContent = ({
  closeSheet,
  projectName,
}: InviteSuccessBottomSheetContentProps) => {
  const {formatMessage} = useIntl();

  function handleGoToSync() {
    rootNavigationRef.dispatch(
      CommonActions.reset({index: 1, routes: [{name: 'Home'}, {name: 'Sync'}]}),
    );
  }

  return (
    <BottomSheetModalContent
      buttonConfigs={[
        {
          variation: 'outlined',
          onPress: () => {
            rootNavigationRef.navigate('Home', {screen: 'Map'});
            closeSheet();
          },
          text: formatMessage(m.goToMap),
        },
        {
          onPress: () => {
            handleGoToSync();
            closeSheet();
          },
          text: formatMessage(m.goToSync),
          variation: 'filled',
        },
      ]}
      title={formatMessage(m.success)}
      description={formatMessage(m.youHaveJoined, {
        projectName,
      })}
      icon={<GreenCheck />}
    />
  );
};
