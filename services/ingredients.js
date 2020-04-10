import axios from 'axios'

export const getIngredientsList = async (name, top = 10) => {
  return axios.get(
    `http://127.0.0.1:3000/api/ingredient/list?name=${name}&top=${top}`,
  )
}

export const getIngredientsById = async (_id) => {
  return axios.get(
    'http://127.0.0.1:3000/api/ingredient' + (_id ? `/${_id}` : ''),
  )
}

export const updateUserIngredients = async (userId, ingredients) => {
  return axios.put(`http://127.0.0.1:3000/api/user/ingredients/${userId}`, {
    ingredients,
  })
}
