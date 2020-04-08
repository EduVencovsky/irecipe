import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import { View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { List, Title } from 'react-native-paper'

import { LanguageContext } from '../../context/LanguageContext'

import { useDebounce } from '../../hooks'
import { getIngredientsList } from '../../services/ingredients'
import { useNavigation } from '@react-navigation/native'
import HeaderSearchBar from '../../components/HeaderSearchBar'

const renderItem = ({ item }) => (
  <List.Item
    title={item.name}
    description="Item description"
    left={(props) => <List.Icon {...props} icon="folder" />}
  />
)

const MyIngredients = () => {
  const { t } = useContext(LanguageContext)
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchIngredients, setSearchIngredients] = useState([])
  const debouncedQuery = useDebounce(searchQuery, 1000, false)

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ navigation }) => (
        <HeaderSearchBar
          {...{ searchQuery, setSearchQuery, navigation }}
          hideOnBlur
        />
      ),
    })
  }, [navigation, searchQuery, t])

  useEffect(() => {
    getIngredientsList(debouncedQuery).then((res) => {
      console.log('data', res.data)
      if (Array.isArray(res.data)) {
        setSearchIngredients(res.data)
      }
    })
  }, [debouncedQuery])

  return (
    <KeyboardAvoidingView style={styles.container}>
      {searchIngredients.length > 0 ? (
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
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDataContainer: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default MyIngredients
