import React from 'react'
import { StyleSheet, View } from 'react-native'

import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { VERY_LIGHT_BLUE } from '../../lib/styles'
import { ViewStyleProp } from '../../sharedTypes'

interface ListItemProp {
  alignItems?: 'flex-start' | 'center'
  button?: boolean
  children: React.ReactNode
  style?: ViewStyleProp
  dense?: boolean
  disabled?: boolean
  disableGutters?: boolean
  divider?: boolean
  onPress?: () => void
  testID?: string
}

export const ListItem = ({
  alignItems = 'center',
  button = false,
  children,
  style,
  dense = false,
  disabled = false,
  disableGutters = false,
  divider = false,
  onPress,
  testID,
  ...otherProps
}: ListItemProp) => {
  const componentStyle = [
    styles.root,
    styles.dense,
    !disableGutters && styles.gutters,
    divider && styles.divider,
    alignItems === 'flex-start' && styles.alignItemsFlexStart,
    style,
  ]

  return (
    <TouchableNativeFeedback
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      {...otherProps}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}
    >
      <View style={componentStyle}>{children}</View>
    </TouchableNativeFeedback>
  )
}

interface ListDividerProp {
  color?: string
  lineWidth?: number
  style?: ViewStyleProp
}

export const ListDivider = ({
  color = '#CCCCD6',
  lineWidth = 1,
  style,
}: ListDividerProp) => {
  return (
    <ListItem
      disabled={true}
      button={false}
      onPress={() => {}}
      style={[
        {
          width: '100%',
          borderBottomWidth: lineWidth,
          borderBottomColor: color,
        },
        style,
      ]}
    >
      <React.Fragment />
    </ListItem>
  )
}

const styles = StyleSheet.create({
  /* Styles applied to the (normally root) `component` element. May be wrapped by a `container`. */
  root: {
    flex: 0,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    paddingTop: 8,
    paddingBottom: 8,
  },
  /* Styles applied to the `component` element if `alignItems="flex-start"`. */
  alignItemsFlexStart: {
    alignItems: 'flex-start',
  },
  /* Styles applied to the `component` element if dense. */
  dense: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  /* Styles applied to the inner `component` element if `divider={true}`. */
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
  },
  /* Styles applied to the inner `component` element if `disableGutters={false}`. */
  gutters: {
    paddingLeft: 16,
    paddingRight: 16,
  },
})
