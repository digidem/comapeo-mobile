import React from 'react';
import {View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {styles} from './styles';
import {NEW_DARK_GREY} from '../../../lib/styles';

interface DiagnosticItemProps {
  title: string;
  description: string;
}

export const DiagnosticItem: React.FC<DiagnosticItemProps> = ({
  title,
  description,
}) => {
  return (
    <View style={styles.diagnosticsItem}>
      <MaterialIcons
        name="circle"
        size={4}
        color={NEW_DARK_GREY}
        style={styles.bulletIcon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.boldText}>
          {title}:{' '}
          <Text style={styles.diagnosticsDescription}>{description}</Text>
        </Text>
      </View>
    </View>
  );
};
