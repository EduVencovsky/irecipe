import React, { useState, useContext, useEffect, Fragment } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import {
  TextInput,
  RadioButton,
  Subheading,
  Divider,
  FAB,
} from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import TextInputMask from 'react-native-text-input-mask'

import { LanguageContext } from '../../context/LanguageContext'
import { getMeasurements } from '../../services/measurement'

const MyRecipesIngredientsQuantity = () => {
  const { t } = useContext(LanguageContext)
  const route = useRoute()
  const navigation = useNavigation()
  const { params = {} } = route || {}
  const { item = {}, onSave } = params
  const [measurements, setMeasurements] = useState([])
  const [quantity, setQuantity] = useState(item.quantity || '')
  const [unityMeasurement, setUnityMeasurement] = useState(
    item.unityMeasurement ? item.unityMeasurement._id : '',
  )

  useEffect(() => {
    navigation.setOptions({
      headerTitle: item.name,
    })
  }, [navigation, item])

  const handleOnSave = () => {
    const selectedUnityMeasurement = measurements.find(
      (x) => x._id.toString() === unityMeasurement.toString(),
    )
    console.log('selectedUnityMeasurement', selectedUnityMeasurement)
    onSave({ ...item, quantity, unityMeasurement: selectedUnityMeasurement })
    navigation.goBack()
  }

  useEffect(() => {
    getMeasurements().then((res) => {
      setMeasurements(res.data)
    })
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            label={t('quantity')}
            value={quantity}
            onChangeText={setQuantity}
            render={(props) => (
              <TextInputMask
                {...props}
                mask={`[99999999]${t('decimalSeparator')}[99]`}
              />
            )}
            keyboardType="decimal-pad"
          />
          <View style={styles.unityMeasurementContainer}>
            <Subheading>{t('unityMeasurement')}</Subheading>
            <RadioButton.Group
              onValueChange={setUnityMeasurement}
              value={unityMeasurement}>
              {measurements &&
                measurements.map((x, i) => (
                  <Fragment key={x._id}>
                    {i === 0 && <Divider />}
                    <RadioButton.Item
                      label={`${t(x.name)} ${
                        x.symbol ? `( ${x.symbol} )` : ''
                      }`}
                      value={x._id}
                    />
                    <Divider />
                  </Fragment>
                ))}
            </RadioButton.Group>
          </View>
        </View>
      </ScrollView>
      <FAB
        visible={quantity && unityMeasurement}
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
  unityMeasurementContainer: {
    marginTop: 20,
  },
})

export default MyRecipesIngredientsQuantity
