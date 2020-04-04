import AsyncStorage from '@react-native-community/async-storage'

export const getAccessToken = () =>
  AsyncStorage.getItem(ACCESS_TOKEN).then((res) => JSON.parse(res))

export const getIngredients = () =>
  AsyncStorage.getItem(INGREDIENTS_LIST).then((res) => JSON.parse(res))

export const ACCESS_TOKEN = '@access-token'

export const INGREDIENTS_LIST = '@ingredients-list'
