import React, { useContext } from 'react'
import { StatusBar } from 'react-native'
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
import CreateRecipeScreen from './views/CreateRecipeScreen'
import MyAppliancesScreen from './views/MyAppliancesScreen'
import ConfigurationScreen from './views/ConfigurationScreen'
import MyRecipesIngredientsScreen from './views/MyRecipesIngredientsScreen'
import MyRecipesIngredientsQuantityScreen from './views/MyRecipesIngredientsQuantityScreen'
import MyRecipesAppliancesScreen from './views/MyRecipesAppliancesScreen'
import colors from './utils/colors'
import LanguageProvider, { LanguageContext } from './context/LanguageContext'

const AuthStack = createStackNavigator()

const AuthStacks = () => {
  const { t } = useContext(LanguageContext)
  return (
    <AuthStack.Navigator initialRouteName="tabs">
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="tabs"
        component={AuthTabs}
      />
      <AuthStack.Screen
        name="myrecipes"
        options={{ headerTitle: t('myrecipes') }}
        component={MyRecipesScreen}
      />
      <AuthStack.Screen
        name="createRecipe"
        options={{ headerTitle: t('createRecipe') }}
        component={CreateRecipeScreen}
      />
      <AuthStack.Screen
        name="myingredients"
        options={{ headerTitle: t('myingredients') }}
        component={MyIngredientsScreen}
      />
      <AuthStack.Screen
        name="myappliances"
        options={{ headerTitle: t('myappliances') }}
        component={MyAppliancesScreen}
      />
      <AuthStack.Screen
        name="configuration"
        options={{ headerTitle: t('configuration') }}
        component={ConfigurationScreen}
      />
      <AuthStack.Screen
        name="myRecipesIngredients"
        component={MyRecipesIngredientsScreen}
      />
      <AuthStack.Screen
        name="myRecipesIngredientsQuantity"
        component={MyRecipesIngredientsQuantityScreen}
      />
      <AuthStack.Screen
        name="myRecipesAppliances"
        component={MyRecipesAppliancesScreen}
      />
    </AuthStack.Navigator>
  )
}

const AuthTab = createMaterialBottomTabNavigator()

const AuthTabs = () => {
  const { t } = useContext(LanguageContext)

  return (
    <AuthTab.Navigator initialRouteName="Home" shifting>
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
            <MaterialCommunityIcon name="magnify" color={color} size={25} />
          ),
        }}
      />
      <AuthTab.Screen
        name="profile"
        component={ProfileScreen}
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

const MainStacks = () => {
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
          component={AuthStacks}
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

const CombinedTheme = {
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
    <NavigationContainer theme={CombinedTheme}>
      <LanguageProvider>
        <UserProvider>
          <AuthProvider>
            <SafeAreaProvider>
              <PaperProvider theme={CombinedTheme}>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor={colors.primary3}
                />
                <MainStacks />
              </PaperProvider>
            </SafeAreaProvider>
          </AuthProvider>
        </UserProvider>
      </LanguageProvider>
    </NavigationContainer>
  )
}

export default App
