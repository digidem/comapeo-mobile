import React from 'react';
import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {styles} from './styles';
import {BLACK, NEW_DARK_GREY} from '../../lib/styles';

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
        <HeaderText variant="header5" style={{color: BLACK}}>
          {title}
        </HeaderText>
      </View>
      <BodyText variant="smallMeta" style={{color: NEW_DARK_GREY}}>
        {description}
      </BodyText>
    </View>
  );
};
