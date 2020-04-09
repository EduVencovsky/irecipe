import React, { useState, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import HeaderSearchBar from '../components/HeaderSearchBar'

const useSearchBarHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderSearchBar
          {...{ searchQuery, setSearchQuery, navigation, isOpen, setIsOpen }}
        />
      ),
    })
  }, [isOpen, navigation, searchQuery])

  return [
    [isOpen, setIsOpen],
    [searchQuery, setSearchQuery],
  ]
}

export default useSearchBarHeader
