import * as React from 'react';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {StyleSheet, View} from 'react-native';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {isQABuild} from '../../lib/appVariant';
import {useQADeviceName} from '../../contexts/QADeviceNameStoreContext';
import {NEW_DARK_GREY} from '../../lib/styles';

const m = defineMessages({
  goBack: {
    id: 'MapManagement.ErrorBottomSheet.goBack',
    defaultMessage: 'Go Back',
  },
});

function formatUTCTimestamp(date: Date): string {
  return (
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }).format(date) + ' UTC'
  );
}

function QAInfoSection() {
  const qaDeviceName = useQADeviceName();
  const timestamp = React.useMemo(() => formatUTCTimestamp(new Date()), []);

  return (
    <View style={styles.qaInfoSection}>
      <BodyText variant="smallMeta" style={styles.qaInfoText}>
        {timestamp}
      </BodyText>
      {qaDeviceName && (
        <BodyText variant="smallMeta" style={styles.qaInfoText}>
          {qaDeviceName}
        </BodyText>
      )}
    </View>
  );
}

export const BackgroundMapErrorBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'BackgroundMapErrorBottomSheet'>) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <ErrorIcon width={160} height={160} style={styles.icon} />
          <HeaderText style={styles.header}>{route.params.title}</HeaderText>
          <BodyText style={{textAlign: 'center'}}>
            {route.params.description}
          </BodyText>
          {isQABuild && <QAInfoSection />}
        </View>
        <SecondaryButton
          style={{alignSelf: 'center'}}
          fullSize
          onPress={() => navigation.goBack()}
          text={formatMessage(m.goBack)}
        />
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginTop: 40,
    marginBottom: 30,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  qaInfoSection: {
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  qaInfoText: {
    color: NEW_DARK_GREY,
  },
});
