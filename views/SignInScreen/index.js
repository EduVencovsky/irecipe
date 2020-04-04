import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { KeyboardAvoidingView, StyleSheet, View, Image } from 'react-native'
import { useTheme, Headline } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button from '../../components/Button'
import { InputFormik } from '../../components/Formik/TextInput'

const initialValues = {
  username: '',
  password: '',
}

const LoginValidation = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
})

const SignInScreen = () => {
  const theme = useTheme()
  const [source, setSource] = useState({})

  const onSubmit = (values) => {
    console.log(values)
  }

  useEffect(() => {
    const loadIcons = async () => {
      const newSource = await MaterialIcon.getImageSource(
        'food',
        100,
        theme.colors.primary,
      )
      console.log(newSource)
      setSource(newSource)
    }
    loadIcons()
  }, [theme.colors.primary])

  return (
    <SafeAreaView style={styles.flex}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={LoginValidation}
        onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
              <Image source={source} style={styles.logo} />
              <Headline>IRECIPE</Headline>
              <View style={styles.form}>
                <InputFormik
                  style={styles.input}
                  name="username"
                  label="Username"
                />
                <InputFormik
                  style={styles.input}
                  name="password"
                  label="Password"
                  secureTextEntry
                />
                <Button type="submit" mode="contained">
                  Login
                </Button>
              </View>
            </KeyboardAvoidingView>
          </>
        )}
      </Formik>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logo: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  form: {
    flex: 2,
    width: '90%',
  },
  input: {
    marginVertical: 10,
  },
})

export default SignInScreen
