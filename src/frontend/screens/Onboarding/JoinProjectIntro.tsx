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
    id: 'screens.Onboarding.JoinProjectIntro.title',
    defaultMessage: 'Join a Project',
  },
  description: {
    id: 'screens.Onboarding.JoinProjectIntro.description',
    defaultMessage: 'Join an existing project team.',
  },
  close: {
    id: 'screens.Onboarding.JoinProjectIntro.close',
    defaultMessage: 'Close',
  },
});

export const JoinProjectIntro = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'JoinProjectIntro'>) => {
  const {formatMessage: t} = useIntl();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <HeaderText style={styles.text}>{t(m.title)}</HeaderText>
          <BodyText style={{marginTop: 20}}>{t(m.description)}</BodyText>
        </View>
        <Button
          fullWidth
          variant="outlined"
          style={{marginTop: 20}}
          onPress={() => {
            navigation.navigate('Success', {
              deviceName: 'TODO: Get device name',
            });
          }}>
          {t(m.close)}
        </Button>
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
