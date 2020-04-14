import React, { useContext } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { List, Title, Divider, Checkbox, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import { LanguageContext } from '../../context/LanguageContext'
import UndrawDiet from '../../svg/UndrawDiet'
import MagnifySearchText from '../../components/MagnifySearchText'

const MyRecipesIngredientsList = ({
  ingredients = [],
  setIngredients,
  onFlatListScroll,
}) => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()
  const navigation = useNavigation()

  const onQuantitySave = (item) => {
    console.log('onQuantitySave', item)
    setIngredients((prev) =>
      prev.map((x) =>
        x._id.toString() === item._id.toString() ? { ...x, ...item } : x,
      ),
    )
  }
  const onDeselectItem = (item) => {
    setIngredients((prev) =>
      prev.filter((x) => x._id.toString() !== item._id.toString()),
    )
  }

  const renderItem = ({ item, index }) => {
    return item._id ? (
      <>
        {index === 0 && <Divider />}
        <List.Item
          title={item.name}
          descriptionStyle={item.quantity ? {} : { color: theme.colors.accent }}
          description={
            item.quantity && item.unityMeasurement
              ? `${item.quantity} ${t(
                  item.unityMeasurement.name.toLowerCase(),
                )}`
              : t('clickToAddQuantity')
          }
          onPress={() =>
            navigation.navigate('myRecipesIngredientsQuantity', {
              item,
              onSave: onQuantitySave,
            })
          }
          right={(props) => (
            <View {...props} style={styles.listItemCheckbox}>
              <Checkbox
                color={theme.colors.accent}
                onPress={() => onDeselectItem(item)}
                status={'checked'}
              />
            </View>
          )}
        />
        <Divider />
      </>
    ) : (
      <View style={styles.dummy} />
    )
  }

  return (
    <View style={styles.container}>
      {ingredients.length > 0 ? (
        <>
          <List.Subheader>{t('selectedItems')}</List.Subheader>
          <FlatList
            onScroll={onFlatListScroll}
            style={styles.container}
            data={[...ingredients, {}]}
            renderItem={renderItem}
            keyExtractor={(item, i) =>
              item._id ? item._id.toString() : i.toString()
            }
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
    </View>
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
  noDataText: {
    textAlign: 'center',
  },
  svg: {
    width: '100%',
    paddingHorizontal: 30,
  },
  listItemCheckbox: {
    justifyContent: 'center',
  },
  dummy: {
    height: 100,
    width: 100,
  },
})

export default MyRecipesIngredientsList
