import React from 'react'
import PropTypes from 'prop-types'
import { Button as PaperButton } from 'react-native-paper'
import { useFormikContext } from 'formik'

const SubmitButton = (props) => {
  const { handleSubmit } = useFormikContext()
  return <PaperButton {...props} onPress={handleSubmit} />
}

const Button = ({ type, ...otherProps }) => {
  if (type === 'submit') {
    return <SubmitButton {...otherProps} />
  }
  return <PaperButton {...otherProps} />
}

Button.propTypes = {
  type: PropTypes.oneOf(['submit', 'button']),
}

export default Button
