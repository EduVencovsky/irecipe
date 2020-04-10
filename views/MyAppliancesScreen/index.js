import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'

import SelectAppliances from '../SelectAppliances/index'
import { updateUserAppliances } from '../../services/appliances'
import { UserContext } from '../../context/UserContext'

const MyAppliances = () => {
  const navigation = useNavigation()
  const { user, setUser } = useContext(UserContext)

  const onSave = (selectedAppliances) => {
    updateUserAppliances(user._id, selectedAppliances)
      .then((result) => {
        setUser((prev) => ({ ...prev, appliances: result.data.appliances }))
        navigation.goBack()
      })
      .catch((err) => console.log(err))
  }

  return <SelectAppliances {...{ appliances: user.appliances, onSave }} />
}

export default MyAppliances
