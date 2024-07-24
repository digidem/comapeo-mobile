import * as React from 'react';
import {defineMessages} from 'react-intl';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
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

  return <PasscodeIntro />;
};

AppPasscode.navTitle = m.title;
