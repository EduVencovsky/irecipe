import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const MyRecipes = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>My Recipes</Text>
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
