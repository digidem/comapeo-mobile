import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text } from '../Text'

interface ListProp {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  disablePadding?: boolean
  subheader?: string
  dense?: boolean
  testID?: string
}

export const List = ({
  children,
  style,
  disablePadding = false,
  subheader,
  dense = false,
  testID: testId,
  ...other
}: ListProp) => {
  const context = React.useMemo(() => ({ dense }), [dense])
  return (
    <View
      style={[styles.root, !disablePadding && styles.padding, style]}
      {...other}
      testID={testId}
    >
      {subheader && <Text style={styles.subheader}>{subheader}</Text>}
      {children}
    </View>
  )
}

export const styles = StyleSheet.create({
  /* Styles applied to the root element. */
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 0,
    padding: 0,
  },
  /* Styles applied to the root element if `disablePadding={false}`. */
  padding: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  /* Styles applied to the root element if a `subheader` is provided. */
  subheader: {
    paddingTop: 0,
  },
})
