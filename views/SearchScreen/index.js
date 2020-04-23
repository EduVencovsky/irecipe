import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { FAB, List, Avatar, Text, useTheme } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { getRecipes } from '../../services/recipe'

const SearchScreen = () => {
  const navigation = useNavigation()
  const theme = useTheme()
  const [recipes, setRecipes] = useState([])

  useFocusEffect(
    useCallback(() => {
      getRecipes()
        .then((res) => {
          console.log(JSON.stringify(res.data, null, 2))
          setRecipes(res.data)
        })
        .catch((res) => console.log('error', res.data))
    }, []),
  )

  const renderItem = ({ item }) => (
    <List.Item
      onPress={() => navigation.navigate('recipe', { _id: item._id })}
      style={styles.listItem}
      title={item.name}
      description={() => (
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            <MaterialCommunityIcon size={15} name="food-variant" />
          </Text>
          <Text style={styles.descriptionText}>{item.ingredients.length}</Text>
          <Text style={styles.descriptionText}>
            <MaterialCommunityIcon size={15} name="stove" />
          </Text>
          <Text style={styles.descriptionText}>{item.appliances.length}</Text>

          <Text style={styles.descriptionText}>
            <MaterialCommunityIcon size={15} name="progress-clock" />
          </Text>
          <Text style={styles.descriptionText}>{item.time}</Text>
        </View>
      )}
      left={(props) =>
        item.image ? (
          <Avatar.Image source={item.image} />
        ) : (
          <Avatar.Icon
            {...props}
            style={[props.style, { backgroundColor: theme.colors.backdrop }]}
            icon="food"
          />
        )
      }
      right={(props) => (
        <View style={styles.chevronIcon}>
          <List.Icon {...props} icon="chevron-right" />
        </View>
      )}
    />
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item, i) =>
          item && item._id ? item._id.toString() : i.toString()
        }
      />
      {/* <FAB
        style={styles.fab}
        icon="magnify"
        color="#fff"
        onPress={() => navigation.navigate('createRecipe')}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    borderRadius: 3,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionText: {
    marginHorizontal: 3,
  },
  chevronIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default SearchScreen
