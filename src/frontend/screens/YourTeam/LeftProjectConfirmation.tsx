import * as React from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {DARK_ORANGE} from '../../lib/styles';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useFocusEffect} from '@react-navigation/native';

const m = defineMessages({
  youveLeftProject: {
    id: 'screens.LeftProjectConfirmation.youveLeftProject',
    defaultMessage: "You've left the project.",
  },
  openDefaultProject: {
    id: 'screens.LeftProjectConfirmation.openDefaultProject',
    defaultMessage: 'Open {deviceName}',
  },
});

export const LeftProjectConfirmation = ({
  navigation,
}: NativeRootNavigationProps<'LeftProjectConfirmation'>) => {
  const {formatMessage} = useIntl();
  const {data} = useOwnDeviceInfo();
  const deviceName = data?.name;

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      return () => subscription.remove();
    }, []),
  );

  function handleOpenDefaultProject() {
    navigation.popToTop();
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <MaterialDesignIcons
          name="hand-wave-outline"
          size={80}
          color={DARK_ORANGE}
        />
        <HeaderText variant="header2" style={styles.title}>
          {formatMessage(m.youveLeftProject)}
        </HeaderText>
      </View>

      <View style={styles.button}>
        <PrimaryButton
          fullSize
          onPress={handleOpenDefaultProject}
          text={formatMessage(m.openDefaultProject, {
            deviceName,
          })}
          renderIcon={({color, size}) => (
            <MaterialIcons name="phone-android" size={size} color={color} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainCard: {
    flex: 1,
    padding: 40,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});
