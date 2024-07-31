declare module 'react-native-scale-bar' {
  import type {Component} from 'react';

  type Props = {
    zoom: number;
    latitude: number;
    bottom: number;
    left: number;
  };

  class ScaleBar extends Component<Props> {}

  export default ScaleBar;
}
