import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { Context } from '../index'

const App = () => {
  const route=useRoute()
    const [id,setId]=useState('Not logged in yet')
    const {handleLogin}=useContext(Context)
  return (

    <View style={styles.app}>
      <Text style={styles.text}>{id}</Text>
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
    app:{
        width:'100%',
        height:'100%',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        paddingTop:20,
        backgroundColor:'white',
        justifyContent:'center'
    },
    text:{
        color:'black',
        fontSize:24,
        fontWeight:'600',
        marginBottom:40
    },
    btn:{
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor:'black',
        color:'white',
        borderRadius:20
    },
    btnText:{
        color:'white',
        fontSize:20,
        fontWeight:'800'
    }
})