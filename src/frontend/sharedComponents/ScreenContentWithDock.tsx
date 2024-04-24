import {ReactNode, type PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../sharedTypes';

export const ScreenContentWithDock = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  dockContent,
}: PropsWithChildren<{
  dockContent: ReactNode;
  dockContainerStyle?: ViewStyleProp;
  contentContainerStyle?: ViewStyleProp;
}>) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollViewRoot}
        contentContainerStyle={[
          styles.scrollViewContentContainer,
          contentContainerStyle,
        ]}>
        {children}
      </ScrollView>
      <View style={[styles.dockedContentContainer, dockContainerStyle]}>
        {dockContent}
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
  },
});
