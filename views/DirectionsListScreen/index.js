import React, { useContext } from 'react'
import { View, FlatList, StyleSheet, ScrollView } from 'react-native'
import {
  List,
  Divider,
  Text,
  Paragraph,
  useTheme,
  Subheading,
} from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { LanguageContext } from '../../context/LanguageContext'

const DirectionsList = ({ directions }) => {
  const theme = useTheme()
  const { t } = useContext(LanguageContext)

  return (
    <View>
      <ScrollView>
        {directions &&
          directions.map((x, i) => (
            <View style={styles.item}>
              <Subheading>{`${t('direction')} ${i}`}</Subheading>
              <Divider />
              <Paragraph>{x.direction}</Paragraph>
            </View>
          ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  measurement: {
    justifyContent: 'center',
    margin: 10,
  },

  item: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
    flex: 1,
  },
})

export default DirectionsList
