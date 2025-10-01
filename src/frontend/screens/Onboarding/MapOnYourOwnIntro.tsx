import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button} from '../../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

const m = defineMessages({
  title: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.title',
    defaultMessage: 'Map On Your Own',
  },
  description: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.description',
    defaultMessage: 'Map on your own to start—invite collaborators anytime.',
  },
  goToMap: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.goToMap',
    defaultMessage: 'Go to Map',
  },
  close: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.close',
    defaultMessage: 'Close',
  },
});

export const MapOnYourOwnIntro = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'MapOnYourOwnIntro'>) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <HeaderText style={styles.text}>{t(m.title)}</HeaderText>
          <BodyText style={{marginTop: 20}}>{t(m.description)}</BodyText>
        </View>
        <View style={{width: '100%', gap: 10}}>
          <Button
            fullWidth
            style={{marginTop: 20}}
            onPress={() => {
              // TODO: Navigate to map
            }}>
            {t(m.goToMap)}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onPress={() => {
              navigation.navigate('Success', {
                deviceName: 'TODO: Get device name',
              });
            }}>
            {t(m.close)}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  text: {
    marginTop: 20,
  },
});
