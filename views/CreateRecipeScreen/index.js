import React, { useEffect, useContext, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { useTheme, FAB } from 'react-native-paper'

import { LanguageContext } from '../../context/LanguageContext'
import MyRecipesIngredientsList from '../MyRecipesIngredientsListScreen'
import MyRecipesAppliancesList from '../MyRecipesAppliancesListScreen'

const initialLayout = { width: Dimensions.get('window').width }

const tabs = {
  ingredients: {
    icon: 'food-variant',
    title: 'ingredients',
    selectScreen: 'myRecipesIngredients',
  },
  appliances: {
    icon: 'stove',
    title: 'appliances',
    selectScreen: 'myRecipesAppliances',
  },
  description: {
    icon: 'book-open',
    title: 'description',
  },
}

const CreateRecipe = () => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()
  const navigation = useNavigation()
  const [index, setIndex] = useState(0)
  const [isSwiping, setIsSwiping] = React.useState(false)
  const [routes] = React.useState(Object.keys(tabs).map((x) => ({ key: x })))

  const [ingredients, setIngredients] = useState([])
  const [appliances, setAppliances] = useState([])

  const onSave = (selectedItem) => {
    const setState = index === 0 ? setIngredients : setAppliances
    setState(selectedItem)
  }

  const navigateTo = () => {
    const screen = Object.values(tabs)[index].selectScreen
    const data = index === 0 ? { ingredients } : { appliances }
    navigation.navigate(screen, {
      onSave,
      ...data,
    })
  }

  console.log('ingredients', ingredients)
  console.log('appliances', appliances)

  return (
    <>
      <TabView
        onSwipeEnd={() => setIsSwiping(false)}
        onSwipeStart={() => setIsSwiping(true)}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'ingredients':
              return (
                <MyRecipesIngredientsList
                  {...{ ingredients, setIngredients }}
                />
              )
            case 'appliances':
              return (
                <MyRecipesAppliancesList {...{ appliances, setAppliances }} />
              )
            default:
              return null
          }
        }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={() => {}}
            pressColor={theme.colors.primary}
            labelStyle={{ color: theme.colors.primary }}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.background }}
            renderIcon={({ route, focused, color }) => (
              <MaterialCommunityIcon
                name={tabs[route.key].icon}
                color={theme.colors.primary}
                size={25}
              />
            )}
          />
        )}
      />
      <FAB
        visible={!isSwiping && index !== 2}
        style={styles.fab}
        icon="magnify"
        color="#fff"
        onPress={navigateTo}
      />
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default CreateRecipe
