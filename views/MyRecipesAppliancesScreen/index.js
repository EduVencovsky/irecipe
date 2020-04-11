import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

import SelectAppliances from '../SelectAppliances'

const MyRecipesAppliances = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { params = {} } = route || {}

  const onSave = (selectedAppliances) => {
    if (params.onSave && typeof params.onSave === 'function'){
      params.onSave(selectedAppliances)
    }
    navigation.goBack()
  }

  return (
    <SelectAppliances {...{ appliances: params.appliances || [], onSave }} />
  )
}

export default MyRecipesAppliances
