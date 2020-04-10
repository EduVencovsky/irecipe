import React, { useState, useContext, useEffect } from 'react'
import { View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import {
  List,
  Title,
  Checkbox,
  Divider,
  FAB,
  useTheme,
} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import HeaderSearchBar from '../../components/HeaderSearchBar'
import { LanguageContext } from '../../context/LanguageContext'
import { useDebounce } from '../../hooks'
import { getIngredientsList } from '../../services/ingredients'

const isChecked = (id, idList) =>
  idList.map((x) => x._id.toString()).includes(id.toString())

const SelectIngredientsByQuantity = ({ ingredients = [], onSave }) => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigation = useNavigation()

  const [searchIngredients, setSearchIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState(ingredients)

  const debouncedQuery = useDebounce(searchQuery, 200, false)

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

  const renderItem = ({ item, index }) => {
    const isSelected = isChecked(item._id, selectedIngredients)
    return (
      <>
        {index === 0 && <Divider />}
        <List.Item
          title={item.name}
          right={(props) => (
            <Checkbox
              {...props}
              color={theme.colors.accent}
              onPress={() => onSelectItem(item, isSelected)}
              status={isSelected ? 'checked' : 'unchecked'}
            />
          )}
        />
        <Divider />
      </>
    )
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <HeaderSearchBar
        {...{ searchQuery, setSearchQuery, navigation, isOpen, setIsOpen }}
        goBack={false}
      />
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
        <>
          <List.Subheader>{t('selectedItems')}</List.Subheader>
          <FlatList
            keyboardShouldPersistTaps="always"
            style={styles.container}
            data={selectedIngredients}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
        </>
      ) : (
            <View style={styles.noDataContainer}>
              <Title>{t('noIngredientFound')}</Title>
            </View>
          )}
      <FAB
        visible={!isOpen && selectedIngredients.length > 0}
        style={styles.fab}
        icon="check"
        color="#fff"
        onPress={() => onSave(selectedIngredients)}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default SelectIngredientsByQuantity
