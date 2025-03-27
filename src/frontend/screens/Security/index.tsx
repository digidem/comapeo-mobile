import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {useAuthContext} from '../../contexts/AuthContext';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {FullScreenMenuList} from '../../sharedComponents/MenuList/FullScreenMenuList';
import {MenuListItemType} from '../../sharedComponents/MenuList/MenuListItem';
import {useSecurityState} from '../../contexts/SecurityStoreContext';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {MEDIUM_GREY, RED} from '../../lib/styles';

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
  obscurePasscodeHeader: {
    id: 'screens.Security.obscurePasscodeHeader',
    defaultMessage: 'Obscure Passcode',
  },
  obscurePassDescriptonPassSet: {
    id: 'screens.Security.obscurePasscodeDescriptionActivated',
    defaultMessage: 'Protect your device against seizure',
  },
  obscurePassDescriptonPassNotSet: {
    id: 'screens.Security.obscurePasscodeDescription',
    defaultMessage: 'To use, turn on App Passcode',
  },
});

export const Security: NativeNavigationComponent<'Security'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const passcodeSet = useSecurityState(state => state.passcode !== null);
  const {authState} = useAuthContext();
  const [highlight, setHighlight] = React.useState(false);

  React.useEffect(() => {
    if (authState === 'obscured') {
      navigation.popTo('AppSettings');
    }
  }, [navigation, authState]);

  function highlightError() {
    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, 2000);
  }

  const menuItems: MenuListItemType[] = [
    {
      onPress: () =>
        navigation.navigate(passcodeSet ? 'EnterPassToTurnOff' : 'AppPasscode'),
      primaryText: t(m.passcodeHeader),
      secondaryText: t(
        passcodeSet ? m.passDesriptionPassSet : m.passDesriptionPassNotSet,
      ),
    },
    {
      onPress: passcodeSet
        ? () => navigation.navigate('ObscurePasscode')
        : () => highlightError(),
      primaryText: t(m.obscurePasscodeHeader),
      secondaryText: passcodeSet ? (
        t(m.obscurePassDescriptonPassSet)
      ) : (
        <BodyText
          variant="smallMeta"
          style={{color: highlight ? RED : MEDIUM_GREY}}>
          {t(m.obscurePassDescriptonPassNotSet)}
        </BodyText>
      ),
    },
  ];
  return <FullScreenMenuList data={menuItems} />;
};

Security.navTitle = m.title;
