import {Platform} from 'react-native';

/**
 * Android chooses a font by its asset file name, iOS by the PostScript name
 * stored inside the file, so each weight is a separate family and `fontWeight`
 * does not map to anything now. Pick the font name type combo here instead
 *
 * https://docs.expo.dev/develop/user-interface/fonts/#use-google-fonts
 */
export const RUBIK = {
  400: Platform.select({ios: 'Rubik-Regular', default: 'Rubik_400Regular'}),
  500: Platform.select({ios: 'Rubik-Medium', default: 'Rubik_500Medium'}),
  700: Platform.select({ios: 'Rubik-Bold', default: 'Rubik_700Bold'}),
};
