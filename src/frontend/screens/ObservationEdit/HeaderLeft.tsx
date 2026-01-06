import * as React from 'react';
import {HeaderLeftClose} from '../../sharedComponents/HeaderLeftClose';
import {HeaderBackButtonProps} from '@react-navigation/elements';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';

type HeaderLeftProps = {
  headerBackButtonProps: HeaderBackButtonProps;
};

export const HeaderLeft = ({headerBackButtonProps}: HeaderLeftProps) => {
  const navigation = useNavigationFromRoot();
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );

  const handlePress = React.useCallback(() => {
    if (!observationId) return;
    navigation.navigate('ConfirmDiscardObservationEditBottomSheet', {
      observationId,
    });
  }, [navigation, observationId]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handlePress();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [handlePress]),
  );

  return (
    <HeaderLeftClose
      onPress={handlePress}
      headerBackButtonProps={headerBackButtonProps}
    />
  );
};
