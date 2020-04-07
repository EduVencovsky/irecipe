import React, { useReducer, useEffect, useContext } from 'react'
import { useAsyncStorage } from '@react-native-community/async-storage'

import { UserContext } from './UserContext'
import { ACCESS_TOKEN } from '../utils/storage'
import { signUp, signIn, validateAccessToken } from '../services/authService'

export const AuthContext = React.createContext()

const authReducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      }
    case 'SIGN_IN':
      return {
        ...prevState,
        IsLoggedIn: true,
        userToken: action.token,
      }
    case 'SIGN_OUT':
      return {
        ...prevState,
        IsLoggedIn: false,
        userToken: null,
      }
  }
}

const AuthProvider = ({ children }) => {
  const { setUser } = useContext(UserContext)
  const { getItem, setItem } = useAsyncStorage(ACCESS_TOKEN)
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    IsLoggedIn: true,
    userToken: null,
  })

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken
      try {
        userToken = await getItem()
        let result = await validateAccessToken(userToken)
        let user = result.data.user
        console.log('user', user)
        setUser(user)
      } catch (e) {
        // Restoring token failed
        // Display some error message
        console.log('validate error', e)
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [setUser])

  const authContext = React.useMemo(
    () => ({
      ...state,
      signIn: async (data) => {
        return signIn(data).then((res) => {
          let token = res.data.token
          console.log(token)
          // should get token here
          setItem(token)
          dispatch({ type: 'SIGN_IN', token })
        })
      },
      signUp: async (data) => {
        return signUp(data).then((res) => {
          let token = res.data.token
          console.log(token)
          // should get token here
          setItem(token)
          dispatch({ type: 'SIGN_IN', token })
        })
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    [state],
  )

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
