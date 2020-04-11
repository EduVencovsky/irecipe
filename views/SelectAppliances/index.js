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
import { getAppliancesList } from '../../services/appliances'
import MagnifySearchText from '../../components/MagnifySearchText'
import UndrawBarbecue from '../../svg/UndrawBarbecue'

const isChecked = (id, idList) =>
  idList.map((x) => x._id.toString()).includes(id.toString())

const SelectAppliances = ({ appliances = [], onSave }) => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()

  const [openState, searchState] = useSearchBarHeader()
  const [isOpen, setIsOpen] = openState
  const [searchQuery, setSearchQuery] = searchState
  const [hasChanged, setHasChanged] = useState(false)

  const [searchAppliances, setSearchAppliances] = useState([])
  const [selectedAppliances, setSelectedAppliances] = useState(appliances)

  useDidUpdateEffect(() => {
    setHasChanged(true)
  }, [selectedAppliances])

  const debouncedQuery = useDebounce(searchQuery, 200, false)

  useEffect(() => {
    getAppliancesList(debouncedQuery).then((res) => {
      console.log('data', res.data)
      if (Array.isArray(res.data)) {
        setSearchAppliances(res.data)
      }
    })
  }, [debouncedQuery])

  const onSelectItem = (item, itemIsChecked) => {
    if (itemIsChecked) {
      setSelectedAppliances((prev) =>
        prev.filter((x) => item._id.toString() !== x._id.toString()),
      )
    } else {
      setSelectedAppliances((prev) => prev.concat(item))
    }
  }

  const renderItem = ({ item, index }) => {
    const isSelected = isChecked(item._id, selectedAppliances)
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
        searchAppliances.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps="always"
            style={styles.container}
            data={searchAppliances}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Title>{t('noApplianceFound')}</Title>
          </View>
        )
      ) : selectedAppliances.length > 0 ? (
        <>
          <List.Subheader>{t('selectedItems')}</List.Subheader>
          <FlatList
            keyboardShouldPersistTaps="always"
            style={styles.container}
            data={selectedAppliances}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Title style={styles.noDataText}>{t('noApplianceFound')}</Title>
          <View style={styles.svg}>
            <UndrawBarbecue />
          </View>
          <MagnifySearchText />
        </View>
      )}
      <FAB
        visible={!isOpen && hasChanged}
        style={styles.fab}
        icon="check"
        color="#fff"
        onPress={() => onSave(selectedAppliances)}
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

export default SelectAppliances
