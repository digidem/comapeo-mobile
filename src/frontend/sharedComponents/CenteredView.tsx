import * as React from 'react'
import { View, StyleSheet } from 'react-native'

/**
 * Layout component to fill screen with centered children/text
 */
export const CenteredView = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>{children}</View>
)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
})
