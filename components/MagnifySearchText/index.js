import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Title, IconButton } from 'react-native-paper'

import { LanguageContext } from '../../context/LanguageContext'

const MagnifySearchText = () => {
  const { t } = useContext(LanguageContext)

  return (
    <View style={styles.container}>
      <Title style={styles.noDataText}>{t('magnifyToSerach1')}</Title>
      <IconButton icon="magnify" />
      <Title style={styles.noDataText}>{t('magnifyToSerach2')}</Title>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default MagnifySearchText
