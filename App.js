import React, { useContext } from 'react'
import {
  Text
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import {
  useTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import 'react-native-gesture-handler'

import UserProvider from './context/UserContext'
import AuthProvider, { AuthContext } from './context/AuthContext'
import SplashScreen from './views/SplashScreen'
import SignUpScreen from './views/SignUpScreen'
import SignInScreen from './views/SignInScreen'
import HomeScreen from './views/HomeScreen'
import ProfileScreen from './views/ProfileScreen'
import MyIngredientsScreen from './views/MyIngredientsScreen'
import MyRecipesScreen from './views/MyRecipesScreen'
import MyAppliancesScreen from './views/MyAppliancesScreen'
import ConfigurationScreen from './views/ConfigurationScreen'
import colors from './utils/colors'
import LanguageProvider, { LanguageContext } from './context/LanguageContext'

const ProfileStack = createStackNavigator()

const ProfileStacks = () => {
  const { t } = useContext(LanguageContext)
  return (
    <ProfileStack.Navigator initialRouteName="profileoptions">
      <ProfileStack.Screen
        options={{ headerShown: false }}
        name="profileOptions"
        component={ProfileScreen}
      />
      <ProfileStack.Screen
        name="myrecipes"
        options={{ headerTitle: t('myrecipes'), tabBarVisible: false }}
        component={MyRecipesScreen}
      />
      <ProfileStack.Screen
        name="myingredients"
        options={{ headerTitle: t('myingredients') }}
        component={MyIngredientsScreen}
      />
      <ProfileStack.Screen
        name="myappliances"
        options={{ headerTitle: t('myappliances') }}
        component={MyAppliancesScreen}
      />
      <ProfileStack.Screen
        name="configuration"
        options={{ headerTitle: t('configuration') }}
        component={ConfigurationScreen}
      />
    </ProfileStack.Navigator>
  )
}

const AuthTab = createMaterialBottomTabNavigator()

const AuthTabs = () => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()
  return (
    <AuthTab.Navigator 
    initialRouteName="Home"
      // activeColor={theme.colors.accent}
      shifting>
      <AuthTab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcon
              name={`home${!focused ? '-outline' : ''}`}
              color={color}
              size={25}
            />
          ),
        }}
      />
      <AuthTab.Screen
        name="search"
        component={HomeScreen}
        options={{
          tabBarLabel: t('search'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcon
              name="magnify"
              color={color}
              size={25}
            />
          ),
        }}
      />
      <AuthTab.Screen
        name="profile"
        component={ProfileStacks}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcon
              name={`account${!focused ? '-outline' : ''}`}
              color={color}
              size={25}
            />
          ),
        }}
      />
    </AuthTab.Navigator>
  )
}

const MainStack = createStackNavigator()

const Main = () => {
  const { isLoading, userToken } = useContext(AuthContext)

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <MainStack.Navigator>
      {userToken != null ? (
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={AuthTabs}
        />
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
    <LanguageProvider>
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
    </LanguageProvider>
  )
}

export default App
