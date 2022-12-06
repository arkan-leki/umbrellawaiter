import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ArrowLeftIcon, ArrowPathIcon, UserCircleIcon } from 'react-native-heroicons/outline'
import andoidsafearea from '../components/andoidsafearea'
import { getConfiguration, kwrses } from '../config'

const Tables = () => {
    const navigation = useNavigation()

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState()

    const getData = async () => {

        async function fetchData() {
            const loged = await AsyncStorage.getItem('@url');
            fetch(`http://${loged}:8000/api/${kwrses}`)
                .then((response) => response.json()) // get response, convert to json
                .then((json) => {
                    if (json) {
                        setData(json.data);
                    }
                })
                .catch((error) => alert(error)) // display errors
                .finally(() => setLoading(false)); // change loading state

        }

        
        fetchData()

    }

    const getuser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            return null;
        }
    }

    useEffect(() => {

        
        navigation.setOptions({
            headerShown: false
        })

        async function fetchData() {
            setUser(await getuser())
            slogo = (await AsyncStorage.getItem('@timero'))
            if (slogo>1000) {
                const interval = setInterval(() => {
                    console.log('====================================');
                    console.log(slogo);
                    console.log('====================================');
                    getData();
                }, slogo)
                return () => clearInterval(interval)
            }
            // console.log(await AsyncStorage.getItem('@user'))
        }

        fetchData()

        getData();

        console.log('good');


    }, [])

    return (
        <SafeAreaView style={andoidsafearea.AndroidSafeArea} className="w-full h-screen flex-1 bg-gray-800">
            <View className="flex flex-row justify-between py-2 h-10  border-cyan-600 border-b shadow-xl relative items-center w-full ">
                <ArrowPathIcon size={40} color='yellow' onPress={
                    () => {
                        getData()
                    }
                } className="m-4" />
                <Text className="text-white text-xl right-1/3 absolute text-center font-bold">{user && `${user.UserName} && ${user.ID}`}</Text>
                <TouchableOpacity
                    onPress={() =>
                    (
                        navigation.navigate("Login")
                    )}
                    className="bg-transparent ml-2 p-2 "
                >
                    <UserCircleIcon size={30} color='white' />

                </TouchableOpacity>
            </View>
            <View className="h-full">
                <ScrollView className="p-3 h-full w-full ">
                    {(!data) || isLoading ? (
                        <View className="flex items-center justify-center w-full h-screen">
                            <ActivityIndicator color={'#0B30E0'} size={100} />
                        </View>
                    ) :
                        <View className="flex flex-wrap flex-row mb-20 gap-3 w-full py-3 mx-1  items-center justify-items-center">
                            {data.map((v, index) => (
                                <TouchableOpacity key={index}
                                    onPress={() => {
                                        if (v.Halat) {
                                            navigation.navigate("Pswla", {
                                                Halat: v.Halat,
                                                PswlaID: v.PswlaID,
                                                Kwrse: v.ID,
                                                PswlaPara: 0
                                            })
                                            return
                                        }
                                        navigation.navigate("Menu", {
                                            Halat: v.Halat,
                                            PswlaID: v.PswlaID,
                                            Kwrse: v.ID,
                                            dataPswla: undefined
                                        })
                                    }
                                    }
                                    className={`flex flex-col h-20 p-4 w-1/5 justify-items-center items-center ${v.Halat ? `${v.PswlaID ? 'bg-yellow-500 border-[#0B30E0]' : 'bg-white border-[#0B30E0] '}` : 'bg-[#F3F3F3] border-[#B6B6B6]'} border-2 rounded-lg shadow-sm  `}>
                                    <Text className={` ${v.Halat ? `${v.PswlaID ? 'text-black' : 'text-black'}` : 'text-black'} font-semibold text-xl `}>{v.ID}</Text>
                                    <Text className={` ${v.Halat ? `${v.PswlaID ? 'text-black' : 'text-black'}` : 'text-black'} text-xs font-light overflow-hidden`}>#{v.PswlaID}</Text>
                                </TouchableOpacity>
                            )
                            )}
                        </View>
                    }

                </ScrollView>
            </View>

        </SafeAreaView>
    )
}

export default Tables

