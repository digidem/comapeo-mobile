import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {NEW_DARK_GREY, WHITE} from '../../lib/styles';
import ExchangeIcon from '../../images/OrangeExchange.svg';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';

const m = defineMessages({
  screenTitle: {
    id: 'screens.ExchangeSoloScreen.title',
    defaultMessage: 'Exchange',
  },
  securelyShare: {
    id: 'screens.ExchangeSoloScreen.securelyShare',
    defaultMessage: 'Securely share observations across connected devices.',
  },
  getStarted: {
    id: 'screens.ExchangeSoloScreen.getStarted',
    defaultMessage: 'Get started in two simple ways:',
  },
  inviteCollaborators: {
    id: 'screens.ExchangeSoloScreen.inviteCollaborators',
    defaultMessage: 'Invite collaborators to your project from the main menu',
  },
  joinExisting: {
    id: 'screens.ExchangeSoloScreen.joinExisting',
    defaultMessage: 'Join an existing project by accepting an invitation',
  },
  dataSecure: {
    id: 'screens.ExchangeSoloScreen.dataSecure',
    defaultMessage:
      'Your data stays secure while exchanging between trusted devices.',
  },
  goBack: {
    id: 'screens.ExchangeSoloScreen.goBack',
    defaultMessage: 'Go Back',
  },
});

type ExchangeSoloScreenProps = {
  onGoBack: () => void;
};

export function ExchangeSoloScreen({onGoBack}: ExchangeSoloScreenProps) {
  const {formatMessage: t} = useIntl();

  return (
    <ScreenContentWithDock
      dockContent={
        <SecondaryButton fullSize text={t(m.goBack)} onPress={onGoBack} />
      }>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <ExchangeIcon width={80} height={80} />
        </View>
        <HeaderText variant="header1">{t(m.screenTitle)}</HeaderText>
        <BodyText variant="regular" style={styles.introTextLarge}>
          {t(m.securelyShare)}
        </BodyText>
        <BodyText variant="smallMeta" style={styles.regularText}>
          {t(m.getStarted)}
        </BodyText>
        <View style={styles.bodyContainer}>
          <ListItem text={t(m.inviteCollaborators)} />
          <ListItem text={t(m.joinExisting)} />
        </View>
        <BodyText variant="smallMeta" style={styles.regularText}>
          {t(m.dataSecure)}
        </BodyText>
      </View>
    </ScreenContentWithDock>
  );
}

ExchangeSoloScreen.navTitle = m.screenTitle;

function ListItem({text}: {text: string}) {
  return (
    <View style={styles.listItem}>
      <MaterialIcons
        name="circle"
        size={4}
        color={NEW_DARK_GREY}
        style={styles.bulletIcon}
      />
      <BodyText variant="smallMeta" style={styles.regularText}>
        {text}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 20,
    gap: 10,
    alignItems: 'center',
  },
  iconContainer: {paddingTop: 30},
  bodyContainer: {
    flex: 1,
    gap: 12,
  },
  introTextLarge: {
    lineHeight: 21,
    alignSelf: 'flex-start',
    paddingTop: 30,
  },
  regularText: {
    lineHeight: 21,
    color: NEW_DARK_GREY,
    alignSelf: 'flex-start',
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletIcon: {
    marginTop: 8,
  },
});
