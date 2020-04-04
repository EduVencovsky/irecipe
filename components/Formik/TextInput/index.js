import React from 'react'
import PropTypes from 'prop-types'
import { TextInput as ReactNativeTextInput, View } from 'react-native'
import { TextInput as TextInputPaper, HelperText } from 'react-native-paper'
import { connect } from 'formik'

export const TextInputIcon = React.forwardRef(
  ({ Icon, ...otherProps }, ref) => (
    <TextInputPaper
      {...otherProps}
      ref={ref}
      render={(textInputProps) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
          }}>
          {Icon}
          <ReactNativeTextInput {...textInputProps} />
        </View>
      )}
    />
  ),
)

TextInputIcon.propTypes = {
  Icon: PropTypes.node,
}

export const TextInput = (props) => <TextInputPaper {...props} />

export const ErrorMessage = ({ errors, ...otherProps }) => (
  <HelperText type="error" {...otherProps}>
    {errors}
  </HelperText>
)

ErrorMessage.propTypes = {
  errors: PropTypes.string.isRequired,
}

const UnconnectedTextInputFormik = ({ formik, name, error, ...otherProps }) => (
  <TextInput
    error={error && formik.errors[name] && formik.touched[name]}
    onChangeText={formik.handleChange(name)}
    onBlur={formik.handleBlur(name)}
    value={formik.values[name]}
    {...otherProps}
  />
)

UnconnectedTextInputFormik.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  error: PropTypes.bool,
}

export const TextInputFormik = connect(UnconnectedTextInputFormik)

const UnconnectedErrorMessageFormik = ({ formik, name, ...otherProps }) => (
  <ErrorMessage
    errors={formik.errors[name]}
    visible={formik.errors[name] && formik.touched[name]}
    {...otherProps}
  />
)

UnconnectedErrorMessageFormik.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
}

export const ErrorMessageFormik = connect(UnconnectedErrorMessageFormik)

const UnconnectedInputFormik = ({
  formik,
  name,
  errorProps,
  ...otherProps
}) => (
  <>
    <TextInput
      onChangeText={formik.handleChange(name)}
      onBlur={formik.handleBlur(name)}
      value={formik.values[name]}
      {...otherProps}
    />
    {formik.errors[name] && formik.touched[name] ? (
      <ErrorMessage errors={formik.errors[name]} {...errorProps} />
    ) : null}
  </>
)

UnconnectedInputFormik.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  inputProps: PropTypes.object,
  errorProps: PropTypes.object,
}

export const InputFormik = connect(UnconnectedInputFormik)
