import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Button} from '../../sharedComponents/Button';
import {useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import CoMapeoShield from '../../images/CoMapeoShield.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NEW_DARK_GREY, BLUE_GREY} from '../../lib/styles';
import {m} from './DataPrivacyMessages';

export const DataPrivacy = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'DataPrivacy'>) => {
  const {formatMessage} = useIntl();

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            navigation.navigate('OnboardingPrivacyPolicy');
          }}
          style={styles.learnMoreButton}>
          {formatMessage(m.learnMore)}
        </Button>
        <Button
          fullWidth
          onPress={() => {
            navigation.navigate('DeviceNaming');
          }}>
          {formatMessage(m.next)}
        </Button>
      </View>
    </ScrollView>
  );
};

const GAP = 16;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  shieldIcon: {
    marginBottom: GAP,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: GAP,
  },
  descriptionContainer: {
    alignItems: 'center',
    width: '90%',
    gap: GAP,
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
  },
  bulletPoints: {
    gap: 8,
    paddingLeft: GAP,
    width: '80%',
  },
  bulletPointContainer: {
    flexDirection: 'row',
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 12,
  },
  bulletPointText: {
    flex: 1,
    fontSize: 14,
    color: NEW_DARK_GREY,
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
    gap: GAP,
  },
  learnMoreButton: {
    borderColor: BLUE_GREY,
    borderWidth: 2,
  },
});
