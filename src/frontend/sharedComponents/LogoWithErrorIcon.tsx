import {View} from 'react-native';
import CoMapeoLogo from '../images/CoMapeoLogo.svg';
import ErrorIcon from '../images/Error.svg';
import {ViewStyleProp} from '../sharedTypes';

export const LogoWithErrorIcon = ({style}: {style?: ViewStyleProp}) => {
  return (
    <View style={[{alignItems: 'center', position: 'relative'}, style]}>
      <CoMapeoLogo width={160} height={160} />
      <ErrorIcon
        width={50}
        height={50}
        style={{position: 'absolute', bottom: 0, right: 0}}
      />
    </View>
  );
};
