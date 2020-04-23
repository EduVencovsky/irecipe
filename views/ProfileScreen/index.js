import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Avatar, Title, List, Divider } from 'react-native-paper'
import { UserContext } from '../../context/UserContext'
import { LanguageContext } from '../../context/LanguageContext'
import { AuthContext } from '../../context/AuthContext'
import { useNavigation } from '@react-navigation/native'

const Profile = () => {
  const { getUserFullName, getUserAvatarText } = useContext(UserContext)
  const { t } = useContext(LanguageContext)
  const { signOut } = useContext(AuthContext)
  const navigation = useNavigation()

  return (
    <View>
      <List.Item
        title={<Title>{getUserFullName()}</Title>}
        left={({ style }) => (
          <Avatar.Text style={style} label={getUserAvatarText()} />
        )}
      />
      <Divider />
      <List.Item
        title={t('myrecipes')}
        description={t('createRecipe')}
        onPress={() => navigation.navigate('myrecipes')}
        left={(props) => <List.Icon {...props} icon="book-open" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      <List.Item
        title={t('myingredients')}
        description={t('addIngredients')}
        onPress={() => navigation.navigate('myingredients')}
        left={(props) => <List.Icon {...props} icon="food-variant" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      <List.Item
        title={t('myappliances')}
        description={t('addAppliances')}
        onPress={() => navigation.navigate('myappliances')}
        left={(props) => <List.Icon {...props} icon="stove" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
      {/* <Divider />
      <List.Item
        title={t('configuration')}
        description={t('configDescription')}
        onPress={() => navigation.navigate('configuration')}
        left={(props) => <List.Icon {...props} icon="settings" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      /> */}
      <Divider />
      <List.Item
        title={t('logout')}
        onPress={signOut}
        left={(props) => <List.Icon {...props} icon="logout" />}
      />
      <Divider />
    </View>
  )
}

const styles = StyleSheet.create({})

export default Profile
