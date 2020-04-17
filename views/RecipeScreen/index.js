import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  useWindowDimensions,
  Keyboard,
  ScrollView,
  Image,
} from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  useTheme,
  FAB,
  Divider,
  TextInput,
  HelperText,
  Button,
  IconButton,
  List,
  Text,
} from 'react-native-paper'
import BottomSheet from 'reanimated-bottom-sheet'
import ImagePicker from 'react-native-image-picker'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import IngredientsList from '../IngredientsListScreen'
import AppliancesList from '../AppliancesListScreen'
import DirectionsList from '../DirectionsListScreen'
import { LanguageContext } from '../../context/LanguageContext'
import { getRecipe } from '../../services/recipe'

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
  directions: {
    icon: 'book-open',
    title: 'directions',
    selectScreen: 'myRecipesAppliances',
  },
}

const CreateRecipe = () => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()
  const navigationRoute = useRoute()
  const { params = {} } = navigationRoute
  const bottomSheetRef = useRef()
  const navigation = useNavigation()
  const [recipe, setRecipe] = useState({})
  const [index, setIndex] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [showCloseFab, setShowCloseFab] = useState(true)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [routes] = React.useState(Object.keys(tabs).map((x) => ({ key: x })))

  const [image, setImage] = useState(null)

  const screenHeight = useWindowDimensions().height

  const { ingredients, appliances, directions } = recipe || {}

  useEffect(() => {
    if (params._id) {
      getRecipe(params._id)
        .then((res) => setRecipe(res.data))
        .catch((res) => console.log(res.data))
    }
  }, [params._id])

  const bottomSheetSnapTo = useCallback(
    (value) => {
      // Calling it twice fix bugs
      bottomSheetRef.current.snapTo(value)
      bottomSheetRef.current.snapTo(value)
    },
    [bottomSheetRef],
  )

  const onTabPress = useCallback(
    ({ route }) => {
      Keyboard.dismiss()
      if (
        !isBottomSheetOpen ||
        route.key.toString() === Object.keys(tabs)[index].toString()
      ) {
        bottomSheetSnapTo(isBottomSheetOpen ? 0 : 1)
        setIsBottomSheetOpen(!isBottomSheetOpen)
      }
    },
    [isBottomSheetOpen, bottomSheetSnapTo, index],
  )

  const onFlatListScroll = useCallback((e) => {
    setShowCloseFab(e.nativeEvent.contentOffset.y < 10)
  }, [])

  const showImagePicker = useCallback(() => {
    ImagePicker.showImagePicker((response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        const source = { uri: response.uri }
        // const source = { uri: 'data:image/jpeg;base64,' + response.data }
        setImage(source)
      }
    })
  }, [])

  const renderContent = () => (
    <View
      style={[
        styles.bottomSheetContent,
        { backgroundColor: theme.colors.background },
      ]}>
      <Divider />
      <TabView
        onSwipeEnd={() => setIsSwiping(false)}
        onSwipeStart={() => setIsSwiping(true)}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'ingredients':
              return <IngredientsList {...{ ingredients, onFlatListScroll }} />
            case 'appliances':
              return <AppliancesList {...{ appliances, onFlatListScroll }} />
            case 'directions':
              return <DirectionsList {...{ directions, onFlatListScroll }} />
            default:
              return null
          }
        }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            onTabPress={onTabPress}
            renderIcon={({ route }) => (
              <MaterialCommunityIcon
                size={20}
                name={tabs[route.key].icon}
                color={theme.colors.primary}
              />
            )}
            pressColor={theme.colors.primary}
            labelStyle={{ color: theme.colors.primary }}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.background }}
          />
        )}
      />
      <FAB
        visible={!isSwiping && showCloseFab}
        style={styles.fabRight}
        icon="arrow-collapse-down"
        color="#fff"
        onPress={() => {
          bottomSheetSnapTo(isBottomSheetOpen ? 0 : 1)
          setIsBottomSheetOpen(!isBottomSheetOpen)
        }}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.sections}>
            <Text>{JSON.stringify(recipe, null, 2)}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomSheetHeaderDummy} />
      <BottomSheet
        initialSnap={0}
        onOpenEnd={() => setIsBottomSheetOpen(true)}
        onCloseEnd={() => setIsBottomSheetOpen(false)}
        enabledContentGestureInteraction={!isBottomSheetOpen}
        ref={bottomSheetRef}
        renderContent={renderContent}
        snapPoints={[48, screenHeight]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    margin: 20,
  },
  bottomSheetContent: {
    height: '100%',
    width: '100%',
  },
  fabRight: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fabLeft: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
  },
  bottomSheetHeaderDummy: {
    height: 56,
    width: '100%',
  },
  image: {
    height: 200,
    width: '100%',
  },
  sections: {
    marginVertical: 5,
  },
})

export default CreateRecipe
