import React from 'react'
import { SettingsIcon } from '../../sharedComponents/icons'

import { IconButton } from '../../sharedComponents/IconButton'
import { useNavigationFromRoot } from '../../hooks/useNavigationWithTypes'

export const SettingsButton = () => {
  const { navigate } = useNavigationFromRoot()
  return (
    <IconButton onPress={() => navigate('Settings')} testID="settingsButton">
      <SettingsIcon color="rgba(0, 0, 0, 0.54)" />
    </IconButton>
  )
}
