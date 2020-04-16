import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { FAB } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getMyRecipe } from '../../services/recipe'

const MyRecipes = () => {
  const navigation = useNavigation()
  const [recipes, setRecipes] = useState([])

  useFocusEffect(
    useCallback(() => {
      getMyRecipe()
        .then((res) => setRecipes(res.data))
        .catch((res) => console.log('error', res.data))
    }, []),
  )

  console.log(recipes)
  return (
    <View style={styles.container}>
      <Text>My Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item, i) =>
          item && item._id ? item._id.toString() : i.toString()
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={() => navigation.navigate('createRecipe')}
      />
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
})

export default MyRecipes
