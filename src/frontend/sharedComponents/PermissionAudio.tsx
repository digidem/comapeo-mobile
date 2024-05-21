import React, {FC} from 'react';
import {BottomSheetModal} from './BottomSheetModal';
import {View, Text} from 'react-native';
import {DARK_ORANGE, BLACK, COMAPEO_BLUE, WHITE} from '../lib/styles';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Button} from './Button';
import Audio from '../images/observationEdit/Audio.svg';

interface PermissionAudio {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  closeSheet: () => void;
  isOpen: boolean;
}
export const PermissionAudio: FC<PermissionAudio> = ({
  sheetRef,
  closeSheet,
  isOpen,
}) => {
  return (
    <BottomSheetModal
      ref={sheetRef}
      fullHeight
      onDismiss={closeSheet}
      isOpen={isOpen}>
      <View
        style={{
          height: '100%',
          justifyContent: 'space-between',
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Audio
            //@ts-expect-error
            style={{color: DARK_ORANGE}}
            fill={DARK_ORANGE}
            width={35}
            height={47.5}
          />
          <Text
            style={{
              color: BLACK,
              fontSize: 24,
              fontWeight: 'bold',
              alignSelf: 'center',
              width: '65%',
              textAlign: 'center',
              marginTop: 20,
            }}>
            Recording Audio with CoMapeo
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: BLACK,
              alignSelf: 'center',
              marginTop: 40,
              textAlign: 'center',
              padding: 40,
            }}>
            To record audio while using the app and in the background CoMapeo
            needs to access your microphone.
          </Text>
        </View>
        <View style={{gap: 20, paddingHorizontal: 40, marginBottom: 20}}>
          <Button onPress={() => {}} variant="outlined" fullWidth>
            <Text
              style={{fontWeight: '600', fontSize: 16, color: COMAPEO_BLUE}}>
              Not Now
            </Text>
          </Button>
          <Button onPress={() => {}} fullWidth>
            <Text style={{fontWeight: '600', fontSize: 16, color: WHITE}}>
              Allow
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  );
};
