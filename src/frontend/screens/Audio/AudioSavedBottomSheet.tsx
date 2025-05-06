import * as React from 'react';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import GreenCheck from '../../images/GreenCheck.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';

const m = defineMessages({
  title: {
    id: 'screens.AudioSavedBottomSheet.title',
    defaultMessage: 'Success!',
  },
  subTitle: {
    id: 'screens.AudioSavedBottomSheet.subTitle',
    defaultMessage: 'Your Audio Recording was added',
  },
  returnToEditor: {
    id: 'screens.AudioSavedBottomSheet.returnToEditor',
    defaultMessage: 'Return to Editor',
  },
  recordAnother: {
    id: 'screens.AudioSavedBottomSheet.recordAnother',
    defaultMessage: 'Record Another',
  },
});

export const AudioSavedBottomSheet = ({
  navigation,
}: NativeRootNavigationProps<'AudioSavedBottomSheet'>) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <GreenCheck />
          <HeaderText
            variant="header2"
            style={{marginTop: 20, textAlign: 'center'}}>
            {formatMessage(m.title)}
          </HeaderText>
          <BodyText style={{marginTop: 10, textAlign: 'center'}}>
            {formatMessage(m.subTitle)}
          </BodyText>
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          <SecondaryButton
            fullSize={true}
            text={formatMessage(m.returnToEditor)}
            onPress={() => {
              navigation.goBack();
            }}
          />

          <PrimaryButton
            fullSize={true}
            text={formatMessage(m.recordAnother)}
            onPress={() => navigation.replace('AudioRecording')}
            style={{marginTop: 20}}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
  },
});
