import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { List, Text, useTheme } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const dots =
  ' ...................................................................................................................................................................'

const IngredientsList = ({ ingredients }) => {
  const theme = useTheme()
  return (
    <View>
      <FlatList
        data={ingredients}
        renderItem={({ item, index }) => (
          <List.Item
            titleStyle={styles.itemTitle}
            title={
              <Text numberOfLines={1}>
                {item.name}
                {dots}
              </Text>
            }
            left={(props) => (
              <View style={styles.measurement}>
                <MaterialCommunityIcon
                  size={25}
                  color={theme.colors.primary}
                  name="plus-circle-outline"
                />
              </View>
            )}
            right={(props) => (
              <View style={styles.measurement}>
                <Text>{`${item.quantity} ${item.measurement.name}`}</Text>
              </View>
            )}
          />
        )}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  measurement: {
    justifyContent: 'center',
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
  },
})

export default IngredientsList
