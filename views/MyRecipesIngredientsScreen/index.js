import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

import SelectIngredients from '../SelectIngredients/index'

const MyRecipesIngredients = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { params = {} } = route || {}

  const onSave = (selectedIngredients) => {
    if (params.onSave && typeof params.onSave === 'function'){
      params.onSave(selectedIngredients)
    }
    navigation.goBack()
  }

  return (
    <SelectIngredients {...{ ingredients: params.ingredients || [], onSave }} />
  )
}

export default MyRecipesIngredients
