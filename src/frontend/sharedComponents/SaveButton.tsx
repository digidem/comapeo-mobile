import * as React from 'react';
import {View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
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
      <UIActivityIndicator size={30} />
    </View>
  ) : (
    <IconButton onPress={onPress} testID="saveButton">
      <SaveCheck />
    </IconButton>
  );
};
