import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import {
  TextInput,
  Button,
  Subheading,
  Menu,
  FAB,
  IconButton,
  useTheme,
} from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import { LanguageContext } from '../../context/LanguageContext'
import { useDidUpdateEffect } from '../../hooks'
import ActionsIconButton from '../../components/ActionsIconButton'

const actionStates = {
  dragging: 1,
  deleting: 2,
}

const MyRecipesDirections = () => {
  const { t } = useContext(LanguageContext)
  const route = useRoute()
  const theme = useTheme()
  const navigation = useNavigation()
  const { params = {} } = route || {}
  const { directions, onSave } = params
  const [selectedDirections, setSelectedDirections] = useState(
    () => directions || [{ dragId: uuidv4(), value: '' }],
  )
  const [hasChanged, setHasChanged] = useState(false)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [actionState, setActionState] = useState(0)

  useDidUpdateEffect(() => {
    setHasChanged(true)
  }, [selectedDirections])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('directions'),
      headerRight: () => (
        <ActionsIconButton isOpen={isActionsOpen} setIsOpen={setIsActionsOpen}>
          <Menu.Item
            title={t('drag')}
            onPress={() => {
              setIsActionsOpen(false)
              setActionState(actionStates.dragging)
            }}
          />
          <Menu.Item
            title={t('delete')}
            onPress={() => {
              setIsActionsOpen(false)
              setActionState(actionStates.deleting)
            }}
          />
        </ActionsIconButton>
      ),
    })
  }, [navigation, t, isActionsOpen])

  const handleSave = () => {
    onSave(selectedDirections)
    navigation.goBack()
  }

  const handleDelete = (dragId) => {
    setSelectedDirections((prev) =>
      prev.filter((x) => x.dragId.toString() !== dragId.toString()),
    )
  }

  const handleChangeText = (text, dragId) => {
    setSelectedDirections((prev) =>
      prev.map((x) =>
        x.dragId === dragId
          ? {
              ...x,
              value: text,
            }
          : x,
      ),
    )
  }

  const renderItem = ({ item, index, drag, isActive }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
      <TextInput
        style={{ flex: 1 }}
        onChangeText={(text) => handleChangeText(text, item.dragId)}
        value={item.value}
        label={`${t('direction')} ${index + 1}`}
        multiline
      />
      {actionState === actionStates.dragging && (
        <TouchableWithoutFeedback onLongPress={drag}>
          <MaterialCommunityIcon size={30} name="drag" />
        </TouchableWithoutFeedback>
      )}
      {actionState === actionStates.deleting && (
        <IconButton
          onPress={() => handleDelete(item.dragId)}
          color={theme.colors.accent}
          size={30}
          icon="delete"
        />
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <ScrollView style={[styles.padding, styles.container]}>
          <Subheading>{t('directions')}</Subheading>
          <DraggableFlatList
            data={selectedDirections}
            renderItem={renderItem}
            keyExtractor={(item) => item.dragId.toString()}
            onDragEnd={({ data }) => setSelectedDirections(data)}
          />
        </ScrollView>
        <View style={styles.padding}>
          <Button
            onPress={() =>
              setSelectedDirections((prev) =>
                prev.concat({ dragId: uuidv4(), value: '' }),
              )
            }
            contentStyle={{ width: '100%', height: 50 }}
            icon="plus">
            {t('addDirection')}
          </Button>
        </View>
      </View>

      <FAB
        visible={
          actionState === actionStates.deleting ||
          actionState === actionStates.dragging
        }
        style={styles.fab}
        icon="close"
        color="#fff"
        onPress={() => setActionState(0)}
      />
      <FAB
        visible={
          hasChanged &&
          selectedDirections.length > 0 &&
          actionState !== actionStates.deleting &&
          actionState !== actionStates.dragging
        }
        style={styles.fab}
        icon="check"
        color="#fff"
        onPress={handleSave}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  padding: {
    margin: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default MyRecipesDirections
