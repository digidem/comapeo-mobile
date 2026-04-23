import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {Text} from './Text';
import {DARK_GREY, LIGHT_GREY} from '../lib/styles';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  delete: {
    id: 'SharedComponents.ActionButtons.delete',
    defaultMessage: 'Delete',
    description: 'Button to delete an observation',
  },
  share: {
    id: 'SharedComponents.ActionButtons.share',
    defaultMessage: 'Share',
    description: 'Button to share an observation',
  },
});

type ActionButtonsProps = {
  handleDelete: () => void;
  handlePressShare?: () => void;
  canDelete: boolean;
  isShareButtonLoading?: boolean;
};

export const ActionButtons = ({
  handleDelete,
  handlePressShare,
  canDelete,
  isShareButtonLoading,
}: ActionButtonsProps) => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.buttonContainer}>
      {canDelete && (
        <Button iconName="delete" title={t(m.delete)} onPress={handleDelete} />
      )}
      {handlePressShare && (
        <Button
          iconName="share"
          isLoading={isShareButtonLoading}
          title={t(m.share)}
          onPress={handlePressShare}
        />
      )}
    </View>
  );
};

type ButtonProps = {
  onPress: () => void;
  iconName: 'delete' | 'share';
  title: string;
  isLoading?: boolean;
};

const Button = ({onPress, isLoading, iconName, title}: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{flex: 1}} disabled={isLoading}>
    <View style={styles.button}>
      {isLoading ? (
        <UIActivityIndicator />
      ) : (
        <MaterialIcons
          size={30}
          name={iconName}
          color={DARK_GREY}
          style={styles.buttonIcon}
        />
      )}
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  buttonIcon: {},
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 1,
  },
});
