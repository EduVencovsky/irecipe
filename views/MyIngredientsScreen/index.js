import React, { useState, useContext, useEffect } from 'react'
import { View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { Searchbar, List, Title } from 'react-native-paper'

import { LanguageContext } from '../../context/LanguageContext'

import { useDebounce } from '../../hooks'
import { getIngredientsList } from '../../services/ingredients'
import { useNavigation } from '@react-navigation/native'

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

  // useEffect(() => {
  //   const parent = navigation.dangerouslyGetParent()
  //   parent.setOptions({
  //     tabBarVisible: false,
  //   })
  //   return () =>
  //     parent.setOptions({
  //       tabBarVisible: true,
  //     })
  // }, [])

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
      <Searchbar
        placeholder={t('search')}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {searchIngredients.length > 0 ? (
        <FlatList
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
