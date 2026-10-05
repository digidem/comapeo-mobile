import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import Ionicons from '@react-native-vector-icons/ionicons';

import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {ProjectCard} from '../../sharedComponents/ProjectCard';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {BLACK} from '../../lib/styles';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  receivedLinkTo: {
    id: 'screens.Invites.RequestToJoin.receivedLinkTo',
    defaultMessage: "You've received a link to...",
  },
  requestToJoin: {
    id: 'screens.Invites.RequestToJoin.requestToJoin',
    defaultMessage: 'Request to Join',
  },
  close: {
    id: 'screens.Invites.RequestToJoin.close',
    defaultMessage: 'Close',
  },
});

export const RequestToJoin = ({
  route,
  navigation,
}: NativeRootNavigationProps<'RequestToJoin'>) => {
  const {formatMessage} = useIntl();
  const {projectName} = route.params;

  function requestToJoin() {
    navigation.replace('JoinProject', route.params);
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <BodyText variant="tinyMeta" style={styles.receivedLabel}>
          {formatMessage(m.receivedLinkTo)}
        </BodyText>

        <ProjectCard projectName={projectName} />

        <View style={styles.buttonContainer}>
          <PrimaryButton
            fullSize
            testID="RTJ.request-btn"
            onPress={requestToJoin}
            text={formatMessage(m.requestToJoin)}
            renderIcon={({color, size}) => (
              <Ionicons color={color} size={size} name="send" />
            )}
          />
          <SecondaryButton
            fullSize
            testID="RTJ.close-btn"
            onPress={() => navigation.goBack()}
            text={formatMessage(m.close)}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  receivedLabel: {
    textTransform: 'uppercase',
    fontWeight: '500',
    alignSelf: 'stretch',
    color: BLACK,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 18,
    gap: 12,
  },
});
