declare module '*.svg' {
  import {type FC} from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: FC<SvgProps>;
  export default content;
}
