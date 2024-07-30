import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView} from 'react-native-gesture-handler';

import {useSecurityContext} from '../../contexts/SecurityContext';
import {List, ListItem, ListItemText} from '../../sharedComponents/List';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';

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

  return (
    <ScrollView>
      <List>
        <ListItem
          button={true}
          onPress={() =>
            navigation.navigate(
              authValuesSet.passcodeSet ? 'EnterPassToTurnOff' : 'AppPasscode',
            )
          }>
          <ListItemText
            primary={t(m.passcodeHeader)}
            secondary={t(
              authValuesSet.passcodeSet
                ? m.passDesriptionPassSet
                : m.passDesriptionPassNotSet,
            )}
          />
        </ListItem>
      </List>
    </ScrollView>
  );
};

Security.navTitle = m.title;
