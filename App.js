import React, { useContext } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper'

import 'react-native-gesture-handler'

import UserProvider from './context/UserContext'
import AuthProvider, { AuthContext } from './context/AuthContext'
import SplashScreen from './views/SplashScreen'
import SignUpScreen from './views/SignUpScreen'
import SignInScreen from './views/SignInScreen'
import HomeScreen from './views/HomeScreen'
import colors from './utils/colors'

const LoggedInTab = createMaterialBottomTabNavigator()

const LoggedIn = () => {
  return (
    <LoggedInTab.Navigator>
      <LoggedInTab.Screen name="Home" component={HomeScreen} />
      <LoggedInTab.Screen name="Other Home" component={HomeScreen} />
    </LoggedInTab.Navigator>
  )
}

const MainStack = createStackNavigator()

const Main = () => {
  const { isLoading, IsLoggedIn, userToken } = useContext(AuthContext)

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <MainStack.Navigator>
      {userToken != null ? (
        <MainStack.Screen name="Home" component={LoggedIn} />
      ) : (
        <>
          <MainStack.Screen
            name="SignInScreen"
            options={{ headerShown: false }}
            component={SignInScreen}
          />
          <MainStack.Screen name="SignUpScreen" component={SignUpScreen} />
        </>
      )}
    </MainStack.Navigator>
  )
}

const CombinedDarkTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.secondary2,
    surface: colors.secondary2,
    text: colors.primary,
    // disabled: colors.primary,
    placeholder: colors.primary,
    backdrop: colors.secondary2,
    card: colors.secondary2,
  },
  roundness: 0,
}

const App = () => {
  return (
    <UserProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <PaperProvider theme={CombinedDarkTheme}>
            <NavigationContainer theme={CombinedDarkTheme}>
              <Main />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </UserProvider>
  )
}

export default App
