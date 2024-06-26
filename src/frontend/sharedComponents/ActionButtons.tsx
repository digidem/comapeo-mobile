import * as React from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text} from './Text';
import {DARK_GREY, LIGHT_GREY} from '../lib/styles';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';

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
  cancel: {
    id: 'SharedComponents.ActionButtons.cancel',
    defaultMessage: 'Cancel',
    description: 'Button to cancel delete of observation',
  },
  confirm: {
    id: 'SharedComponents.ActionButtons.confirm',
    defaultMessage: 'Yes, delete',
    description: 'Button to confirm delete of observation',
  },
});

type ActionButtonsProps = {
  handleDelete: () => void;
  handlePressShare?: () => void;
  isMine: boolean;
  isShareButtonLoading?: boolean;
  deleteMessage: MessageDescriptor;
};

export const ActionButtons = ({
  handleDelete,
  handlePressShare,
  isMine,
  isShareButtonLoading,
  deleteMessage,
}: ActionButtonsProps) => {
  const {formatMessage: t} = useIntl();

  function pressDeleteAlert() {
    Alert.alert(t(deleteMessage), undefined, [
      {
        text: t(m.cancel),
        onPress: () => {},
      },
      {
        text: t(m.confirm),
        onPress: handleDelete,
      },
    ]);
  }

  return (
    <View style={styles.buttonContainer}>
      {isMine && (
        <Button
          iconName="delete"
          title={t(m.delete)}
          onPress={pressDeleteAlert}
        />
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
  onPress: () => any;
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
