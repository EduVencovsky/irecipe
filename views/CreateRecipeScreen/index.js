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
import { useNavigation } from '@react-navigation/native'
import { useHeaderHeight } from '@react-navigation/stack'
import {
  useTheme,
  FAB,
  Divider,
  TextInput,
  HelperText,
  Button,
  Subheading,
  List,
} from 'react-native-paper'
import BottomSheet from 'reanimated-bottom-sheet'
import ImagePicker from 'react-native-image-picker'

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
}

const CreateRecipe = () => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()
  const bottomSheetRef = useRef()
  const navigation = useNavigation()
  const [index, setIndex] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [showCloseFab, setShowCloseFab] = useState(true)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [routes] = React.useState(Object.keys(tabs).map((x) => ({ key: x })))

  const [image, setImage] = useState(null)

  const headerHeight = useHeaderHeight()
  const screenHeight = useWindowDimensions().height

  const [ingredients, setIngredients] = useState([])
  const [appliances, setAppliances] = useState([])
  const [directions, setDirections] = useState([])

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

  const bottomSheetSnapTo = useCallback(
    (value) => {
      // Calling it twice fix bugs
      bottomSheetRef.current.snapTo(value)
      bottomSheetRef.current.snapTo(value)
    },
    [bottomSheetRef],
  )

  const onTabPress = ({ route }) => {
    Keyboard.dismiss()
    if (
      !isBottomSheetOpen ||
      route.key.toString() === Object.keys(tabs)[index].toString()
    ) {
      bottomSheetSnapTo(isBottomSheetOpen ? 1 : 2)
      setIsBottomSheetOpen(!isBottomSheetOpen)
    }
  }

  const onFlatListScroll = (e) => {
    setShowCloseFab(e.nativeEvent.contentOffset.y < 10)
  }

  const showImagePicker = () => {
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
  }

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
              return (
                <MyRecipesIngredientsList
                  {...{ ingredients, setIngredients, onFlatListScroll }}
                />
              )
            case 'appliances':
              return (
                <MyRecipesAppliancesList
                  {...{ appliances, setAppliances, onFlatListScroll }}
                />
              )
            default:
              return null
          }
        }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            onTabPress={onTabPress}
            getLabelText={({ route }) => t(tabs[route.key].title).toUpperCase()}
            pressColor={theme.colors.primary}
            labelStyle={{ color: theme.colors.primary }}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.background }}
          />
        )}
      />
      <FAB
        visible={!isSwiping && index !== 2}
        style={styles.fabRight}
        icon="magnify"
        color="#fff"
        onPress={navigateTo}
      />
      <FAB
        visible={!isSwiping && showCloseFab}
        style={styles.fabLeft}
        icon="arrow-collapse-down"
        color="#fff"
        onPress={() => {
          bottomSheetSnapTo(isBottomSheetOpen ? 1 : 2)
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
            {image ? (
              <>
                <Image style={styles.image} source={image} />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  <Button
                    style={{ width: '50%' }}
                    onPress={() => setImage(null)}
                    icon="delete">
                    {t('deleteImage')}
                  </Button>
                  <Button
                    style={{ width: '50%' }}
                    onPress={showImagePicker}
                    icon="camera">
                    {t('changeImage')}
                  </Button>
                </View>
              </>
            ) : (
              <Button onPress={showImagePicker} icon="camera">
                {t('selectImage')}
              </Button>
            )}
          </View>
          <View style={styles.sections}>
            <TextInput label={t('time')} keyboardType="decimal-pad" />
            <HelperText>{t('timeMinutes')}</HelperText>
          </View>

          <View style={styles.sections}>
            <TextInput label={t('description')} multiline />
          </View>

          <View style={styles.sections}>
            <List.Item
              title={t('directions')}
              onPress={() => navigation.navigate('myRecipesDirections')}
              description={`${directions.length} ${t('itemsSelected')}`}
              left={(props) => (
                <List.Icon {...props} icon="format-list-numbered" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomSheetHeaderDummy} />
      <BottomSheet
        initialSnap={1}
        onOpenEnd={() => setIsBottomSheetOpen(true)}
        onCloseEnd={() => setIsBottomSheetOpen(false)}
        enabledContentGestureInteraction={!isBottomSheetOpen}
        ref={bottomSheetRef}
        renderContent={renderContent}
        snapPoints={[0, 48, screenHeight - headerHeight]}
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
    height: 48,
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
