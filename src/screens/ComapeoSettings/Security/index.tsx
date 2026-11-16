import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {FullScreenMenuList} from '../../../sharedComponents/MenuList/FullScreenMenuList';
import {MenuListItemType} from '../../../sharedComponents/MenuList/MenuListItem';
import {useSecurityState} from '../../../contexts/SecurityStoreContext';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {MEDIUM_GREY, RED} from '../../../lib/styles';

const m = defineMessages({
  title: {
    id: '$1screens.Security.title',
    defaultMessage: 'Security',
  },
  passcodeHeader: {
    id: '$1screens.Security.passcodeHeader',
    defaultMessage: 'App Passcode',
  },
  passDesriptionPassNotSet: {
    id: '$1screens.Security.passDesriptionPassNotSet',
    defaultMessage: 'Passcode not set',
  },
  passDesriptionPassSet: {
    id: '$1screens.Security.passDesriptionPassSet',
    defaultMessage: 'Passcode is set',
  },
  obscurePasscodeHeader: {
    id: '$1screens.Security.obscurePasscodeHeader',
    defaultMessage: 'Obscure Passcode',
  },
  obscurePassDescriptonPassSet: {
    id: '$1screens.Security.obscurePasscodeDescriptionActivated',
    defaultMessage: 'Protect your device against seizure',
  },
  obscurePassDescriptonPassNotSet: {
    id: '$1screens.Security.obscurePasscodeDescription',
    defaultMessage: 'To use, turn on App Passcode',
  },
});

export const Security: NativeNavigationComponent<'Security'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const passcodeSet = useSecurityState(state => state.passcode !== null);
  const [highlight, setHighlight] = React.useState(false);

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
