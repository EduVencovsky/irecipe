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

import { LanguageContext } from '../../context/LanguageContext'
import {
  useDebounce,
  useSearchBarHeader,
  useDidUpdateEffect,
} from '../../hooks'
import { getIngredientsList } from '../../services/ingredients'
import UndrawDiet from '../../svg/UndrawDiet'
import MagnifySearchText from '../../components/MagnifySearchText'

const isChecked = (id, idList) =>
  idList.map((x) => x._id.toString()).includes(id.toString())

const SelectIngredients = ({ ingredients = [], onSave }) => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()

  const [openState, searchState] = useSearchBarHeader()
  const [isOpen, setIsOpen] = openState
  const [searchQuery, setSearchQuery] = searchState
  const [hasChanged, setHasChanged] = useState(false)

  const [searchIngredients, setSearchIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState(ingredients)

  useDidUpdateEffect(() => {
    setHasChanged(true)
  }, [selectedIngredients])

  const debouncedQuery = useDebounce(searchQuery, 200, false)

  useEffect(() => {
    getIngredientsList(debouncedQuery).then((res) => {
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
          <Title style={styles.noDataText}>{t('noIngredientFound')}</Title>
          <View style={styles.svg}>
            <UndrawDiet />
          </View>
          <MagnifySearchText />
        </View>
      )}
      <FAB
        visible={!isOpen && hasChanged}
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
  noDataText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  svg: {
    width: '100%',
    paddingHorizontal: 30,
  },
})

export default SelectIngredients
