import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { View, TextInput, Animated, Keyboard } from 'react-native'
import { IconButton, Divider } from 'react-native-paper'

import { LanguageContext } from '../../context/LanguageContext'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const AnimatedIconButton = Animated.createAnimatedComponent(
  React.forwardRef(({ style, ...otherProps }, ref) => (
    <View ref={ref} style={style}>
      <IconButton {...otherProps} />
    </View>
  )),
)

const HeaderSearchBar = ({
  setSearchQuery,
  searchQuery,
  navigation,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useContext(LanguageContext)
  const [width] = useState(new Animated.Value(0))
  const inputRef = useRef(null)

  useEffect(() => {
    const blurSearchText = () => {
      closeSearchBar()
    }
    Keyboard.addListener('keyboardDidHide', blurSearchText)
    return () => {
      Keyboard.removeListener('keyboardDidHide', blurSearchText)
    }
  }, [setSearchQuery, closeSearchBar])

  const closeSearchBar = useCallback(() => {
    setSearchQuery('')
    inputRef.current.blur()
    setIsOpen(false)
    Animated.timing(width, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [width, setSearchQuery, setIsOpen])

  const openSearchBar = useCallback(() => {
    inputRef.current.focus()
    setIsOpen(true)
    Animated.timing(width, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [width, setIsOpen])

  return (
    <>
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <AnimatedIconButton
          style={{
            opacity: width.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            flex: width.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }}
          onPress={() => navigation.goBack()}
          size={25}
          icon="arrow-left"
        />
        <AnimatedIconButton
          size={25}
          icon="arrow-left"
          onPress={closeSearchBar}
          style={{
            opacity: width.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }}
        />
        <AnimatedIconButton
          size={25}
          icon="magnify"
          onPress={openSearchBar}
          style={{
            opacity: width.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }}
        />
        <AnimatedTextInput
          ref={inputRef}
          placeholder={t('search')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{
            flex: width.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            width: 0,
            paddingLeft: 10,
          }}
        />
      </View>
      <Divider />
    </>
  )
}

export default HeaderSearchBar
