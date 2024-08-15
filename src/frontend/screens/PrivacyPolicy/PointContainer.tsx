import React from 'react';
import {View, Text} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {styles} from './styles';

interface PointContainerProps {
  icon: React.FC<SvgProps>;
  title: string;
  description: string;
}

export const PointContainer: React.FC<PointContainerProps> = ({
  icon: IconComponent,
  title,
  description,
}) => {
  return (
    <View style={styles.pointContainer}>
      <View style={styles.pointHeader}>
        <IconComponent width={16} height={16} />
        <Text style={styles.pointTitle}>{title}</Text>
      </View>
      <Text style={styles.pointDescription}>{description}</Text>
    </View>
  );
};
