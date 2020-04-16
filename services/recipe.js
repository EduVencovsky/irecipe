import axios from 'axios'
import { ACCESS_TOKEN } from '../utils/storage'
import AsyncStorage from '@react-native-community/async-storage'

export const updateRecipe = async (values) => {
  const userToken = await AsyncStorage.getItem(ACCESS_TOKEN)

  return axios.post('http://127.0.0.1:3000/api/recipe', values, {
    headers: {
      Authorization: 'Bearer ' + userToken,
    },
  })
}

export const getMyRecipe = async () => {
  const userToken = await AsyncStorage.getItem(ACCESS_TOKEN)

  return axios.get('http://127.0.0.1:3000/api/recipe/myRecipe', {
    headers: {
      Authorization: 'Bearer ' + userToken,
    },
  })
}
