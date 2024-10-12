import * as React from 'react';
import {BottomSheetModalContent} from '../../../../sharedComponents/BottomSheetModal';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../../sharedComponents/Text';
import {QuestionMarkWithShadow} from '../../../../sharedComponents/icons/QuestionMarkWithShadow';

const m = defineMessages({
  title: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.title',
    defaultMessage: 'What is Included',
  },
  close: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.close',
    defaultMessage: 'Close',
  },
  observations: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.observations',
    defaultMessage: 'Observations (including photos and audio)',
  },
  tracks: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.tracks',
    defaultMessage: 'Tracks',
  },
  deviceNames: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.deviceNames',
    defaultMessage: 'Device Names',
  },
  projectSettings: {
    id: 'ProjectSettings.RemoteArchive.WhatsIncludedSheet.projectSettings',
    defaultMessage: 'Project Settings (categories, questions)',
  },
});

export const WhatsIncludedBottomSheetContent = ({
  closeSheet,
}: {
  closeSheet: () => void;
}) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetModalContent
      title={<Text style={{fontSize: 24}}>{formatMessage(m.title)}</Text>}
      descriptionStyle={{fontSize: 14, textAlign: 'left'}}
      description={
        `\u2022 ` +
        formatMessage(m.observations) +
        '\n' +
        `\u2022 ` +
        formatMessage(m.tracks) +
        '\n' +
        `\u2022 ` +
        formatMessage(m.deviceNames) +
        '\n' +
        `\u2022 ` +
        formatMessage(m.projectSettings)
      }
      icon={<QuestionMarkWithShadow width={60} height={60} />}
      buttonConfigs={[
        {
          text: formatMessage(m.close),
          onPress: closeSheet,
          variation: 'outlined',
        },
      ]}
    />
  );
};
