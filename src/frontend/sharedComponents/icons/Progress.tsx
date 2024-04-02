import React from 'react'
import { Circle, CircleSnail } from 'react-native-progress'

type Props = {
  size: number
  color?: string
  progress?: number
}

export const Progress = ({ size, color, progress }: Props) =>
  progress !== undefined && progress < 1 ? (
    <Circle
      size={size}
      progress={progress}
      color={color}
      strokeCap="butt"
      direction="clockwise"
      borderWidth={0}
      thickness={3}
    />
  ) : (
    <CircleSnail
      size={size + 6}
      color={color}
      strokeCap="round"
      direction="clockwise"
    />
  )
