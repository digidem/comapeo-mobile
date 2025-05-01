import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {FrontendRole} from '../hooks/useProjectRoleAndDetails';
import {HeaderText} from './Text/HeaderText';
import {BodyText} from './Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';
import {BLACK, DARK_GREY, VERY_LIGHT_GREY} from '../lib/styles';
import NoProjectIcon from '../images/NoProjectIcon.svg';
import {ViewStyleProp} from '../sharedTypes';

const m = defineMessages({
  mappingOnOwn: {
    id: 'projectInfoCard.mappingOnOwn',
    defaultMessage: 'You are mapping on your own.',
  },
  coordinator: {
    id: 'projectInfoCard.coordinator',
    defaultMessage: 'You are a coordinator on this project.',
  },
  participant: {
    id: 'projectInfoCard.participant',
    defaultMessage: 'You are a participant on this project.',
  },
});

export type ProjectInfoCardProps = {
  headerText: string;
  role: FrontendRole;
  projectDescription?: string;
  backgroundColor: string;
  ButtonsRow?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyleProp;
  testID?: string;
};

export const ProjectInfoCard = ({
  headerText,
  role,
  projectDescription,
  backgroundColor,
  ButtonsRow,
  onPress,
  style,
  testID,
}: ProjectInfoCardProps) => {
  const {formatMessage} = useIntl();

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      testID={testID}
      style={[styles.card, {backgroundColor: backgroundColor}, style]}>
      <HeaderText variant="header2">{headerText}</HeaderText>
      {projectDescription && (
        <BodyText variant="smallMeta">{projectDescription}</BodyText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {role === 'solo' ? (
          <NoProjectIcon />
        ) : (
          <MaterialIcon
            color={DARK_GREY}
            size={20}
            name={role === 'coordinator' ? 'manage-accounts' : 'people'}
          />
        )}
        <BodyText style={{marginLeft: 10}} variant="smallMeta">
          {role === 'solo'
            ? formatMessage(m.mappingOnOwn)
            : role === 'coordinator'
              ? formatMessage(m.coordinator)
              : formatMessage(m.participant)}
        </BodyText>
      </View>
      {ButtonsRow && ButtonsRow}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: VERY_LIGHT_GREY,
    borderRadius: 6,
    padding: 20,
    gap: 20,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
});
