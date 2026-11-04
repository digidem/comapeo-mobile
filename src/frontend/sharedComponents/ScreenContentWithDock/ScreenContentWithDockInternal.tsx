import {ReactNode} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {ViewStyleProp} from '../../sharedTypes';
import {WHITE} from '../../lib/styles';

export type SharedScreenContentProps = {
  children: ReactNode;
  dockContent: ReactNode;
  dockContainerStyle?: ViewStyleProp;
  contentContainerStyle?: ViewStyleProp;
  testID?: string;
  backgroundColor?: string;
};

/**
 *
 * DO NOT USE. Used for internal purposes. Use ScreenContentWithDock or
 */
export const ScreenContentWithDockInternal = ({
  children,
  contentContainerStyle,
  dockContainerStyle,
  dockContent,
  backgroundColor = WHITE,
  testID,
}: SharedScreenContentProps) => {
  return (
    <View style={{backgroundColor, flex: 1}} testID={testID}>
      <ScrollView
        bounces={false}
        style={styles.scrollViewRoot}
        contentContainerStyle={[contentContainerStyle]}>
        {children}
      </ScrollView>
      <View style={[styles.dockedContentContainer, dockContainerStyle]}>
        {dockContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewRoot: {flex: 1},
  dockedContentContainer: {
    flex: 0,
    alignItems: 'center',
  },
});
