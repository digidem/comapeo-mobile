import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {BLACK, LIGHT_GREY, WHITE} from '../../lib/styles';

import {ErrorBottomSheet} from '../ErrorBottomSheet';
import {Text} from '../Text';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Photo} from '../../contexts/PhotoPromiseContext/types';
import {DescriptionField} from './DescriptionField';
import {ActionButtons} from './ActionButtons';

type EditScreenProps = {
  presetName: string;
  onPressPreset?: () => void;
  PresetIcon: React.ReactNode;
  showAudio?: boolean;
  error: Error | null;
  clearError: () => void;
  notes: string;
  updateNotes: (newNotes: string) => void;
  photos: (Partial<Photo> | undefined)[];
  audioRecordings: any[];
};

export const EditScreen = ({
  presetName,
  onPressPreset,
  PresetIcon,
  showAudio,
  error,
  clearError,
  notes,
  updateNotes,
}: EditScreenProps) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          disabled={!onPressPreset}
          onPress={onPressPreset}
          style={styles.presetAndLocation}>
          {PresetIcon}
          <Text style={styles.categoryName}>{presetName}</Text>
        </TouchableOpacity>
        <DescriptionField notes={notes} updateNotes={updateNotes} />
      </ScrollView>
      {/* <MediaScrollView photos={photos} audioRecordings={audioRecordings} /> */}
      <ActionButtons showAudio={!!showAudio} />
      <ErrorBottomSheet error={error} clearError={clearError} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  presetAndLocation: {
    margin: 20,
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
  categoryName: {
    color: BLACK,
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    flex: 1,
  },
});
