import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {useSecurityContext} from '../../contexts/SecurityContext';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {
  FullScreenMenuList,
  MenuListItemType,
} from '../../sharedComponents/MenuList';

const m = defineMessages({
  title: {
    id: 'screens.Security.title',
    defaultMessage: 'Security',
  },
  securitySubheader: {
    id: 'screens.Security.securitySubheader',
    defaultMessage: 'Device Security',
  },
  passcodeHeader: {
    id: 'screens.Security.passcodeHeader',
    defaultMessage: 'App Passcode',
  },
  passDesriptionPassNotSet: {
    id: 'screens.Security.passDesriptionPassNotSet',
    defaultMessage: 'Passcode not set',
  },
  passDesriptionPassSet: {
    id: 'screens.Security.passDesriptionPassSet',
    defaultMessage: 'Passcode is set',
  },
});

export const Security: NativeNavigationComponent<'Security'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const {authState, authValuesSet} = useSecurityContext();

  React.useEffect(() => {
    if (authState === 'obscured') {
      navigation.navigate('Settings');
    }
  }, [navigation, authState]);

  const menuItems: MenuListItemType[] = [
    {
      onPress: () =>
        navigation.navigate(
          authValuesSet.passcodeSet ? 'EnterPassToTurnOff' : 'AppPasscode',
        ),
      primaryText: t(m.passcodeHeader),
      secondaryText: t(
        authValuesSet.passcodeSet
          ? m.passDesriptionPassSet
          : m.passDesriptionPassNotSet,
      ),
    },
  ];

  return <FullScreenMenuList data={menuItems} />;
};

Security.navTitle = m.title;
