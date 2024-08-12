import * as React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Button} from '../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingParamsList} from '../sharedTypes/navigation';
import CoMapeoShield from '../images/CoMapeoShield.svg';
import {NEW_DARK_GREY, BLUE_GREY} from '../lib/styles';

const {width, height} = Dimensions.get('window');

export const DataPrivacyScreen = ({
  navigation,
}: NativeStackScreenProps<DeviceNamingParamsList, 'DataPrivacy'>) => {
  const {formatMessage} = useIntl();

  const m = defineMessages({
    dataPrivacyTitle: {
      id: 'screens.DataPrivacy.title',
      defaultMessage: 'Data & Privacy',
    },
    dataPrivacyDescription: {
      id: 'screens.DataPrivacy.description',
      defaultMessage:
        'CoMapeo allows you and your collaborators to map offline without needing servers.',
    },
    dataPrivacyStays: {
      id: 'screens.DataPrivacy.stays',
      defaultMessage: 'Your data stays on your devices.',
    },
    dataPrivacyEncrypted: {
      id: 'screens.DataPrivacy.encrypted',
      defaultMessage: 'All data stays fully encrypted.',
    },
    dataPrivacyManageAndControl: {
      id: 'screens.DataPrivacy.manageAndControl',
      defaultMessage: 'Easily manage and control sharing and collaboration.',
    },
    dataPrivacyDiagnostic: {
      id: 'screens.DataPrivacy.diagnostic',
      defaultMessage:
        'Private by default — diagnostic information is fully anonymized and you can opt-out any time.',
    },
    learnMore: {
      id: 'screens.DataPrivacy.learnMore',
      defaultMessage: 'Learn More',
    },
    next: {
      id: 'screens.DataPrivacy.next',
      defaultMessage: 'Next',
    },
  });

  return (
    <View style={styles.container}>
      <CoMapeoShield width={64} height={80} style={styles.shieldIcon} />
      <Text style={styles.title}>{formatMessage(m.dataPrivacyTitle)}</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {formatMessage(m.dataPrivacyDescription)}
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>
            • {formatMessage(m.dataPrivacyStays)}
          </Text>
          <Text style={styles.bulletPoint}>
            • {formatMessage(m.dataPrivacyEncrypted)}
          </Text>
          <Text style={styles.bulletPoint}>
            • {formatMessage(m.dataPrivacyManageAndControl)}
          </Text>
          <Text style={styles.bulletPoint}>
            • {formatMessage(m.dataPrivacyDiagnostic)}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          testID="ONBOARDING.learn-more-btn"
          fullWidth
          variant="outlined"
          color="dark"
          onPress={() => {}}
          style={styles.learnMoreButton}>
          {formatMessage(m.learnMore)}
        </Button>
        <Button
          testID="ONBOARDING.next-btn"
          fullWidth
          onPress={() => {
            navigation.navigate('DeviceNaming');
          }}
          style={styles.nextButton}>
          {formatMessage(m.next)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  shieldIcon: {
    marginTop: height * 0.05,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  descriptionContainer: {
    alignItems: 'center',
    width: '90%',
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: height * 0.015,
  },
  bulletPoints: {
    marginBottom: height * 0.05,
    width: '80%',
  },
  bulletPoint: {
    fontSize: 14,
    marginBottom: height * 0.0075,
    color: NEW_DARK_GREY,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  learnMoreButton: {
    marginBottom: height * 0.025,
    borderColor: BLUE_GREY,
    borderWidth: 2,
  },
  nextButton: {
    marginBottom: height * 0.015,
  },
});