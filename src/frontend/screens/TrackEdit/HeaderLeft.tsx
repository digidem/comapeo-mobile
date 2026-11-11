import {HeaderBackButtonProps} from '@react-navigation/elements';
import * as React from 'react';

import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useReplaceBackNavigation} from '../../hooks/useReplaceBackNavigation';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';

type HeaderLeftProps = {
  headerBackButtonProps: HeaderBackButtonProps;
  trackId: string;
};

export const HeaderLeft = ({
  headerBackButtonProps,
  trackId,
}: HeaderLeftProps) => {
  const navigation = useNavigationFromRoot();

  const navigateToBottomSheet = React.useCallback(() => {
    navigation.navigate('ConfirmTrackDiscardBottomSheet', {trackId});
  }, [navigation, trackId]);

  useReplaceBackNavigation(navigateToBottomSheet);

  return (
    <HeaderLeftClose
      onPress={navigateToBottomSheet}
      headerBackButtonProps={headerBackButtonProps}
    />
  );
};
