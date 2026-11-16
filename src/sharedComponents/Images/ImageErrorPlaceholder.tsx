import {View} from 'react-native';

import {AlertIcon} from '../icons';
import {LIGHT_GREY} from '../../lib/styles';
import {useState} from 'react';

export function ImageErrorPlaceholder({
  aspectRatio = 1,
  testID,
}: {
  aspectRatio?: number;
  testID?: string;
}) {
  const [iconSize, setIconSize] = useState<number>(0);

  return (
    <View
      testID={testID}
      onLayout={event => {
        setIconSize(event.nativeEvent.layout.height / 3);
      }}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LIGHT_GREY,
        aspectRatio,
      }}>
      <AlertIcon size={iconSize} />
    </View>
  );
}
