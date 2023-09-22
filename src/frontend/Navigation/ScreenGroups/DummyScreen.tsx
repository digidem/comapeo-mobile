import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NativeHomeTabsNavigationProps} from '../../sharedTypes';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';

export const DummyScreen = (
  prop: NativeHomeTabsNavigationProps<'Map' | 'Camera'>,
) => {
  const {sheetRef, closeSheet, openSheet, isOpen} = useBottomSheetModal({
    openOnMount: false,
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test screen</Text>
      <Button
        onPress={() => {
          prop.navigation.navigate('ObservationEdit');
        }}
        title="Observation Edit"
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
          prop.navigation.navigate('Settings');
        }}
        title="Settings"
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
