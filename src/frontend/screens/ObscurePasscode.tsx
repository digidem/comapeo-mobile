import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import MaterialIcon from '@react-native-vector-icons/material-icons';
import {OBSCURE_PASSCODE} from '../constants';
import {LIGHT_GREY} from '../lib/styles';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {
  useSecurityActions,
  useSecurityState,
} from '../contexts/SecurityStoreContext';
import {NativeNavigationComponent} from '../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'screens.ObscurePasscode.title',
    defaultMessage: 'Obscure Passcode',
  },
  whatIsObscure: {
    id: 'screens.ObscurePasscode.whatIsObscure',
    defaultMessage: 'What is Obscure Passcode?',
  },

  toggleMessage: {
    id: 'screens.ObscurePasscode.toggleMessage',
    defaultMessage: 'Use Obscure Passcode',
  },
  instructions: {
    id: 'screens.ObscurePasscode.instructions',
    defaultMessage: 'Enter the code above to hide your data in CoMapeo',
  },
  description: {
    id: 'screens.ObscurePasscode.description',
    defaultMessage:
      'Obscure Passcode is a security feature that allows you to open CoMapeo in a decoy mode that hides all of your data. Entering the Obscure Passcode on the intro screen will display an empty version of CoMapeo which allows you to create demonstration observations that are not saved to the CoMapeo database.',
  },
});

export const ObscurePasscode: NativeNavigationComponent<
  'ObscurePasscode'
> = () => {
  const obscureCodeEnabled = useSecurityState(
    state => state.obscureCodeEnabled,
  );
  const {enableObscureCode} = useSecurityActions();

  const {formatMessage: t} = useIntl();

  return (
    <ScrollView style={styles.container}>
      <HeaderText variant="header1" style={styles.title}>
        {t(m.whatIsObscure)}
      </HeaderText>

      <BodyText>{t(m.description)}</BodyText>

      <TouchableOpacity
        style={styles.switch}
        onPress={() => enableObscureCode(!obscureCodeEnabled)}>
        <React.Fragment>
          <BodyText>{t(m.toggleMessage)}</BodyText>

          <MaterialIcon
            name={obscureCodeEnabled ? 'check-box' : 'check-box-outline-blank'}
            size={32}
            color="rgba(0, 0, 0, 0.54)"
            accessibilityLabel="Enable or Disable Obscure Passcode"
          />
        </React.Fragment>
      </TouchableOpacity>

      {obscureCodeEnabled && (
        <View
          style={styles.passbox}
          accessibilityLabel="Obscure Passcode is Enabled">
          <BodyText
            variant="large"
            style={{textAlign: 'center', marginBottom: 10}}>
            {OBSCURE_PASSCODE}
          </BodyText>
          <BodyText>{t(m.instructions)}</BodyText>
        </View>
      )}
    </ScrollView>
  );
};

ObscurePasscode.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  passbox: {
    borderRadius: 10,
    backgroundColor: LIGHT_GREY,
    marginTop: 30,
    padding: 20,
    marginBottom: 40,
  },
  switch: {
    alignSelf: 'flex-start',
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 2,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 2,
    paddingVertical: 20,
    marginTop: 30,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
