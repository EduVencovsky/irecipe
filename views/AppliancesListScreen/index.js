import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { List, Divider, Text, useTheme } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const AppliancesList = ({ appliances }) => {
  const theme = useTheme()
  return (
    <View>
      <FlatList
        data={appliances}
        renderItem={({ item, index }) => (
          <>
            {!index && <Divider />}
            <List.Item
              titleStyle={styles.itemTitle}
              title={item.name}
              left={(props) => (
                <View style={styles.measurement}>
                  <MaterialCommunityIcon
                    size={25}
                    color={theme.colors.primary}
                    name="plus-circle-outline"
                  />
                </View>
              )}
            />
            <Divider />
          </>
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
    marginVertical: 10,
  },
})

export default AppliancesList
