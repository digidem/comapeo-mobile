import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {WHITE} from '../lib/styles';
import {usePersistedSettings} from '../hooks/persistedState/usePersistedSettings';

const m = defineMessages({
  labelFullSizePreviews: {
    id: 'screens.MediaLabel.labelFullSizePreviews',
    defaultMessage: 'Full size and previews available',
  },
  labelPreviewsOnlyObservation: {
    id: 'screens.Observation.labelPreviewsOnlyObservation',
    defaultMessage: 'Only previews are available',
  },
  labelPreviewsOnlyOpenMedia: {
    id: 'screens.PhotoPreviewModal.labelPreviewsOnlyOpenMedia',
    defaultMessage: 'Only preview is available',
  },
});

type MediaLabelProps = {
  textColor?: string;
  style?: TextStyle;
  context: 'observation' | 'openMedia';
};

export const MediaLabel: React.FC<MediaLabelProps> = ({
  textColor = WHITE,
  style,
  context,
}) => {
  const {formatMessage: t} = useIntl();
  const syncSetting = usePersistedSettings(store => store.syncSetting);
  let labelText = '';
  if (syncSetting === 'everything') {
    labelText = t(m.labelFullSizePreviews);
  } else if (syncSetting === 'previews') {
    labelText =
      context === 'observation'
        ? t(m.labelPreviewsOnlyObservation)
        : t(m.labelPreviewsOnlyOpenMedia);
  }
  if (!labelText) return null;

  return (
    <Text style={[styles.mediaLabel, {color: textColor}, style]}>
      {labelText}
    </Text>
  );
};

const styles = StyleSheet.create({
  mediaLabel: {
    fontSize: 14,
  },
});
