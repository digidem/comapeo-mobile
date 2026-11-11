import * as React from 'react';
import {StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {DARK_ORANGE} from '../../lib/styles';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {usePreventBackNavigation} from '../../hooks/usePreventBackNavigation';
import {ScreenContentWithButtonDockNoHeader} from '../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDockNoHeader.tsx';

const m = defineMessages({
  youveLeftProject: {
    id: '$1screens.LeftProjectConfirmation.youLeftProject',
    defaultMessage: 'This device has left the project {projectName}.',
  },
  openDefaultProject: {
    id: '$1screens.LeftProjectConfirmation.openDefaultProject',
    defaultMessage: 'Open {deviceName}',
  },
});

export const LeftProjectConfirmation = ({
  navigation,
  route,
}: NativeRootNavigationProps<'LeftProjectConfirmation'>) => {
  const projectName = route.params.projectName;
  const {formatMessage} = useIntl();
  const {data} = useOwnDeviceInfo();
  const deviceName = data?.name;

  usePreventBackNavigation();

  function handleOpenDefaultProject() {
    navigation.popToTop();
  }

  return (
    <ScreenContentWithButtonDockNoHeader
      contentContainerStyle={styles.content}
      bottomButton={
        <PrimaryButton
          fullSize
          onPress={handleOpenDefaultProject}
          text={formatMessage(m.openDefaultProject, {
            deviceName,
          })}
          renderIcon={({color, size}) => (
            <MaterialIcons name="phone-android" size={size} color={color} />
          )}
        />
      }>
      <MaterialDesignIcons
        name="hand-wave-outline"
        size={80}
        color={DARK_ORANGE}
      />
      <HeaderText variant="header2" style={styles.title}>
        {formatMessage(m.youveLeftProject, {projectName})}
      </HeaderText>
    </ScreenContentWithButtonDockNoHeader>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
  },
});
