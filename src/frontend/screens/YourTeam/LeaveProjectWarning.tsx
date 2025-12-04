import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  BLUE_GREY,
  WARNING_RED,
  WHITE,
  BLACK,
  NEW_DARK_GREY,
} from '../../lib/styles';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import {DeviceIcon} from '../../sharedComponents/DeviceIcon';
import MobilePhoneArrowIcon from '../../images/MobilePhoneArrow.svg';

const m = defineMessages({
  lastCoordinatorTitle: {
    id: 'screens.LeaveProjectWarning.lastCoordinatorTitle',
    defaultMessage: 'Device is last coordinator.',
  },
  lastDeviceTitle: {
    id: 'screens.LeaveProjectWarning.lastDeviceTitle',
    defaultMessage: 'Device is last device.',
  },
  lastCoordinatorDescription: {
    id: 'screens.LeaveProjectWarning.lastCoordinatorDescription',
    defaultMessage:
      'If this device leaves, then no other device can add or remove devices, adjust project info, or update the categories set.',
  },
  lastDeviceDescription: {
    id: 'screens.LeaveProjectWarning.lastDeviceDescription',
    defaultMessage:
      'If this device leaves, then all data on this project will be lost.',
  },
  inviteRecommendation: {
    id: 'screens.LeaveProjectWarning.inviteRecommendation',
    defaultMessage: 'To avoid this, invite a new device as a coordinator.',
  },
  exportRecommendation: {
    id: 'screens.LeaveProjectWarning.exportRecommendation',
    defaultMessage: 'Before leaving, export any important data.',
  },
  continueButton: {
    id: 'screens.LeaveProjectWarning.continueButton',
    defaultMessage: 'Continue',
  },
  cancel: {
    id: 'screens.LeaveProjectWarning.cancel',
    defaultMessage: 'Cancel',
  },
});

export const LeaveProjectWarning = ({
  route,
  navigation,
}: NativeRootNavigationProps<'LeaveProjectWarning'>) => {
  const {formatMessage} = useIntl();
  const {warningType, deviceType, memberType} = route.params;

  const isLastCoordinator = warningType === 'lastCoordinator';

  function handleContinue() {
    navigation.navigate('LeaveProject', {
      memberType,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <DeviceIcon deviceType={deviceType} size={80} />
          <View style={styles.warningBadge}>
            <MaterialIcon name="error" size={30} color={WARNING_RED} />
          </View>
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {formatMessage(
            isLastCoordinator ? m.lastCoordinatorTitle : m.lastDeviceTitle,
          )}
        </HeaderText>

        <BodyText style={styles.description}>
          {formatMessage(
            isLastCoordinator
              ? m.lastCoordinatorDescription
              : m.lastDeviceDescription,
          )}
        </BodyText>

        <View style={styles.warningCard}>
          {isLastCoordinator && (
            <View style={styles.bulletRow}>
              <MobilePhoneArrowIcon width={24} height={24} />
              <BodyText style={styles.bulletText}>
                {formatMessage(m.inviteRecommendation)}
              </BodyText>
            </View>
          )}
          <View style={styles.bulletRow}>
            <MaterialDesignIcons name="download" size={24} color={BLACK} />
            <BodyText variant="smallMeta" style={styles.bulletText}>
              {formatMessage(m.exportRecommendation)}
            </BodyText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <DestructiveButton
          fullSize
          onPress={handleContinue}
          text={formatMessage(m.continueButton)}
          renderIcon={({color, size}) => (
            <Ionicons
              name="arrow-forward-circle-outline"
              size={size}
              color={color}
            />
          )}
          iconPosition="right"
        />
        <SecondaryButton
          fullSize
          onPress={() => navigation.goBack()}
          text={formatMessage(m.cancel)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginTop: 40,
  },
  warningBadge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#999999',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  warningCard: {
    width: '100%',
    backgroundColor: '#FFF5EB',
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    padding: 20,
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bulletText: {
    flex: 1,
    color: NEW_DARK_GREY,
  },
  actions: {
    paddingVertical: 20,
    gap: 12,
    alignItems: 'center',
  },
});
