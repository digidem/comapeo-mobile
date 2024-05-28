import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BottomSheetModal} from './BottomSheetModal';
import {Button} from './Button';

interface SuccessBottomSheet {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  handleOutlinedButton: () => void;
  outlinedButtonText: string;
  handleFillButton: () => void;
  fillButtonText: string;
}

export const SuccessBottomSheet: FC<SuccessBottomSheet> = props => {
  const {
    sheetRef,
    isOpen,
    icon,
    title,
    description,
    handleOutlinedButton,
    outlinedButtonText,
    handleFillButton,
    fillButtonText,
  } = props;

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen} fullHeight>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {icon}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            fullWidth
            onPress={handleOutlinedButton}
            variant="outlined"
            color="ComapeoBlue">
            {outlinedButtonText}
          </Button>
          <Button fullWidth onPress={handleFillButton}>
            {fillButtonText}
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 20,
    paddingTop: 80,
  },
  wrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: '100%',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
  },
  description: {fontSize: 16, marginTop: 40},
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
