import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LockedWithKey from '../../images/LockedWithKey.svg';
import RaisedFistMediumSkinTone from '../../images/RaisedFistMediumSkinTone.svg';
import ChevronDown from '../../images/chevrondown.svg';
import ChevronUp from '../../images/chevrondown-expanded.svg';
import {
  BLUE_GREY,
  COMAPEO_DARK_BLUE,
  NEW_DARK_GREY,
  VERY_LIGHT_GREY,
} from '../../lib/styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceNamingParamsList} from '../../sharedTypes/navigation';

const m = defineMessages({
  navTitle: {
    id: 'screens.PrivacyPolicy.navTitle',
    defaultMessage: 'Privacy Policy',
  },
  overview: {
    id: 'screens.PrivacyPolicy.overview',
    defaultMessage:
      'The following explains what information (or "data") is sent from CoMapeo to the application developer, Awana Digital, and how that information is used.',
  },
  aboutAwana: {
    id: 'screens.PrivacyPolicy.aboutAwana',
    defaultMessage: 'About Awana Digital',
  },
  aboutAwanaContent: {
    id: 'screens.PrivacyPolicy.aboutAwanaContent',
    defaultMessage:
      'CoMapeo is developed by Awana Digital, a 501c3 non-profit organization registered in the United States. Awana digital works in solidarity with frontline communities to use technology to defend their rights and fight climate change.',
  },
  privacyPolicyTitle: {
    id: 'screens.PrivacyPolicy.privacyPolicyTitle',
    defaultMessage: 'CoMapeo Data Privacy',
  },
  openSource: {
    id: 'screens.PrivacyPolicy.openSource',
    defaultMessage: 'Open Source and the "Official" Version',
  },
  openSourceContent: {
    id: 'screens.PrivacyPolicy.openSourceContent',
    defaultMessage:
      'CoMapeo is an open-source application.\n\nThis means that anyone can view the code that makes the app work and can verify the privact declarations in this document. It also means that anyone can adapt the app to their own needs and release an alternative version.\n\nThis document refers to data collected by the official releases of CoMapeo, digitally signed by Awana Digital, available from the Google Play Store or the Awana Digital website.\n\nUnofficial releases of CoMapeo obtained from other channels are outside our control and may share additional information with other organizations.',
  },
  privateByDefault: {
    id: 'screens.PrivacyPolicy.privateByDefault',
    defaultMessage: 'Private by default',
  },
  noPII: {
    id: 'screens.PrivacyPolicy.noPII',
    defaultMessage: 'No personally identifiable information',
  },
  control: {
    id: 'screens.PrivacyPolicy.control',
    defaultMessage: 'You’re in control',
  },
  dataCollection: {
    id: 'screens.PrivacyPolicy.dataCollection',
    defaultMessage: 'CoMapeo Data Collection',
  },
  whatIsCollected: {
    id: 'screens.PrivacyPolicy.whatIsCollected',
    defaultMessage: 'What is collected?',
  },
  whyCollected: {
    id: 'screens.PrivacyPolicy.whyCollected',
    defaultMessage: 'Why is this data collected?',
  },
  thirdParty: {
    id: 'screens.PrivacyPolicy.thirdParty',
    defaultMessage: 'Third-party access to data',
  },
});

export const PrivacyPolicy = ({
  navigation,
}: NativeStackScreenProps<DeviceNamingParamsList, 'PrivacyPolicy'>) => {
  const {formatMessage} = useIntl();
  const [awanaExpanded, setAwanaExpanded] = React.useState(false);
  const [openSourceExpanded, setOpenSourceExpanded] = React.useState(false);

  const toggleAboutAwana = () => setAwanaExpanded(!awanaExpanded);
  const toggleOpenSource = () => setOpenSourceExpanded(!openSourceExpanded);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.overviewBox}>
        <Text style={styles.overviewText}>{formatMessage(m.overview)}</Text>
      </View>
      <View style={[styles.toggleContainer, styles.topToggleContainer]}>
        <TouchableOpacity
          onPress={toggleAboutAwana}
          style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{formatMessage(m.aboutAwana)}</Text>
          {awanaExpanded ? (
            <ChevronUp width={20} height={20} />
          ) : (
            <ChevronDown width={20} height={20} />
          )}
        </TouchableOpacity>
        {awanaExpanded && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              {formatMessage(m.aboutAwanaContent)}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.toggleContainer, styles.bottomToggleContainer]}>
        <TouchableOpacity
          onPress={toggleOpenSource}
          style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{formatMessage(m.openSource)}</Text>
          {openSourceExpanded ? (
            <ChevronUp width={20} height={20} />
          ) : (
            <ChevronDown width={20} height={20} />
          )}
        </TouchableOpacity>
        {openSourceExpanded && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              {formatMessage(m.openSourceContent)}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.header}>{formatMessage(m.privacyPolicyTitle)}</Text>

      {/* Privacy Points */}
      <View style={styles.pointContainer}>
        <MaterialIcon name="privacy-tip" size={24} color={COMAPEO_DARK_BLUE} />
        <Text style={styles.pointTitle}>
          {formatMessage(m.privateByDefault)}
        </Text>
        <Text>{/* Detailed description here */}</Text>
      </View>

      <View style={styles.pointContainer}>
        <MaterialIcon
          name="person-outline"
          size={24}
          color={COMAPEO_DARK_BLUE}
        />
        <Text style={styles.pointTitle}>{formatMessage(m.noPII)}</Text>
        <Text>{/* Detailed description here */}</Text>
      </View>

      <View style={styles.pointContainer}>
        <LockedWithKey width={24} height={24} />
        <Text style={styles.pointTitle}>{formatMessage(m.control)}</Text>
        <Text>{/* Detailed description here */}</Text>
      </View>

      <View style={styles.pointContainer}>
        <MaterialIcon name="bar-chart" size={24} color={COMAPEO_DARK_BLUE} />
        <Text style={styles.pointTitle}>{formatMessage(m.dataCollection)}</Text>
        <Text>{/* Detailed description here */}</Text>
      </View>

      <View style={styles.pointContainer}>
        <RaisedFistMediumSkinTone width={24} height={24} />
        <Text style={styles.pointTitle}>{formatMessage(m.thirdParty)}</Text>
        <Text>{/* Detailed description here */}</Text>
      </View>

      {/* Other content as needed */}
    </ScrollView>
  );
};

PrivacyPolicy.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  overviewBox: {
    width: '95%',
    padding: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    backgroundColor: VERY_LIGHT_GREY,
    marginBottom: 20,
  },
  overviewText: {
    fontSize: 14,
    marginBottom: 10,
  },
  toggleContainer: {
    width: '95%',
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    marginBottom: 0,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  topToggleContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomToggleContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  header: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  introBox: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionHeader: {
    paddingVertical: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20.8,
    textAlign: 'left',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: NEW_DARK_GREY,
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: COMAPEO_DARK_BLUE,
  },
});
