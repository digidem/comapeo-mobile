import * as React from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
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
        <BodyText variant="smallMeta">{formatMessage(m.overview)}</BodyText>
      </View>
      <View style={[styles.toggleContainer, styles.topToggleContainer]}>
        <TouchableOpacity
          onPress={() => setAwanaExpanded(prev => !prev)}
          style={styles.sectionHeader}>
          <HeaderText variant="header5" style={styles.sectionTitle}>
            {formatMessage(m.aboutAwana)}
          </HeaderText>
          {awanaExpanded ? (
            <ChevronUp width={20} height={20} />
          ) : (
            <ChevronDown width={20} height={20} />
          )}
        </TouchableOpacity>
        {awanaExpanded && (
          <View style={styles.sectionContent}>
            <BodyText variant="smallMeta" style={styles.newDarkGrey}>
              {formatMessage(m.aboutAwanaContent)}
            </BodyText>
          </View>
        )}
      </View>
      <View style={[styles.toggleContainer, styles.bottomToggleContainer]}>
        <TouchableOpacity
          onPress={() => setOpenSourceExpanded(prev => !prev)}
          style={styles.sectionHeader}>
          <HeaderText variant="header5" style={styles.sectionTitle}>
            {formatMessage(m.openSource)}
          </HeaderText>
          {openSourceExpanded ? (
            <ChevronUp width={20} height={20} />
          ) : (
            <ChevronDown width={20} height={20} />
          )}
        </TouchableOpacity>
        {openSourceExpanded && (
          <View style={styles.sectionContent}>
            <BodyText variant="smallMeta" style={styles.newDarkGrey}>
              {formatMessage(m.openSourceContent)}
            </BodyText>
          </View>
        )}
      </View>
      <HeaderText variant="header2" style={styles.header}>
        {formatMessage(m.privacyPolicyTitle)}
      </HeaderText>
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
      <HeaderText variant="header2" style={styles.collectionHeader}>
        {formatMessage(m.dataCollection)}
      </HeaderText>
      <PointContainer
        icon={BarChart}
        title={formatMessage(m.whatIsCollected)}
        description={formatMessage(m.whatIsCollectedDescription)}
      />
      <View style={styles.diagnosticsContainer}>
        <HeaderText variant="header5" style={styles.diagnosticsTitle}>
          {formatMessage(m.diagnosticsTitle)}
        </HeaderText>
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
          <HeaderText variant="header5">
            {formatMessage(m.appUsageTitle)}
          </HeaderText>
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
