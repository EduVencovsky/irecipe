import React, { useState, useContext, useEffect } from 'react'
import { View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { List, Title, Checkbox, Divider, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { LanguageContext } from '../../context/LanguageContext'

const MyRecipesIngredientsQuantity = ({ ingredients = [], setIngredients }) => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()

  const renderItem = ({ item, index }) => {
    return (
      <>
        {index === 0 && <Divider />}
        <List.Item
          title={item.name}
          descriptionStyle={item.quantity ? {} : { color: theme.colors.accent }}
          description={item.quantity || t('quantityRequired')}
          onPress={() => console.log('open edit quantity', item)}
          right={(props) => (
            <List.Icon
              icon="scale-balance"
              {...props}
              color={item.quantity ? props.color : theme.colors.accent}
            />
          )}
        />
        <Divider />
      </>
    )
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      {ingredients.length > 0 ? (
        <>
          <List.Subheader>{t('selectedItems')}</List.Subheader>
          <FlatList
            style={styles.container}
            data={ingredients}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
        </>
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default MyRecipesIngredientsQuantity
