import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button} from '../../sharedComponents/Button';
import {useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';
import CoMapeoShield from '../../images/CoMapeoShield.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NEW_DARK_GREY, BLUE_GREY} from '../../lib/styles';
import {m} from './DataPrivacyMessages';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

export const DataPrivacy = ({
  navigation,
}: NativeStackScreenProps<OnboardingParamsList, 'DataPrivacy'>) => {
  const {formatMessage} = useIntl();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CoMapeoShield width={64} height={80} style={styles.shieldIcon} />
      <HeaderText style={styles.title}>
        {formatMessage(m.dataPrivacyTitle)}
      </HeaderText>
      <View style={styles.descriptionContainer}>
        <BodyText style={styles.description}>
          {formatMessage(m.dataPrivacyDescription)}
        </BodyText>
        <View style={styles.bulletPoints}>
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <BodyText variant="smallMeta" style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyStays)}
            </BodyText>
          </View>
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <BodyText variant="smallMeta" style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyEncrypted)}
            </BodyText>
          </View>
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <BodyText variant="smallMeta" style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyManageAndControl)}
            </BodyText>
          </View>
          <View style={styles.bulletPointContainer}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <BodyText variant="smallMeta" style={styles.bulletPointText}>
              {formatMessage(m.dataPrivacyDiagnostic)}
            </BodyText>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          fullWidth
          variant="outlined"
          color="ComapeoBlue"
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
    marginBottom: GAP,
  },
  descriptionContainer: {
    alignItems: 'center',
    width: '90%',
    gap: GAP,
  },
  description: {
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
