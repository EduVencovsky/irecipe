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
} from 'react-native-paper'
import BottomSheet from 'reanimated-bottom-sheet'
import ImagePicker from 'react-native-image-picker'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import MyRecipesIngredientsList from '../MyRecipesIngredientsListScreen'
import MyRecipesAppliancesList from '../MyRecipesAppliancesListScreen'
import { LanguageContext } from '../../context/LanguageContext'
import { updateRecipe, getRecipe } from '../../services/recipe'

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
  const route = useRoute()
  const { params = {} } = route
  const bottomSheetRef = useRef()
  const navigation = useNavigation()
  const [initialValues, setInitialValues] = useState({
    ingredients: [],
    appliances: [],
    directions: [],
    time: '',
    description: '',
    name: '',
  })
  const [index, setIndex] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [showCloseFab, setShowCloseFab] = useState(true)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [routes] = React.useState(Object.keys(tabs).map((x) => ({ key: x })))

  const [image, setImage] = useState(null)

  const screenHeight = useWindowDimensions().height

  useEffect(() => {
    if (params._id) {
      getRecipe(params._id)
        .then((res) => {
          console.log(JSON.stringify(res.data, null, 2))
          setInitialValues(res.data)
        })
        .catch((res) => console.log(res.data))
    }
  }, [params._id])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validateOnChange: false,
    onSubmit: (values) =>
      updateRecipe(values)
        .then(() => navigation.goBack())
        .catch((res) => alert(res.data)),
    validationSchema: Yup.object().shape({
      time: Yup.string().required(),
      description: Yup.string().required(),
      name: Yup.string().required(),
      directions: Yup.array().min(1, 'should select one appliance'),
      appliances: Yup.array().min(1, 'should select one appliance'),
      ingredients: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required(),
            quantity: Yup.number().required(),
          }),
        )
        .required('should select one ingredient'),
    }),
  })

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
  } = formik

  const ingredients = values.ingredients
  const appliances = values.appliances
  const directions = values.directions

  const setIngredients = useCallback(
    (value) => setFieldValue('ingredients', value),
    [setFieldValue],
  )
  const setAppliances = useCallback(
    (value) => setFieldValue('appliances', value),
    [setFieldValue],
  )
  const setDirections = useCallback(
    (value) => setFieldValue('directions', value),
    [setFieldValue],
  )

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton icon="check" onPress={handleSubmit} />,
    })
  }, [navigation, handleSubmit])

  const onSave = useCallback(
    (selectedItem) => {
      const setState = index === 0 ? setIngredients : setAppliances
      setState(selectedItem)
    },
    [setIngredients, setAppliances, index],
  )

  const navigateTo = useCallback(() => {
    const screen = Object.values(tabs)[index].selectScreen
    const data = index === 0 ? { ingredients } : { appliances }
    navigation.navigate(screen, {
      onSave,
      ...data,
    })
  }, [index, ingredients, appliances, navigation, onSave])

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

  const saveDirections = useCallback(
    (newDirections) => {
      setDirections(newDirections.map((x, i) => ({ ...x, order: i })))
    },
    [setDirections],
  )

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
        visible={!isSwiping}
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
          {/* <View style={styles.sections}>
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
          </View> */}

          <View style={styles.sections}>
            <TextInput
              value={values.name}
              onChangeText={(text) => setFieldValue('name', text)}
              onBlur={() => setFieldTouched('name')}
              label={t('name')}
              error={errors.name && touched.name}
            />
            {errors.name && touched.name ? (
              <HelperText type="error">{errors.name}</HelperText>
            ) : null}
          </View>

          <View style={styles.sections}>
            <TextInput
              value={values.description}
              onChangeText={(text) => setFieldValue('description', text)}
              onBlur={() => setFieldTouched('description')}
              label={t('description')}
              multiline
              error={errors.description && touched.description}
            />
            {errors.description && touched.description ? (
              <HelperText type="error">{errors.description}</HelperText>
            ) : null}
          </View>

          <View style={styles.sections}>
            <TextInput
              value={values.time.toString()}
              onChangeText={(text) => setFieldValue('time', text)}
              onBlur={() => setFieldTouched('time')}
              label={t('preparationTime')}
              keyboardType="decimal-pad"
              error={errors.time && touched.time}
            />
            {errors.time && touched.time ? (
              <HelperText type="error">{errors.time}</HelperText>
            ) : (
              <HelperText>{t('timeMinutes')}</HelperText>
            )}
          </View>

          <View style={styles.sections}>
            <List.Item
              title={t('directions')}
              onPress={() =>
                navigation.navigate('myRecipesDirections', {
                  onSave: saveDirections,
                  directions,
                })
              }
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
