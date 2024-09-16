import * as React from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {
  List,
  ListDivider,
  ListItem,
  ListItemText,
} from '../../sharedComponents/List';
import {MEDIUM_GREY, RED, WHITE} from '../../lib/styles';
import ErrorIcon from '../../images/Error.svg';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {useFocusEffect, StackActions} from '@react-navigation/native';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {HeaderButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {usePersistedPasscode} from '../../hooks/persistedState/usePersistedPasscode';
import {useSecurityContext} from '../../contexts/SecurityContext';
import {Text} from '../../sharedComponents/Text';
import {
  BottomSheetModal,
  BottomSheetModalContent,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';

const m = defineMessages({
  usePasscode: {
    id: 'screens.AppPasscode.TurnOffPasscode.usePasscode',
    defaultMessage: 'Use App Passcode',
  },
  changePasscode: {
    id: 'screens.AppPasscode.TurnOffPasscode.changePasscode',
    defaultMessage: 'Change App Passcode',
  },
  turnOffConfirmation: {
    id: 'screens.AppPasscode.TurnOffPasscode.turnOffConfirmation',
    defaultMessage: 'Turn Off App Passcode?',
  },
  turnOff: {
    id: 'screens.AppPasscode.TurnOffPasscode.turnOff',
    defaultMessage: 'Turn Off',
  },
  cancel: {
    id: 'screens.AppPasscode.TurnOffPasscode.cancel',
    defaultMessage: 'Cancel',
  },
  description: {
    id: 'screens.AppPasscode.TurnOffPasscode.description',
    defaultMessage:
      'App Passcode adds an additional layer of security by requiring that you enter a passcode in order to open the CoMapeo app.',
  },
  currentlyUsing: {
    id: 'screens.AppPasscode.TurnOffPasscode.currentlyUsing',
    defaultMessage:
      'You are currently using App Passcode. See below to stop using or change your passcode.',
  },
  title: {
    id: 'screens.AppPasscode.TurnOffPasscode.title',
    defaultMessage: 'App Passcode',
  },
});

export const TurnOffPasscode: NativeNavigationComponent<'DisablePasscode'> = ({
  navigation,
}) => {
  const {authValuesSet} = useSecurityContext();
  const setPasscode = usePersistedPasscode(state => state.setPasscode);

  const {sheetRef, openSheet, closeSheet, isOpen} = useBottomSheetModal({
    openOnMount: false,
  });

  const {navigate} = navigation;

  const {formatMessage: t} = useIntl();

  // These next three function forces the user to go back to the setting page instead of the "EnterPassToTurnOff" screen
  const backPress = React.useCallback(() => {
    const popAction = StackActions.pop(2);
    navigation.dispatch(popAction);
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props: HeaderButtonProps) => (
        <CustomHeaderLeft headerBackButtonProps={props} onPress={backPress} />
      ),
    });
  }, [backPress, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        backPress();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [backPress]),
  );

  function unsetAppPasscode() {
    setPasscode(null);
    navigate('Security');
  }

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.description}>{t(m.description)}</Text>
      <Text style={{fontSize: 16, marginBottom: 20}}>
        {t(m.currentlyUsing)}
      </Text>
      <List>
        <ListItem style={styles.checkBoxContainer} onPress={openSheet}>
          <ListItemText
            style={styles.text}
            primary={<FormattedMessage {...m.usePasscode} />}
          />
          <TouchableOpacity shouldActivateOnStart onPress={openSheet}>
            <MaterialIcon
              name={
                authValuesSet.passcodeSet
                  ? 'check-box'
                  : 'check-box-outline-blank'
              }
              testID={
                authValuesSet.passcodeSet ? 'SETTINGS.passcode-checked' : ''
              }
              size={24}
              color={MEDIUM_GREY}
            />
          </TouchableOpacity>
        </ListItem>
        <ListDivider />

        {/* User is not able to see this option unlesss they already have a pass */}
        {authValuesSet.passcodeSet && (
          <ListItem
            onPress={() => {
              navigate('SetPasscode');
            }}
            style={{marginTop: 20}}>
            <ListItemText
              style={styles.text}
              primary={<FormattedMessage {...m.changePasscode} />}
            />
          </ListItem>
        )}
      </List>
      <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
        <BottomSheetModalContent
          title={t(m.turnOffConfirmation)}
          icon={<ErrorIcon width={60} height={60} color={RED} />}
          buttonConfigs={[
            {
              dangerous: true,
              onPress: unsetAppPasscode,
              text: t(m.turnOff),
              variation: 'filled',
            },
            {
              onPress: closeSheet,
              text: t(m.cancel),
              variation: 'outlined',
            },
          ]}
        />
      </BottomSheetModal>
    </View>
  );
};

TurnOffPasscode.navTitle = m.title;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  checkBoxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    marginTop: 40,
    fontSize: 16,
    marginBottom: 20,
  },
  pageContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: WHITE,
  },
});
