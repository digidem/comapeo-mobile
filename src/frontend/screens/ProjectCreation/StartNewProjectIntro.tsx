import * as React from 'react';
import {StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {DARK_ORANGE} from '../../lib/styles';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import ProjectCoordinator from '../../images/ProjectCoordinator.svg';
import Ionicons from '@react-native-vector-icons/ionicons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {ScreenContentWithButtonDock} from '../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDock';

const m = defineMessages({
  title: {
    id: '$1screens.Settings.StartNewProjectIntro.title',
    defaultMessage: 'Start New Project',
  },
  heading: {
    id: '$1screens.Settings.StartNewProjectIntro.heading',
    defaultMessage: 'Start a new project with no observations.',
  },
  description: {
    id: '$1screens.Settings.StartNewProjectIntro.description',
    defaultMessage: 'Invite devices to a separate and empty project.',
  },
  nextButton: {
    id: '$1screens.Settings.StartNewProjectIntro.nextButton',
    defaultMessage: 'Next',
  },
});

export const StartNewProjectIntro: NativeNavigationComponent<
  'StartNewProjectIntro'
> = ({navigation}) => {
  const {formatMessage} = useIntl();

  return (
    <ScreenContentWithButtonDock
      contentContainerStyle={styles.content}
      bottomButton={
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
      }>
      <IconTitleDescription
        icon={<ProjectCoordinator width={70} height={60} color={DARK_ORANGE} />}
        title={formatMessage(m.heading)}
        description={formatMessage(m.description)}
      />
    </ScreenContentWithButtonDock>
  );
};

StartNewProjectIntro.navTitle = m.title;

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
