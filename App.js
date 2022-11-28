import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import Menu from './screens/menu';
import Tables from './screens/tables';
import React, { useCallback, useEffect, useState } from 'react';
import Pswla from './screens/pswla';
import Order from './screens/order';
import { getConfiguration } from './config';
import { Button, Image, SafeAreaView, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Setting from './screens/Setting';

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(true);
  const [url, setUrl] = useState()
  useEffect(() => {
    async function fetchData() {
      loged = await getData();
      setUrl(loged)
      fetch(`http://${loged}:8000/api/`)
        .then(() => {
          setAppIsReady(false)
        }).catch((e) => { setAppIsReady(true) })
    }
    fetchData()


  }, [])

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@url', value)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@url')
      return jsonValue != null ? jsonValue : null;
    } catch (e) {
      return null;
    }
  }

  if (appIsReady) {
    return (
      <SafeAreaView className="flex items-center gap-3 justify-center w-full h-screen">
        <Image source={require('./images/umbrella.png')}
          style={{
            width: 200,
            height: 200,
            resizeMode: 'contain'
          }}
        />
        <TextInput
          className="bg-white p-3 border rounded-xl w-10/12 border-gray-500"
          keyboardType='numeric'
          onChangeText={(val) => {
            setUrl(val)
          }}
          placeholder="url"
          value={url}
        />
        <View className="w-9/12">
          <Button
            className="w-full"
            onPress={() => {
              storeData(url)
            }}
            title="SetUP"
            color="#0B30E0"
          // accessibilityLabel="Login"
          />
        </View>
      </SafeAreaView>
    );
  }
  return (
    // <Pswla/>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Tables" component={Tables} />
        <Stack.Screen name="Pswla" component={Pswla} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}