import {TouchableHighlight, TouchableHighlightProps} from 'react-native';

export {Touchable, TouchableHighlight, TouchableOpacity} from 'react-native';

const TouchableNativeFeedback = (props: TouchableHighlightProps) => (
  <TouchableHighlight {...props} />
);

TouchableNativeFeedback.Ripple = () => {};

export {TouchableNativeFeedback};
