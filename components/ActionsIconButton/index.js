import React from 'react'
import { IconButton, Menu } from 'react-native-paper'

const ActionsIconButton = ({ children, isOpen, setIsOpen, ...otherProps }) => (
  <Menu
    {...otherProps}
    visible={isOpen}
    onDismiss={() => setIsOpen(false)}
    anchor={
      <IconButton icon="dots-vertical" onPress={() => setIsOpen(true)} />
    }>
    {children}
  </Menu>
)

export default ActionsIconButton
