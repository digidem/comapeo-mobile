import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';

type ThumbnailContainerProps = {
  onPress: (() => void) | undefined;
  children: React.ReactNode;
  size: number;
};

export const ThumbnailContainer = ({
  onPress,
  children,
  size,
}: ThumbnailContainerProps) => {
  return (
    <TouchableOpacity
      style={[styles.thumbnailContainer, {width: size, height: size}]}
      disabled={!onPress}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export const ThumbnailLoader = ({size}: {size: number}) => {
  return (
    <ThumbnailContainer onPress={undefined} size={size}>
      <ActivityIndicator />
    </ThumbnailContainer>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
    overflow: 'hidden',
  },
});
