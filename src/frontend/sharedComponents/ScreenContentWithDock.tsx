import {ReactNode, type PropsWithChildren} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../sharedTypes';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DOCK_PADDING = 20;

export const ScreenContentWithDock = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  dockContent,
  testID,
}: PropsWithChildren<{
  dockContent: ReactNode;
  dockContainerStyle?: ViewStyleProp;
  contentContainerStyle?: ViewStyleProp;
  testID?: string;
}>) => {
  // Since we are not using the safe area bottom edge on iOS, this is so that buttons at the
  // bottom are above the home indicator when it is needed
  const {bottom} = useSafeAreaInsets();
  const dockBottomSpace =
    Platform.OS === 'ios' ? Math.max(bottom - DOCK_PADDING, 0) : 0;
  return (
    <View style={styles.container} testID={testID}>
      <ScrollView
        bounces={false}
        style={styles.scrollViewRoot}
        contentContainerStyle={[
          styles.scrollViewContentContainer,
          contentContainerStyle,
        ]}>
        {children}
      </ScrollView>
      <View style={{paddingBottom: dockBottomSpace}}>
        <View style={[styles.dockedContentContainer, dockContainerStyle]}>
          {dockContent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollViewRoot: {flex: 1},
  scrollViewContentContainer: {
    padding: 20,
  },
  dockedContentContainer: {
    flex: 0,
    padding: DOCK_PADDING,
    alignItems: 'center',
  },
});
