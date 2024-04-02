import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../Text'
import { TextStyleProp } from '../../sharedTypes'

interface ListItemTextProp {
  style?: TextStyleProp
  inset?: boolean
  primary: string | React.ReactNode
  secondary?: string | React.ReactNode
}

export const ListItemText = ({
  style,
  inset = false,
  primary,
  secondary,
  ...other
}: ListItemTextProp) => {
  return (
    <View
      style={[
        styles.root,
        inset && styles.inset,
        primary && secondary ? styles.multiline : undefined,
      ]}
      {...other}
    >
      <Text style={[styles.primary, style]}>{primary}</Text>
      {secondary && <Text style={styles.secondary}>{secondary}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  /* Styles applied to the root element. */
  root: {
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  /* Styles applied to the `Typography` components if primary and secondary are set. */
  multiline: {
    marginTop: 6,
    marginBottom: 6,
  },
  /* Styles applied to the root element if `inset={true}`. */
  inset: {
    paddingLeft: 56,
  },
  primary: {
    fontSize: 16,
    lineHeight: 1.5 * 16,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    fontSize: 14,
    lineHeight: 1.43 * 14,
    color: 'rgba(0, 0, 0, 0.54)',
  },
})
