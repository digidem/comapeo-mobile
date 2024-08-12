import * as React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Button} from '../../sharedComponents/Button';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingParamsList} from '../../sharedTypes/navigation';
import CoMapeoShield from '../../images/CoMapeoShield.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NEW_DARK_GREY, BLUE_GREY} from '../../lib/styles';

const {width, height} = Dimensions.get('window');

export const DataPrivacy = ({
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
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyStays)}
            </Text>
          </View>
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyEncrypted)}
            </Text>
          </View>
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyManageAndControl)}
            </Text>
          </View>
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <Text style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyDiagnostic)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          fullWidth
          variant="outlined"
          color="dark"
          onPress={() => {
            navigation.navigate('PrivacyPolicy');
          }}
          style={styles.learnMoreButton}>
          {formatMessage(m.learnMore)}
        </Button>
        <Button
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
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.015,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 8,
  },
  bulletPointText: {
    flex: 1,
    fontSize: width * 0.035,
    color: NEW_DARK_GREY,
  },
  buttonContainer: {
    width: '90%',
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
