import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {MEDIUM_GREY, RED} from '../../../lib/styles';
import {Button} from '../../../sharedComponents/Button';
import {Text} from '../../../sharedComponents/Text';
import {DownloadIcon} from '../../../sharedComponents/icons';

const m = defineMessages({
  chooseFile: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.ChooseMapFile.chooseFile',
    defaultMessage: 'Choose File',
  },
  acceptedFileTypes: {
    id: 'screens.Settings.MapManagement.BackgroundMaps.ChooseMapFile.acceptedFileTypes',
    defaultMessage: 'Accepted file types are .smp',
  },
});

export function ChooseMapFile({onChooseFile}: {onChooseFile: () => void}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <Button fullWidth variant="outlined" onPress={onChooseFile}>
        <View style={styles.buttonContentContainer}>
          <DownloadIcon size={24} />
          <View>
            <Text style={styles.buttonTextBase}>
              {t(m.chooseFile)}
              <Text style={styles.asteriskText}> *</Text>
            </Text>
          </View>
        </View>
      </Button>
      <Text style={styles.fileTypeText}>{t(m.acceptedFileTypes)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextBase: {
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 18,
  },
  asteriskText: {
    fontSize: 18,
    color: RED,
  },
  fileTypeText: {
    color: MEDIUM_GREY,
    fontSize: 14,
    textAlign: 'center',
  },
});
