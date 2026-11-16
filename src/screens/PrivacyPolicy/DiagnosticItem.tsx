import React from 'react';
import {View, Text} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {styles} from './styles';
import {NEW_DARK_GREY} from '../../lib/styles';

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
      <HeaderText variant="header6" style={{color: NEW_DARK_GREY}}>
        {title}:{' '}
        <Text style={styles.diagnosticsDescription}>{description}</Text>
      </HeaderText>
    </View>
  );
};
