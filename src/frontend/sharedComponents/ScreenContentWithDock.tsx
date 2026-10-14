import {ReactNode, type PropsWithChildren} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../sharedTypes';

// since we are not using the safe area bottom edge on iOS, adds a little clearance from
// the home indicator for buttons at the bottom of the screen
const DOCK_BOTTOM_SPACE = Platform.OS === 'ios' ? 5 : 0;

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
      <View style={{paddingBottom: DOCK_BOTTOM_SPACE}}>
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
    padding: 20,
    alignItems: 'center',
  },
});
