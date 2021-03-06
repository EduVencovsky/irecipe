import React, { useContext } from 'react'
import { View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { List, Title, Divider, Checkbox, useTheme } from 'react-native-paper'

import { LanguageContext } from '../../context/LanguageContext'
import UndrawBarbecue from '../../svg/UndrawBarbecue'
import MagnifySearchText from '../../components/MagnifySearchText'

const MyRecipesAppliancesList = ({
  appliances = [],
  setAppliances,
  onFlatListScroll,
}) => {
  const { t } = useContext(LanguageContext)
  const theme = useTheme()

  const onSelectItem = (item) => {
    setAppliances(
      appliances.filter((x) => x._id.toString() !== item._id.toString()),
    )
  }

  const renderItem = ({ item, index }) => {
    return item._id ? (
      <>
        {index === 0 && <Divider />}
        <List.Item
          title={item.name}
          right={(props) => (
            <Checkbox
              {...props}
              color={theme.colors.accent}
              onPress={() => onSelectItem(item)}
              status={'checked'}
            />
          )}
        />
        <Divider />
      </>
    ) : (
      <View style={styles.dummy} />
    )
  }

  console.log('fail', appliances)
  return (
    <KeyboardAvoidingView style={styles.container}>
      {appliances.length > 0 ? (
        <>
          <List.Subheader>{t('selectedItems')}</List.Subheader>
          <FlatList
            onScroll={onFlatListScroll}
            style={styles.container}
            data={[...appliances, {}]}
            renderItem={renderItem}
            keyExtractor={(item, i) =>
              item._id ? item._id.toString() : i.toString()
            }
          />
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Title style={styles.noDataText}>{t('noApplianceFound')}</Title>
          <View style={styles.svg}>
            <UndrawBarbecue />
          </View>
          <MagnifySearchText />
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
  noDataText: {
    textAlign: 'center',
  },
  svg: {
    width: '100%',
    paddingHorizontal: 30,
  },
  dummy: {
    height: 100,
    width: 100,
  },
})

export default MyRecipesAppliancesList
