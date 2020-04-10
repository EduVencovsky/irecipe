import React, { useContext } from 'react'
import { Dimensions } from 'react-native'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import SelectIngredientsQuantity from '../SelectIngredientsQuantity'
import { useTheme } from 'react-native-paper'
import { LanguageContext } from '../../context/LanguageContext'

const initialLayout = { width: Dimensions.get('window').width }

const tabs = {
  ingredients: {
    icon: 'food-variant',
    title: 'ingredients',
    component: SelectIngredientsQuantity,
  },
  appliances: {
    icon: 'stove',
    title: 'appliances',
    component: SelectIngredientsQuantity,
  },
  description: {
    icon: 'book-open',
    title: 'description',
    component: SelectIngredientsQuantity,
  },
}

const CreateRecipe = () => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'ingredients', title: t('ingredients') },
    { key: 'appliances', title: t('appliances') },
    { key: 'description', title: t('description') },
  ])

  const renderScene = SceneMap({
    ingredients: SelectIngredientsQuantity,
    appliances: SelectIngredientsQuantity,
    description: SelectIngredientsQuantity,
  })

  return (
    <TabView
      renderTabBar={(props) => (
        <TabBar
          {...props}
          renderIcon={({ route, focused, color }) => (
            <MaterialCommunityIcon
              name={tabs[route.key].icon}
              color={theme.colors.primary}
              size={25}
            />
          )}
          renderLabel={() => {}}
          labelStyle={{ color: theme.colors.primary }}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          style={{
            backgroundColor: theme.colors.background,
          }}
        />
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  )
}

export default CreateRecipe
