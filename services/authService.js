import axios from 'axios'
import { getAccessToken } from '../utils/storage'

export const signUp = async (values) =>
  axios.post('http://127.0.0.1:3000/api/user', values)

export const validateAccessToken = async (accessToken) =>
  axios.post(
    'http://127.0.0.1:3000/auth/validate',
    {},
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    },
  )

export const signIn = async (values) =>
  axios.post('http://127.0.0.1:3000/auth/signin', values)
