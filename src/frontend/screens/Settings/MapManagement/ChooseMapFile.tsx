import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {NEW_DARK_GREY, RED} from '../../../lib/styles';
import {Button} from '../../../sharedComponents/Button';
import {DownloadIcon} from '../../../sharedComponents/icons';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';

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
            <HeaderText variant="header5" style={styles.buttonTextBase}>
              {t(m.chooseFile)}
              <HeaderText variant="header5" style={styles.asteriskText}>
                {' '}
                *
              </HeaderText>
            </HeaderText>
          </View>
        </View>
      </Button>
      <BodyText variant="smallMeta" style={styles.fileTypeText}>
        {t(m.acceptedFileTypes)}
      </BodyText>
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
    letterSpacing: 0.5,
  },
  asteriskText: {
    color: RED,
  },
  fileTypeText: {
    textAlign: 'center',
    color: NEW_DARK_GREY,
  },
});
