import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Image, SafeAreaView, Text, TextInput, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { tbusersURL } from '../config'

const LoginScreen = () => {
    const navigation = useNavigation()

    const [isLoading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState()
    const [passw, setPassw] = useState()


    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        })

        async function fetchData() {
            const logedss = await getData();
            if (logedss) {
                navigation.navigate("Tables")
            }
            const loged = await AsyncStorage.getItem('@url');
            fetch(`http://${loged}:8000/api/${tbusersURL}`)
                .then((response) => response.json()) // get response, convert to json
                .then((json) => {
                    if (json) {
                        setUsers(json.data);
                    }
                })
                .catch((error) => alert(error)) // display errors
                .finally(() => setLoading(false)); // change loading state

        }
        fetchData()

    }, [])

    const usersOpt = users ? [...users.map((opt) => ({ key: opt.ID, value: opt.UserName }))] : []

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@user', jsonValue)
        } catch (e) {
            // saving error
        }
    }


    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            return null;
        }
    }

    if (isLoading) {
        <View className="flex items-center justify-center w-full h-screen">
            <ActivityIndicator color={'#0B30E0'} size={100} />
        </View>
    }

    return (
        <SafeAreaView className=" bg-gray-800 w-screen h-screen">
            <View className="flex items-center gap-y-2 justify-start top-10 bg-gray-800 w-full h-screen">
                <Image source={require('../images/umbrella.png')}
                    style={{
                        width: 200,
                        height: 200,
                        resizeMode: 'contain'
                    }}
                />

                <Text className="text-4xl mt-2 text-white font-bold">چونەژورەوە</Text>
                <View className="flex flex-col text-right gap-y-3 m-4 p-4 w-80">
                    <View className="bg-white rounded-xl text-right">
                        <SelectList
                            setSelected={(val) => setUser(val)}
                            data={usersOpt}
                            save="Key"
                            placeholder="کاپتن"
                            search={false}
                        />
                    </View>
                    <TextInput
                        className="bg-white p-3 text-right border rounded-xl border-gray-500"
                        secureTextEntry={true}
                        onChangeText={(val) => setPassw(val)}
                        placeholder="پاسسکۆد"
                        value={passw}
                    />
                    <View className="mx-10 bg-white rounded-md">
                        <Button
                            className="w-full"
                            onPress={async () => {
                                if (user) {
                                    const us = users.filter((v) => (v.ID == user))
                                    if (passw == us[0].UserPassword) {
                                        await storeData(us[0])
                                        navigation.navigate("Tables")
                                    }
                                }
                            }}
                            title="چونەژور"
                            color="#0B30E0"
                        // accessibilityLabel="Login"
                        />
                    </View>
                    <View className="mx-10 bg-white rounded-md">
                        <Button
                            className="w-full"
                            onPress={async () => {
                                navigation.navigate("Setting")
                            }}
                            title="ریکخستنەکان"
                            color="#0B30E0"
                        // accessibilityLabel="Login"
                        />
                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}

export default LoginScreen