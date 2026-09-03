import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import DeviceIcon from '../../images/Device.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {defineMessages, useIntl} from 'react-intl';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {WHITE, DARK_GREEN, NEW_DARK_GREY} from '../../lib/styles';
import {useCreateProject, useOwnDeviceInfo} from '@comapeo/core-react';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import MatericalIcon from '@react-native-vector-icons/material-icons';
import AntDesign from '@react-native-vector-icons/ant-design';
import TracksIcon from '../../images/Tracks.svg';
import {usePreventRemove} from '@react-navigation/native';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
const m = defineMessages({
  deviceReady: {
    id: '$1screens.DeviceNaming.Success.deviceReady',
    defaultMessage: '{deviceName} is ready!',
  },
  startMapping: {
    id: '$1screens.DeviceNaming.Success.startMapping',
    defaultMessage: 'Start Mapping',
  },
  coordinateOrMap: {
    id: '$1screens.DeviceNaming.Success.coordinateOrMap',
    defaultMessage: 'Coordinate with team to start or map on your own.',
  },
  snapPhotos: {
    id: '$1screens.DeviceNaming.Success.snapPhotos',
    defaultMessage: 'Snap photos on-the-go.',
  },
  addAudio: {
    id: '$1screens.DeviceNaming.Success.addAudio',
    defaultMessage: 'Add audio recordings.',
  },
  tracks: {
    id: '$1screens.DeviceNaming.Success.tracks',
    defaultMessage: 'Track paths walked.',
  },
});
export const Success = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'Success'>) => {
  const {formatMessage} = useIntl();
  const {data: deviceInfo} = useOwnDeviceInfo();
  const deviceName = deviceInfo.name || '';
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
      contentContainerStyle={{paddingTop: 85, alignItems: 'center', gap: 20}}
      dockContent={
        status === 'pending' ? (
          <LoadingIndicator />
        ) : (
          <PrimaryButton
            testID="ONBOARDING.map-on-your-own-btn"
            fullSize
            text={formatMessage(m.startMapping)}
            iconPosition="left"
            renderIcon={({size, color}) => (
              <MatericalIcon name="map" size={size} color={color} />
            )}
            onPress={handleGoToMap}
          />
        )
      }>
      <View style={styles.iconContainer}>
        <DeviceIcon width={40} height={60} />
        <View style={styles.checkmarkCircle}>
          <Ionicons name="checkmark" color={WHITE} size={18} />
        </View>
      </View>
      <HeaderText
        style={{textAlign: 'center', paddingHorizontal: 20}}
        variant="header2">
        {formatMessage(m.deviceReady, {deviceName})}
      </HeaderText>
      <HeaderText
        style={{textAlign: 'center', paddingHorizontal: 40}}
        variant="header5">
        {formatMessage(m.coordinateOrMap)}
      </HeaderText>
      <View style={{gap: 12, paddingHorizontal: 20, marginTop: 20}}>
        <BulletListItem
          text={formatMessage(m.snapPhotos)}
          Icon={<MatericalIcon name="photo-camera" />}
        />
        <BulletListItem
          text={formatMessage(m.addAudio)}
          Icon={<AntDesign name="audio" />}
        />
        <BulletListItem text={formatMessage(m.tracks)} Icon={<TracksIcon />} />
      </View>
    </ScreenContentWithDock>
  );
};

function BulletListItem({text, Icon}: {text: string; Icon: React.ReactNode}) {
  return (
    <View style={styles.bulletItem}>
      {Icon}
      <BodyText variant="smallMeta" style={styles.bulletText}>
        {text}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 60,
    height: 70,
    alignItems: 'center',
  },
  checkmarkCircle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: DARK_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletText: {
    flexShrink: 1,
    color: NEW_DARK_GREY,
  },
});
