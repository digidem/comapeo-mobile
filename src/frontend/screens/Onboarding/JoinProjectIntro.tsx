import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import Ionicons from '@react-native-vector-icons/ionicons';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import ProjectParticipantIcon from '../../images/ProjectParticipant.svg';
import {DARK_ORANGE, COMAPEO_BLUE} from '../../lib/styles';

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
      <View style={styles.contentContainer}>
        <ProjectParticipantIcon
          width={80}
          height={60}
          color={DARK_ORANGE}
          fill={DARK_ORANGE}
        />
        <HeaderText variant="header2" style={styles.title}>
          {t(m.title)}
        </HeaderText>
        <BodyText style={styles.description}>{t(m.description)}</BodyText>
      </View>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    gap: 20,
    paddingTop: 65,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
