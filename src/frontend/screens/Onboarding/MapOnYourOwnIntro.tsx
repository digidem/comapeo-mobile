import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {Ionicons} from '@expo/vector-icons';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import ProjectCoordinatorIcon from '../../images/ProjectCoordinator.svg';
import {useCreateProject} from '@comapeo/core-react';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {Loading} from '../../sharedComponents/Loading';
import {DARK_ORANGE, COMAPEO_BLUE, WHITE, DARK_GREY} from '../../lib/styles';

const m = defineMessages({
  title: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.title',
    defaultMessage: 'Map On Your Own',
  },
  description: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.description',
    defaultMessage: 'Explore CoMapeo—invite collaborators anytime.',
  },
  benefit1: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.benefit1',
    defaultMessage: 'Snap photos on-the-go.',
  },
  benefit2: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.benefit2',
    defaultMessage: 'Add audio recordings.',
  },
  benefit3: {
    id: 'screens.Onboarding.MapOnYourOwnIntro.benefit3',
    defaultMessage: 'Track paths walked.',
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
  const {mutate: createProject, status} = useCreateProject();
  const {setActiveProjectId} = useActiveProjectIdActions();

  function handleGoToMap() {
    createProject(undefined, {
      onError: err => {
        console.error(err);
      },
      onSuccess: projectId => {
        setActiveProjectId(projectId);
      },
    });
  }

  if (status === 'pending') {
    return <Loading />;
  }

  return (
    <ScreenContentWithDock
      dockContent={
        <>
          <PrimaryButton
            testID="ONBOARDING.go-to-map-btn"
            fullSize
            text={t(m.goToMap)}
            iconPosition="left"
            renderIcon={({size}) => (
              <Ionicons name="map-outline" color={WHITE} size={size} />
            )}
            onPress={handleGoToMap}
          />
          <SecondaryButton
            testID="ONBOARDING.map-on-your-own-close-btn"
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
              navigation.navigate('Success');
            }}
          />
        </>
      }>
      <View style={styles.contentContainer}>
        <ProjectCoordinatorIcon
          width={70}
          height={63}
          color={DARK_ORANGE}
          fill={DARK_ORANGE}
        />
        <HeaderText variant="header2" style={styles.title}>
          {t(m.title)}
        </HeaderText>
        <BodyText style={styles.description}>{t(m.description)}</BodyText>
        <View style={styles.benefitsList}>
          <InfoListItem icon="camera-outline" text={t(m.benefit1)} />
          <InfoListItem icon="mic-outline" text={t(m.benefit2)} />
          <InfoListItem icon="navigate-outline" text={t(m.benefit3)} />
        </View>
      </View>
    </ScreenContentWithDock>
  );
};

function InfoListItem({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.benefitItem}>
      <Ionicons name={icon} size={26} color={DARK_GREY} />
      <BodyText variant="smallMeta" style={styles.benefitText}>
        {text}
      </BodyText>
    </View>
  );
}

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
  benefitsList: {
    gap: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  benefitText: {
    flex: 1,
    color: DARK_GREY,
  },
});
