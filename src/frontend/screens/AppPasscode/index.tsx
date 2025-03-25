import * as React from 'react';
import {defineMessages} from 'react-intl';

import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {PasscodeIntro} from './PasscodeIntro';
import {useAuthContext} from '../../contexts/AuthContext';

const m = defineMessages({
  title: {
    id: 'screens.AppPasscode',
    defaultMessage: 'App Passcode',
  },
});

export const AppPasscode: NativeNavigationComponent<'AppPasscode'> = ({
  navigation,
}) => {
  const {authState} = useAuthContext();

  React.useLayoutEffect(() => {
    if (authState === 'obscured') {
      navigation.popTo('AppSettings');
    }
  }, [navigation, authState]);

  return <PasscodeIntro />;
};

AppPasscode.navTitle = m.title;
