import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Setting = () => {
    const [url, setUrl] = useState()
    const [timo, setTimo] = useState()
    
    useEffect(() => {
        async function fetchData() {
            loged = await getData();
            setUrl(loged)
            setTimo(await AsyncStorage.getItem('@timero'))
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

    return (
        <SafeAreaView className="flex items-center gap-3 justify-start top-10 w-full h-screen">
            <Text>ریکخستنەکان</Text>
            <TextInput
                className="bg-white p-3 border rounded-xl w-10/12 border-gray-500"
                keyboardType='numeric'
                onChangeText={(val) => {
                    setUrl(val)
                }}
                placeholder="url"
                value={url}
            />
            <TextInput
                className="bg-white p-3 border rounded-xl w-10/12 border-gray-500"
                keyboardType='numeric'
                onChangeText={async (val) => {
                    setTimo(val)
                    await AsyncStorage.setItem('@timero', val)
                }}
                placeholder="1000sec"
                value={timo}
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
    )
}

export default Setting