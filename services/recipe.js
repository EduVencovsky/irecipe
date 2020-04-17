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

export const getMyRecipes = async () => {
  const userToken = await AsyncStorage.getItem(ACCESS_TOKEN)

  return axios.get('http://127.0.0.1:3000/api/recipe/myRecipe', {
    headers: {
      Authorization: 'Bearer ' + userToken,
    },
  })
}

export const getRecipe = async (_id) => {
  const userToken = await AsyncStorage.getItem(ACCESS_TOKEN)

  return axios.get(`http://127.0.0.1:3000/api/recipe/fullData/${_id}`, {
    headers: {
      Authorization: 'Bearer ' + userToken,
    },
  })
}

export const getRecipes = async (_id) => {
  const userToken = await AsyncStorage.getItem(ACCESS_TOKEN)

  return axios.get('http://127.0.0.1:3000/api/recipe', {
    headers: {
      Authorization: 'Bearer ' + userToken,
    },
  })
}
