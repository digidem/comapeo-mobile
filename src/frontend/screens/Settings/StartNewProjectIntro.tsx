import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {DARK_ORANGE} from '../../lib/styles';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import ProjectCoordinator from '../../images/ProjectCoordinator.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const m = defineMessages({
  title: {
    id: 'screens.Settings.StartNewProjectIntro.title',
    defaultMessage: 'Start New Project',
  },
  heading: {
    id: 'screens.Settings.StartNewProjectIntro.heading',
    defaultMessage: 'Start a new project with no observations.',
  },
  description: {
    id: 'screens.Settings.StartNewProjectIntro.description',
    defaultMessage: 'Invite devices to a separate and empty project.',
  },
  nextButton: {
    id: 'screens.Settings.StartNewProjectIntro.nextButton',
    defaultMessage: 'Next',
  },
});

export const StartNewProjectIntro: NativeNavigationComponent<
  'StartNewProjectIntro'
> = ({navigation}) => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProjectCoordinator width={70} height={60} color={DARK_ORANGE} />
        <HeaderText variant="header2" style={styles.heading}>
          {formatMessage(m.heading)}
        </HeaderText>
        <BodyText style={styles.description}>
          {formatMessage(m.description)}
        </BodyText>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          fullSize
          text={formatMessage(m.nextButton)}
          onPress={() => {
            navigation.navigate('CreateProject');
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

StartNewProjectIntro.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 40,
  },
  heading: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
});
