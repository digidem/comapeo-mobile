import * as React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useIntl} from 'react-intl';
import {m} from './privacyPolicyMessages';
import {PointContainer} from './PointContainer';
import {DiagnosticItem} from './DiagnosticItem';
import LockedWithKey from '../../images/LockedWithKey.svg';
import RaisedFistMediumSkinTone from '../../images/RaisedFistMediumSkinTone.svg';
import RaisedHandMediumSkinTone from '../../images/RaisedHandMediumSkinTone.svg';
import RedDot from '../../images/RedDot.svg';
import BustInSilhouette from '../../images/BustInSilhouette.svg';
import BarChart from '../../images/BarChart.svg';
import Wrench from '../../images/Wrench.svg';
import ChevronDown from '../../images/chevrondown.svg';
import ChevronUp from '../../images/chevrondown-expanded.svg';
import {styles} from './styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingParamsList} from '../../sharedTypes/navigation';

type PrivacyPolicyProps = Partial<
  NativeStackScreenProps<OnboardingParamsList, 'OnboardingPrivacyPolicy'>
>;

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  const {formatMessage} = useIntl();
  const [awanaExpanded, setAwanaExpanded] = React.useState(false);
  const [openSourceExpanded, setOpenSourceExpanded] = React.useState(false);

  return (
    <ScrollView>
      <View style={styles.overviewBox}>
        <Text style={styles.overviewText}>{formatMessage(m.overview)}</Text>
      </View>
      <View style={[styles.toggleContainer, styles.topToggleContainer]}>
        <TouchableOpacity
          onPress={() => setAwanaExpanded(prev => !prev)}
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
          onPress={() => setOpenSourceExpanded(prev => !prev)}
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
      <PointContainer
        icon={RedDot}
        title={formatMessage(m.privateByDefault)}
        description={formatMessage(m.privateByDefaultDescription)}
      />
      <PointContainer
        icon={BustInSilhouette}
        title={formatMessage(m.noPII)}
        description={formatMessage(m.noPIIDescription)}
      />
      <PointContainer
        icon={LockedWithKey}
        title={formatMessage(m.control)}
        description={formatMessage(m.controlDescription)}
      />
      <View style={styles.horizontalLine} />
      <Text style={styles.header}>{formatMessage(m.dataCollection)}</Text>
      <PointContainer
        icon={BarChart}
        title={formatMessage(m.whatIsCollected)}
        description={formatMessage(m.whatIsCollectedDescription)}
      />
      <View style={styles.diagnosticsContainer}>
        <Text style={[styles.pointTitle, {marginTop: 20}]}>
          {formatMessage(m.diagnosticsTitle)}
        </Text>
        <View style={styles.diagnosticsContent}>
          <DiagnosticItem
            title={formatMessage(m.crashData)}
            description={formatMessage(m.crashDataDescription)}
          />
          <DiagnosticItem
            title={formatMessage(m.appErrors)}
            description={formatMessage(m.appErrorsDescription)}
          />
          <DiagnosticItem
            title={formatMessage(m.performanceData)}
            description={formatMessage(m.performanceDataDescription)}
          />
          <DiagnosticItem
            title={formatMessage(m.deviceInfo)}
            description={formatMessage(m.deviceInfoDescription)}
          />
          <DiagnosticItem
            title={formatMessage(m.appInfo)}
            description={formatMessage(m.appInfoDescription)}
          />
          <View style={styles.horizontalLineSmall} />
          <Text style={[styles.pointTitle, {marginBottom: 20}]}>
            {formatMessage(m.appUsageTitle)}
          </Text>
          <DiagnosticItem
            title={formatMessage(m.userCount)}
            description={formatMessage(m.userCountDescription)}
          />
        </View>
      </View>
      <PointContainer
        icon={Wrench}
        title={formatMessage(m.whyCollected)}
        description={formatMessage(m.whyCollectedDescription)}
      />
      <PointContainer
        icon={RaisedHandMediumSkinTone}
        title={formatMessage(m.notCollected)}
        description={formatMessage(m.notCollectedDescription)}
      />
      <PointContainer
        icon={RaisedFistMediumSkinTone}
        title={formatMessage(m.thirdParty)}
        description={formatMessage(m.thirdPartyDescription)}
      />
    </ScrollView>
  );
};
