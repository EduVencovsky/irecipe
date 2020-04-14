import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'
import { TextInput, Button, Subheading, Divider, FAB } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { LanguageContext } from '../../context/LanguageContext'
import { useDidUpdateEffect } from '../../hooks'

const MyRecipesDirections = () => {
  const { t } = useContext(LanguageContext)
  const route = useRoute()
  const navigation = useNavigation()
  const { params = {} } = route || {}
  const { directions = [{ value: '' }], onSave } = params
  const [selectedDirections, setSelectedDirections] = useState(directions)
  const [hasChanged, setHasChanged] = useState(false)

  useDidUpdateEffect(() => {
    setHasChanged(true)
  }, [selectedDirections])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('directions'),
    })
  }, [navigation, t])

  const handleOnSave = () => {
    onSave(selectedDirections)
    navigation.goBack()
  }

  // Don't use index, use unique identifiers
  const handleChangeText = (text, index) => {
    // setSelectedDirections(prev => (prev.map(x => )))
  }

  const renderItem = ({ item, index, drag, isActive }) => (
    <TouchableWithoutFeedback
      style={{
        height: 100,
        backgroundColor: isActive ? 'blue' : item.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={{flex: 1}}
          // onChangeText={(text) => handleChangeText(text, i)}
          value={item.value}
          label={t('direction')}
          multiline
        />
        <TouchableWithoutFeedback onLongPress={drag}>
          <MaterialCommunityIcon size={30} name="drag" />
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  )

  return (
    <View style={styles.container}>
      <Subheading>{t('directions')}</Subheading>
      <DraggableFlatList
        data={selectedDirections}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${index}`}
        onDragEnd={({ data }) => setSelectedDirections(data)}
      />
      <Button // add unique identifier
        onPress={() => setSelectedDirections((prev) => prev.concat({}))}
        style={{ width: '100%' }}
        icon="plus">
        {t('addDirection')}
      </Button>
      <FAB
        visible={hasChanged}
        style={styles.fab}
        icon="check"
        color="#fff"
        onPress={handleOnSave}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default MyRecipesDirections
