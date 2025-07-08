import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {SyncIcon} from '../../sharedComponents/icons';
import OrangeStar from '../../images/OrangeStar.svg';
import GreyLeaf from '../../images/GreyLeaf.svg';

export const DevicesAvailableHeader = ({
  iconColor,
  overlayType,
  showOverlay,
}: {
  iconColor: string;
  overlayType: 'star' | 'leaf';
  showOverlay: boolean;
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.circle, {borderColor: iconColor}]}>
        <SyncIcon size={28} color={iconColor} />
      </View>
      {showOverlay ? (
        overlayType === 'star' ? (
          <OrangeStar width={30} height={30} style={styles.overlay} />
        ) : (
          <GreyLeaf width={30} height={30} style={styles.overlay} />
        )
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderWidth: 6,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
