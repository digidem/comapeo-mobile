import * as React from 'react';
import {View} from 'react-native';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {type SvgProps} from 'react-native-svg';
import {createStyles} from './sharedCreateNameStyles';

export function InfoRow({
  Icon,
  text,
}: {
  Icon: React.FC<SvgProps>;
  text: string;
}) {
  return (
    <View style={createStyles.infoRow}>
      <Icon width={20} height={26} style={createStyles.infoIcon} />
      <BodyText variant="smallMeta" style={createStyles.infoText}>
        {text}
      </BodyText>
    </View>
  );
}
