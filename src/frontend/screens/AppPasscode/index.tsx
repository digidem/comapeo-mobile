import * as React from 'react';
import {defineMessages} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {WHITE} from '../../lib/styles';
import {NativeNavigationComponent} from '../../sharedTypes';
import {PasscodeIntro} from './PasscodeIntro';
import {useSecurityContext} from '../../contexts/SecurityContext';

const m = defineMessages({
  title: {
    id: 'screens.AppPasscode',
    defaultMessage: 'App Passcode',
  },
});

export const AppPasscode: NativeNavigationComponent<'AppPasscode'> = ({
  navigation,
}) => {
  const {authState} = useSecurityContext();

  React.useLayoutEffect(() => {
    if (authState === 'obscured') {
      navigation.navigate('Settings');
    }
  }, [navigation, authState]);

  return (
    <View style={styles.pageContainer}>
      <PasscodeIntro />
    </View>
  );
};

AppPasscode.navTitle = m.title;

const styles = StyleSheet.create({
  pageContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: WHITE,
  },
});
