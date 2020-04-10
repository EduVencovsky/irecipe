import React, { useEffect, useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native-paper'

import SelectIngredients from '../SelectIngredients/index'
import { updateUserIngredients } from '../../services/ingredients'
import { UserContext } from '../../context/UserContext'

const MyIngredients = () => {
  const navigation = useNavigation()
  const { user, setUser } = useContext(UserContext)

  const onSave = (selectedIngredients) => {
    updateUserIngredients(user._id, selectedIngredients)
      .then((result) => {
        setUser((prev) => ({ ...prev, ingredients: result.data.ingredients }))
        navigation.goBack()
      })
      .catch((err) => console.log(err))
  }

  return <SelectIngredients {...{ ingredients: user.ingredients, onSave }} />
}

export default MyIngredients
