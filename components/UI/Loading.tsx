import React from 'react'
import { ActivityIndicator } from 'react-native'

function Loading({color = 'black'}) {
  return (
     <ActivityIndicator color={color} />
  )
}

export default Loading