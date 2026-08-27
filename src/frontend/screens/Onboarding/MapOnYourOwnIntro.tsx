import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import type {MaterialIconsIconName} from '@react-native-vector-icons/material-icons';
import {usePreventRemove} from '@react-navigation/native';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import ProjectCoordinatorIcon from '../../images/ProjectCoordinator.svg';
import CameraIcon from '../../images/camera.svg';
import TracksIcon from '../../images/Tracks.svg';
import MapIcon from '../../images/Map.svg';
import {useCreateProject} from '@comapeo/core-react';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {DARK_ORANGE, WHITE, DARK_GREY} from '../../lib/styles';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

const m = defineMessages({
  navTitle: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.title',
    defaultMessage: 'Map On Your Own',
  },
  exploreOnYourOwn: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.exploreOnYourOwn',
    defaultMessage: 'Explore CoMapeo on your own.',
  },
  inviteCollaborators: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.inviteCollaborators',
    defaultMessage: 'Invite collaborators anytime.',
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
  startFirstMap: {
    id: '$1screens.Onboarding.MapOnYourOwnIntro.startFirstMap',
    defaultMessage: 'Start First Map',
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
        <View style={{paddingBottom: 20}}>
          {status === 'pending' ? (
            <View style={{alignItems: 'center', paddingVertical: 12}}>
              <LoadingIndicator size="large" style={{flex: 0}} />
            </View>
          ) : (
            <PrimaryButton
              testID="ONBOARDING.go-to-map-btn"
              fullSize
              text={t(m.startFirstMap)}
              iconPosition="left"
              renderIcon={({size}) => (
                <MapIcon width={size} height={size} color={WHITE} />
              )}
              onPress={handleGoToMap}
            />
          )}
        </View>
      }>
      <View style={styles.contentContainer}>
        <IconTitleDescription
          icon={
            <ProjectCoordinatorIcon
              width={70}
              height={63}
              color={DARK_ORANGE}
              fill={DARK_ORANGE}
            />
          }
          title={t(m.exploreOnYourOwn)}
          description={t(m.inviteCollaborators)}
        />
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

MapOnYourOwnIntro.navTitle = m.navTitle;

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
    paddingTop: 65,
  },
  benefitsList: {
    paddingTop: 60,
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
