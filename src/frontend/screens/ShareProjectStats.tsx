import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import GraphIcon from '../images/Graph.svg';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NEW_DARK_GREY} from '../lib/styles';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';

const m = defineMessages({
  shareProjectStats: {
    id: 'screens.ShareProjectStats.shareProjectStats',
    defaultMessage: 'Share Project Statistics',
  },
  description: {
    id: 'screens.ShareProjectStats.description',
    defaultMessage:
      'This will help us gather data about how CoMapeo is being used and what additional features are needed.',
  },
  infoAnonymized: {
    id: 'screens.ShareProjectStats.infoAnonymized',
    defaultMessage: 'Shared information will be completely anonymized',
  },
  fullyEncrypted: {
    id: 'screens.ShareProjectStats.fullyEncrypted',
    defaultMessage: 'Your project will stay fully encrypted',
  },
  skip: {
    id: 'screens.ShareProjectStats.skip',
    defaultMessage: 'No, Skip for now',
  },
  yesShare: {
    id: 'screens.ShareProjectStats.yesShare',
    defaultMessage: 'Yes, Share Stats',
  },
});

export const ShareProjectStats = ({
  route,
  navigation,
}: NativeRootNavigationProps<'ShareProjectStats'>) => {
  const {formatMessage} = useIntl();
  const {projectName, projectType} = route.params;
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <GraphIcon />
        <HeaderText variant="header1" style={styles.text}>
          {formatMessage(m.shareProjectStats)}
        </HeaderText>
        <View style={{marginTop: 20, padding: 20}}>
          <BodyText>{formatMessage(m.description)} </BodyText>
          <View style={styles.itemContainter}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bullet}
            />
            <BodyText variant="smallMeta" style={{color: NEW_DARK_GREY}}>
              {formatMessage(m.infoAnonymized)}
            </BodyText>
          </View>
          <View style={styles.itemContainter}>
            <MaterialIcons
              name="circle"
              size={4}
              color={NEW_DARK_GREY}
              style={styles.bullet}
            />
            <BodyText variant="smallMeta" style={{color: NEW_DARK_GREY}}>
              {formatMessage(m.fullyEncrypted)}
            </BodyText>
          </View>
        </View>
      </View>
      <View>
        <SecondaryButton
          fullSize
          onPress={() => {
            navigation.replace(
              projectType === 'newProject'
                ? 'ProjectCreatedNewProject'
                : 'ProjectCreatedNewSolo',
              {
                name: projectName,
              },
            );
          }}
          text={formatMessage(m.skip)}
        />
        <PrimaryButton
          style={{marginTop: 10}}
          fullSize
          onPress={() => {
            // TO DO, API to share project stats
            navigation.replace(
              projectType === 'newProject'
                ? 'ProjectCreatedNewProject'
                : 'ProjectCreatedNewSolo',
              {
                name: projectName,
              },
            );
          }}
          text={formatMessage(m.yesShare)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
  },
  bullet: {
    marginTop: 10,
    marginRight: 10,
  },
  itemContainter: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
