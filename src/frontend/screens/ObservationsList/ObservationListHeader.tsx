import * as React from 'react';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';

export const ObservationListHeader = (props: {
  tintColor?: string | undefined;
  pressColor?: string | undefined;
  pressOpacity?: number | undefined;
  labelVisible?: boolean | undefined;
}) => {
  const {goBack} = useNavigationFromHomeTabs();

  return (
    <TouchableOpacity>
      <CustomHeaderLeft
        style={{marginLeft: 10}}
        onPress={() => goBack()}
        headerBackButtonProps={{
          canGoBack: true,
          tintColor: props?.tintColor,
        }}
      />
    </TouchableOpacity>
  );
};
