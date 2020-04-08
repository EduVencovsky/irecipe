import React, { useContext, useRef, useState } from 'react'
import { View, TextInput, Animated } from 'react-native'
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
}) => {
  const { t } = useContext(LanguageContext)
  const [width] = useState(new Animated.Value(0))
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  const toogleSearchBar = () => {
    const newValue = isOpen ? 0 : 1

    Animated.timing(width, {
      toValue: newValue,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setIsOpen((prev) => {
        const open = !prev
        if (open) {
          inputRef.current.focus()
        } else {
          inputRef.current.blur()
        }
        return open
      })
    })
  }

  return (
    <>
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
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
          onPress={toogleSearchBar}
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
          onPress={toogleSearchBar}
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
