import * as React from 'react';
import {BottomSheetContent} from '../BottomSheetModal';
import {defineMessages, useIntl} from 'react-intl';
import GreenCheck from '../images/GreenCheck.svg';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CommonActions} from '@react-navigation/native';

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
    defaultMessage: 'You have joined {projName}',
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
  const navigation = useNavigationFromRoot();

  function handleGoToSync() {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}, {name: 'Sync'}],
      }),
    );
  }

  return (
    <BottomSheetContent
      buttonConfigs={[
        {
          variation: 'outlined',
          onPress: () => {
            navigation.navigate('Home', {screen: 'Map'});
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
        projName: projectName,
      })}
      icon={<GreenCheck />}
    />
  );
};
