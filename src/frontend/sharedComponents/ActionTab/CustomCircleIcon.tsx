import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import Plus from '../../images/redesign/Plus.svg';
import {BLUE_GREY} from '../../lib/styles';

interface CustomCircleIcon {
  icon: React.ReactNode;
}
export const CustomCircleIcon: FC<CustomCircleIcon> = ({icon}) => {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.plusContainer}>
        <Plus width={20} height={20} />
      </View>
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: BLUE_GREY,
    padding: 18,
    borderRadius: 80,
  },
  plusContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: 25,
    left: -10,
    zIndex: 5,
  },
});
