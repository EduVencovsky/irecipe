import React from 'react'
import { View, StyleSheet } from 'react-native'

const SvgWrapper = ({ children }) => (
  <View style={styles.container}>{children}</View>
)

const styles = StyleSheet.create({
  container: { aspectRatio: 1 },
})

export default SvgWrapper
