import * as React from 'react';
import {View} from 'react-native';
import {LoadingIndicator} from './LoadingIndicator';
import {IconButton} from './IconButton';
import SaveCheck from '../images/CheckMark.svg';
export const SaveButton = ({
  onPress,
  isLoading,
}: {
  onPress: () => void;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <View style={{marginRight: 10}}>
      <LoadingIndicator size="large" />
    </View>
  ) : (
    <IconButton onPress={onPress} testID="OBS.edit-save-btn">
      <SaveCheck />
    </IconButton>
  );
};
