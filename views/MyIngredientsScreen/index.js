import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import { View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { List, Title, Checkbox } from 'react-native-paper'

import { LanguageContext } from '../../context/LanguageContext'

import { useDebounce, useSearchBarHeader } from '../../hooks'
import { getIngredientsList } from '../../services/ingredients'
import { useNavigation } from '@react-navigation/native'

const isChecked = (id, idList) =>
  idList.map((x) => x._id.toString()).includes(id.toString())

const MyIngredients = () => {
  const { t } = useContext(LanguageContext)
  const navigation = useNavigation()
  const [openState, searchState] = useSearchBarHeader()
  const [isOpen, setIsOpen] = openState
  const [searchQuery, setSearchQuery] = searchState
  const [searchIngredients, setSearchIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const debouncedQuery = useDebounce(searchQuery, 500, false)

  useEffect(() => {
    getIngredientsList(debouncedQuery).then((res) => {
      console.log('data', res.data)
      if (Array.isArray(res.data)) {
        setSearchIngredients(res.data)
      }
    })
  }, [debouncedQuery])

  const onSelectItem = (item, itemIsChecked) => {
    if (itemIsChecked) {
      setSelectedIngredients((prev) =>
        prev.filter((x) => item._id.toString() !== x._id.toString()),
      )
    } else {
      setSelectedIngredients((prev) => prev.concat(item))
    }
  }

  const renderItem = ({ item }) => {
    const isSelected = isChecked(item._id, selectedIngredients)
    return (
      <List.Item
        title={item.name}
        description="Item description"
        right={(props) => (
          <Checkbox
            {...props}
            onPress={() => onSelectItem(item, isSelected)}
            status={isSelected ? 'checked' : 'unchecked'}
          />
        )}
      />
    )
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      {isOpen ? (
        searchIngredients.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps="always"
            style={styles.container}
            data={searchIngredients}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Title>{t('noIngredientFound')}</Title>
          </View>
        )
      ) : selectedIngredients.length > 0 ? (
        <FlatList
          keyboardShouldPersistTaps="always"
          style={styles.container}
          data={selectedIngredients}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Title>{t('noIngredientFound')}</Title>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default MyIngredients
