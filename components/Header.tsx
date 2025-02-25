import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sevya</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#56021F',
    marginTop: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    paddingTop: 50

  },
});