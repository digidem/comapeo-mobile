import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import {useDraftObservation} from '../../hooks/useDraftObservation';

export const DummyScreen = (
  prop: NativeHomeTabsNavigationProps<'Map' | 'Camera'>,
) => {
  const {sheetRef, closeSheet, openSheet, isOpen} = useBottomSheetModal({
    openOnMount: false,
  });
  const {newDraft} = useDraftObservation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test screen</Text>
      <Button
        onPress={() => {
          newDraft();
          prop.navigation.navigate('ObservationList');
        }}
        title="List Observations"
      />
      <View style={{marginTop: 8}} />
      <Button
        onPress={() => {
          openSheet();
        }}
        title="Open Modal"
      />
      <View style={{marginTop: 8}} />
      <Button
        onPress={() => {
          newDraft();
          prop.navigation.navigate('CategoryChooser');
        }}
        title="New Observation"
      />
      <BottomSheetModal disableBackrop={false} isOpen={isOpen} ref={sheetRef}>
        <BottomSheetContent
          title={'Example'}
          description={'This is an example bottomsheet'}
          buttonConfigs={[
            {
              text: 'close',
              onPress: () => {
                closeSheet();
              },
              variation: 'outlined',
            },
          ]}
        />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '900',
    fontSize: 32,
    textAlign: 'center',
  },
});
