import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {DARK_ORANGE} from '../../lib/styles';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import AddPerson from '../../images/AddPerson.svg';
import Ionicons from '@react-native-vector-icons/ionicons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';

const m = defineMessages({
  title: {
    id: 'screens.Settings.NameDefaultProjectIntro.title',
    defaultMessage: 'Invite Devices',
  },
  heading: {
    id: 'screens.Settings.NameDefaultProjectIntro.heading',
    defaultMessage: 'Start a new project using my observations.',
  },
  description: {
    id: 'screens.Settings.NameDefaultProjectIntro.description',
    defaultMessage:
      'Invite devices to a new project with all your observations.',
  },
  nextButton: {
    id: 'screens.Settings.NameDefaultProjectIntro.nextButton',
    defaultMessage: 'Next',
  },
});

export const NameDefaultProjectIntro: NativeNavigationComponent<
  'NameDefaultProjectIntro'
> = ({navigation}) => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconTitleDescription
          icon={<AddPerson width={64} height={60} color={DARK_ORANGE} />}
          title={formatMessage(m.heading)}
          description={formatMessage(m.description)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          fullSize
          text={formatMessage(m.nextButton)}
          onPress={() => {
            navigation.navigate('NameSoloProject');
          }}
          iconPosition="right"
          renderIcon={({color, size}) => (
            <Ionicons
              name="arrow-forward-circle-outline"
              color={color}
              size={size}
            />
          )}
        />
      </View>
    </View>
  );
};

NameDefaultProjectIntro.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
