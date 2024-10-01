import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {WHITE} from '../lib/styles';

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
  mediaAvailability: 'full' | 'preview' | 'both' | null;
};

export const MediaLabel: React.FC<MediaLabelProps> = ({
  textColor = WHITE,
  style,
  context,
  mediaAvailability,
}) => {
  const {formatMessage: t} = useIntl();

  console.log('mediaAvailability', mediaAvailability);
  let labelText = '';
  if (mediaAvailability === 'both') {
    labelText = t(m.labelFullSizePreviews);
  } else if (mediaAvailability === 'preview') {
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
