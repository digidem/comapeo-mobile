import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import LockedWithKey from '../../images/LockedWithKey.svg';
import RaisedFistMediumSkinTone from '../../images/RaisedFistMediumSkinTone.svg';
import ChevronDown from '../../images/chevrondown.svg';
import ChevronUp from '../../images/chevrondown-expanded.svg';
import RedDot from '../../images/redDot.svg';
import BustInSilhouette from '../../images/bustInSilhouette.svg';
import BarChart from '../../images/barChart.svg';
import Wrench from '../../images/wrench.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  BLACK,
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
  privateByDefaultDescription: {
    id: 'screens.PrivacyPolicy.privateByDefaultDescription',
    defaultMessage:
      "The data you collect and create with CoMapeo (locations, photos, video, audio, text) is only stored on your device by default, and is not stored or sent anywhere else.\n\nWhen you share data with collaborators by joining a project with them, it is sent encrypted, directly to your collaborators' device. This means that the data is not sent via Awana Digital, nor anyone else, on its way to your collaborator.\n\nAwana Digital never sees nor has access to any of the data you collect with CoMapeo unless you explicitly send it to us.",
  },
  noPII: {
    id: 'screens.PrivacyPolicy.noPII',
    defaultMessage: 'No personally identifiable information',
  },
  noPIIDescription: {
    id: 'screens.PrivacyPolicy.noPIIDescription',
    defaultMessage:
      'Using CoMapeo does not require a user account.\n\nAwana Digital does not collect your name, email address or any other personal details.\n\nNo permanent user identifier or device identifier is ever shared with Awana Digital, and we take extra measures to ensure that no information you share can be used to track you: identifiers are randomized and rotated (changed) every month and we do not store IP addresses.',
  },
  control: {
    id: 'screens.PrivacyPolicy.control',
    defaultMessage: "You're in control",
  },
  controlDescription: {
    id: 'screens.PrivacyPolicy.controlDescription',
    defaultMessage:
      'You can opt out of sending any information to Awana Digital.\n\nYou choose where your data is stored and who it is shared with. You may choose to share anonymized, summarized data about how you use CoMapeo with Awana Digital.\n\nWe will always be transparent about what information you choose to share for the purposed of improving the app, and this information will never include photos, videos, audio, text, or precise locations that you have entered into CoMapeo.',
  },
  dataCollection: {
    id: 'screens.PrivacyPolicy.dataCollection',
    defaultMessage: 'CoMapeo Data Collection',
  },
  whatIsCollected: {
    id: 'screens.PrivacyPolicy.whatIsCollected',
    defaultMessage: 'What is collected?',
  },
  whatIsCollectedDescription: {
    id: 'screens.PrivacyPolicy.whatIsCollectedDescription',
    defaultMessage:
      'By default, anonymized diagnostic information about your device, app crashes, errors and performance is shared with Awana Digital.\n\nYou can opt-out of sharing this information at any time. This diagnostic information is completely anonymized and it never contains any of your data (the data you have collected with CoMapeo).',
  },
  whyCollected: {
    id: 'screens.PrivacyPolicy.whyCollected',
    defaultMessage: 'Why is this data collected?',
  },
  whyCollectedDescription: {
    id: 'screens.PrivacyPolicy.whyCollectedDescription',
    defaultMessage:
      'Crash data and app errors together with the device and app info provide Awana Digital with the information we need to fix errors and bugs in the app.\n\nThe performance data helps us improve the responsiveness of the app and identify errors.\n\nThe country where CoMapeo is being used and the language of the UI helps us understand minimal information about CoMapeo users: “How many CoMapeo users are there in each country?',
  },
  thirdParty: {
    id: 'screens.PrivacyPolicy.thirdParty',
    defaultMessage: 'Third-party access to data',
  },
  thirdPartyDescription: {
    id: 'screens.PrivacyPolicy.thirdPartyDescription',
    defaultMessage:
      'A "third-party" is an organization other than Awana Digital.',
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
      <View style={styles.pointContainer}>
        <View style={styles.pointHeader}>
          <RedDot width={16} height={16} />
          <Text style={styles.pointTitle}>
            {formatMessage(m.privateByDefault)}
          </Text>
        </View>
        <Text style={styles.pointDescription}>
          {formatMessage(m.privateByDefaultDescription)}
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <View style={styles.pointHeader}>
          <BustInSilhouette width={16} height={16} />
          <Text style={styles.pointTitle}>{formatMessage(m.noPII)}</Text>
        </View>
        <Text style={styles.pointDescription}>
          {formatMessage(m.noPIIDescription)}
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <View style={styles.pointHeader}>
          <LockedWithKey width={16} height={16} />
          <Text style={styles.pointTitle}>{formatMessage(m.control)}</Text>
        </View>
        <Text style={styles.pointDescription}>
          {formatMessage(m.controlDescription)}
        </Text>
      </View>
      <View style={styles.horizontalLine} />
      <Text style={styles.header}>{formatMessage(m.dataCollection)}</Text>
      <View style={styles.pointContainer}>
        <View style={styles.pointHeader}>
          <BarChart width={16} height={16} />
          <Text style={styles.pointTitle}>
            {formatMessage(m.whatIsCollected)}
          </Text>
        </View>
        <Text style={styles.pointDescription}>
          {formatMessage(m.whatIsCollectedDescription)}
        </Text>
      </View>
      <View style={styles.diagnosticsContainer}>
        <Text style={[styles.pointTitle, {marginTop: 20}]}>Diagnostics</Text>
        <View style={styles.diagnosticsContent}>
          <View style={styles.diagnosticsItem}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>Crash data:</Text>
              <Text style={styles.diagnosticsDescription}>
                Information about what caused the app to close unexpectedly
              </Text>
            </View>
          </View>
          <View style={styles.diagnosticsItem}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>App Errors:</Text>
              <Text style={styles.diagnosticsDescription}>
                Information about internal errors that result in the app not
                functioning as expected
              </Text>
            </View>
          </View>
          <View style={styles.diagnosticsItem}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>Performance Data:</Text>
              <Text style={styles.diagnosticsDescription}>
                Such as launch time, energy usage, app freezes, and
                responsiveness
              </Text>
            </View>
          </View>
          <View style={styles.diagnosticsItem}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>Device Info:</Text>
              <Text style={styles.diagnosticsDescription}>
                Such as model and manufacturer of your device; device operating
                system; screen size; device locale (language); device memory.
              </Text>
            </View>
          </View>
          <View style={styles.diagnosticsItem}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>App Info:</Text>
              <Text style={styles.diagnosticsDescription}>
                The version and locale (language) of CoMapeo
              </Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />
          <Text style={styles.pointTitle}>App Usage</Text>
          <View style={styles.diagnosticsItem}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bulletIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.boldText}>Country:</Text>
              <Text style={styles.diagnosticsDescription}>
                The country where CoMapeo is being used
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.pointContainer}>
        <View style={styles.pointHeader}>
          <Wrench width={16} height={16} />
          <Text style={styles.pointTitle}>{formatMessage(m.whyCollected)}</Text>
        </View>
        <Text style={styles.pointDescription}>
          {formatMessage(m.whyCollectedDescription)}
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <View style={styles.pointHeader}>
          <RaisedFistMediumSkinTone width={16} height={16} />
          <Text style={styles.pointTitle}>{formatMessage(m.thirdParty)}</Text>
        </View>
        <Text style={styles.pointDescription}>
          {formatMessage(m.thirdPartyDescription)}
        </Text>
      </View>
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
    marginBottom: 20,
    width: '95%',
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: BLACK,
  },
  pointDescription: {
    fontSize: 14,
    color: NEW_DARK_GREY,
  },
  horizontalLine: {
    borderBottomColor: '#CCCCD6',
    borderBottomWidth: 1,
    marginVertical: 20,
    width: '100%',
  },
  diagnosticsContainer: {
    width: '95%',
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    marginBottom: 20,
  },
  diagnosticsContent: {
    paddingHorizontal: 10,
    marginTop: 16,
  },
  diagnosticsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  bulletIcon: {
    marginTop: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: NEW_DARK_GREY,
  },
  diagnosticsDescription: {
    fontSize: 14,
    color: NEW_DARK_GREY,
    marginLeft: 5,
    textAlign: 'left',
  },
});
