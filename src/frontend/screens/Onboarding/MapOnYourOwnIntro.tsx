import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import type {MaterialIconsIconName} from '@react-native-vector-icons/material-icons';
import {usePreventRemove} from '@react-navigation/native';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import ProjectCoordinatorIcon from '../../images/ProjectCoordinator.svg';
import CameraIcon from '../../images/camera.svg';
import TracksIcon from '../../images/Tracks.svg';
import MapIcon from '../../images/Map.svg';
import {useCreateProject} from '@comapeo/core-react';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {DARK_ORANGE, COMAPEO_BLUE, WHITE, DARK_GREY} from '../../lib/styles';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

const m = defineMessages({
  title: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.title',
    defaultMessage: 'Map On Your Own',
  },
  description: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.description',
    defaultMessage: 'Explore CoMapeo—invite collaborators anytime.',
  },
  snapPhotos: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.snapPhotos',
    defaultMessage: 'Snap photos on-the-go.',
  },
  addAudio: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.addAudio',
    defaultMessage: 'Add audio recordings.',
  },
  trackPaths: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.trackPaths',
    defaultMessage: 'Track paths walked.',
  },
  goToMap: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.goToMap',
    defaultMessage: 'Go to Map',
  },
  close: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.close',
    defaultMessage: 'Close',
  },
});

export const MapOnYourOwnIntro = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'MapOnYourOwnIntro'>) => {
  const {formatMessage: t} = useIntl();
  const {mutate: createProject, status} = useCreateProject();
  const {setActiveProjectId} = useActiveProjectIdActions();

  // Prevent navigating away during loading, but allow programmatic navigation
  usePreventRemove(status === 'pending', () => {});

  function handleGoToMap() {
    createProject(undefined, {
      onError: err => {
        navigation.navigate('ErrorBottomSheet', {error: err});
      },
      onSuccess: projectId => {
        setActiveProjectId(projectId);
      },
    });
  }

  return (
    <ScreenContentWithDock
      dockContent={
        <View style={{gap: 12, paddingBottom: 20}}>
          {status === 'pending' ? (
            <View style={{alignItems: 'center', paddingVertical: 12}}>
              <LoadingIndicator size="large" style={{flex: 0}} />
            </View>
          ) : (
            <>
              <PrimaryButton
                testID="ONBOARDING.go-to-map-btn"
                fullSize
                text={t(m.goToMap)}
                iconPosition="left"
                renderIcon={({size}) => (
                  <MapIcon width={size} height={size} color={WHITE} />
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
                  navigation.goBack();
                }}
              />
            </>
          )}
        </View>
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
          <InfoListItem
            icon={{type: 'svg', component: CameraIcon}}
            text={t(m.snapPhotos)}
          />
          <InfoListItem
            icon={{type: 'materialIcon', name: 'mic-none'}}
            text={t(m.addAudio)}
          />
          <InfoListItem
            icon={{type: 'svg', component: TracksIcon}}
            text={t(m.trackPaths)}
          />
        </View>
      </View>
    </ScreenContentWithDock>
  );
};

type IconConfig =
  | {
      type: 'svg';
      component: React.ComponentType<{
        width: number;
        height: number;
        color: string;
        fill: string;
      }>;
    }
  | {type: 'materialIcon'; name: MaterialIconsIconName};

function InfoListItem({icon, text}: {icon: IconConfig; text: string}) {
  const iconSize = 26;

  return (
    <View style={styles.benefitItem}>
      {icon.type === 'svg' ? (
        <icon.component
          width={iconSize}
          height={iconSize}
          color={DARK_GREY}
          fill={DARK_GREY}
        />
      ) : (
        <MaterialIcons name={icon.name} size={iconSize} color={DARK_GREY} />
      )}
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
    paddingTop: 40,
    gap: 12,
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  benefitText: {
    color: DARK_GREY,
  },
});
