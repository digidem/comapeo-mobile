import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {IconTitleDescription} from './IconTitleDescription';
import {SecondaryButton} from './Buttons';

const m = defineMessages({
  close: {
    id: 'sharedComponents.InviteLinkError.close',
    defaultMessage: 'Close',
  },
});

export function InviteLinkError({
  icon,
  title,
  description,
  onClose,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClose: () => void;
}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <IconTitleDescription
          icon={icon}
          title={title}
          description={description}
        />
      </View>
      <SecondaryButton fullSize text={t(m.close)} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
