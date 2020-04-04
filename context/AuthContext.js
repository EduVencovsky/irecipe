import React, { useReducer, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import { UserContext } from './UserContext'
import { getAccessToken } from '../utils/storage'
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

  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    IsLoggedIn: true,
    userToken: null,
  })

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken
      try {
        userToken = await getAccessToken()
        let result = await validateAccessToken(userToken)

        console.log(result)
        // setUser()
      } catch (e) {
        // Restoring token failed
        // Display some error message
        console.log(e)
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo(
    () => ({
      ...state,
      signIn: async (data) => {
        signIn(data).then((res) => {
          console.log(res)
          // should get token here
          dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' })
        })
      },
      signUp: async (data) => {
        signUp(data).then((res) => {
          console.log(res)
          // should get token here
          dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' })
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
