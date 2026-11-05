import * as React from 'react';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {defineMessages, useIntl} from 'react-intl';

import GreenCheck from '../../images/Success.svg';
import {MEDIUM_GREY} from '../../lib/styles';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {ScreenContentWithButtonDockNoHeader} from '../../sharedComponents/ScreenContentWithButtonDock/ScreenContentWithButtonDockNoHeader.tsx.tsx';
import {SecondaryButton} from '../../sharedComponents/Buttons.tsx';

const m = defineMessages({
  archiveAdded: {
    id: '$1ProjectSettings.RemoteArchive.Success.archiveAdded',
    defaultMessage: 'Remote Archive Added',
  },
  canSyncOnInternet: {
    id: 'ProjectSettings.RemoteArchive.Success.canSyncOnInternet',
    defaultMessage:
      'All project devices can exchange with this Archive, sharing data over the internet.',
  },
  close: {
    id: '$1ProjectSettings.RemoteArchive.Success.close',
    defaultMessage: 'Close',
  },
});

export const SuccessfullyAddedArchive = ({
  route,
  navigation,
}: NativeRootNavigationProps<'SuccessfullyAddedArchive'>) => {
  const {formatMessage} = useIntl();
  const {archiveName, url} = route.params;
  return (
    <ScreenContentWithButtonDockNoHeader
      bottomButton={
        <SecondaryButton
          text={formatMessage(m.close)}
          onPress={() => {
            navigation.popTo('RemoteArchive');
          }}
          fullSize
        />
      }>
      <IconTitleDescription
        icon={<GreenCheck />}
        title={formatMessage(m.archiveAdded)}
        description={formatMessage(m.canSyncOnInternet)}
      />
      <HeaderText
        variant="header5"
        style={{marginTop: 40, textAlign: 'center'}}>
        {archiveName}
      </HeaderText>
      <BodyText
        variant="smallMeta"
        style={{color: MEDIUM_GREY, textAlign: 'center'}}>
        {url}
      </BodyText>
    </ScreenContentWithButtonDockNoHeader>
  );
};
