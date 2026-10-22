import {ReactNode, type PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../sharedTypes';
import {useCustomSafeAreaInsets} from '../hooks/useCustomSafeAreaInsets';

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
  const {bottom} = useCustomSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingBottom: bottom}]} testID={testID}>
      <ScrollView
        bounces={false}
        style={styles.scrollViewRoot}
        contentContainerStyle={contentContainerStyle}>
        {children}
      </ScrollView>
      <View style={[styles.dockedContentContainer, dockContainerStyle]}>
        {dockContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  scrollViewRoot: {flex: 1},
  dockedContentContainer: {
    flex: 0,
    alignItems: 'center',
  },
});
