import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {Ionicons} from '@expo/vector-icons';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import ProjectParticipantIcon from '../../images/ProjectParticipant.svg';
import {DARK_ORANGE, COMAPEO_BLUE} from '../../lib/styles';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';

const m = defineMessages({
  title: {
    id: 'screens.Onboarding.JoinProjectIntro.title',
    defaultMessage: 'Join a Project',
  },
  description: {
    id: 'screens.Onboarding.JoinProjectIntro.description',
    defaultMessage:
      'Coordinate with your team to receive a project invitation.',
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
    <ScreenContentWithDock
      dockContent={
        <SecondaryButton
          testID="ONBOARDING.join-project-close-btn"
          fullSize
          text={t(m.close)}
          iconPosition="left"
          renderIcon={({size}) => (
            <Ionicons
              name="close-circle-outline"
              color={COMAPEO_BLUE}
              size={size}
            />
          )}
          onPress={() => {
            navigation.goBack();
          }}
        />
      }>
      <IconTitleDescription
        icon={
          <ProjectParticipantIcon
            width={80}
            height={60}
            color={DARK_ORANGE}
            fill={DARK_ORANGE}
          />
        }
        title={t(m.title)}
        description={t(m.description)}
        style={styles.contentContainer}
      />
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 65,
  },
});
