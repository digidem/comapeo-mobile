import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {useAuthContext} from '../../contexts/AuthContext';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {FullScreenMenuList} from '../../sharedComponents/MenuList/FullScreenMenuList';
import {MenuListItemType} from '../../sharedComponents/MenuList/MenuListItem';
import {useSecurityState} from '../../contexts/SecurityStoreContext';

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
  const passcodeSet = useSecurityState(state => state.passcode !== null);
  const {authState} = useAuthContext();

  React.useEffect(() => {
    if (authState === 'obscured') {
      navigation.popTo('Settings');
    }
  }, [navigation, authState]);

  const menuItems: MenuListItemType[] = [
    {
      onPress: () =>
        navigation.navigate(passcodeSet ? 'EnterPassToTurnOff' : 'AppPasscode'),
      primaryText: t(m.passcodeHeader),
      secondaryText: t(
        passcodeSet ? m.passDesriptionPassSet : m.passDesriptionPassNotSet,
      ),
    },
  ];

  return <FullScreenMenuList data={menuItems} />;
};

Security.navTitle = m.title;
