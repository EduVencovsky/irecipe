import React, { useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Divider, Paragraph, Subheading } from 'react-native-paper'
import { LanguageContext } from '../../context/LanguageContext'

const DirectionsList = ({ directions }) => {
  const { t } = useContext(LanguageContext)

  return (
    <View>
      <ScrollView>
        {directions &&
          directions.map((x, i) => (
            <View key={i} style={styles.item}>
              <Subheading>{`${t('direction')} ${i + 1}`}</Subheading>
              <Divider />
              <Paragraph>{x.direction}</Paragraph>
            </View>
          ))}
        <View style={styles.dummy} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  measurement: {
    justifyContent: 'center',
    margin: 10,
  },
  dummy: {
    height: 100,
  },
  item: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
    flex: 1,
  },
})

export default DirectionsList
