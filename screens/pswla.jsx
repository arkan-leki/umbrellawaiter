import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native'
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ArrowLeftIcon, ArrowPathIcon, MinusCircleIcon, PlusCircleIcon } from 'react-native-heroicons/outline';
import andoidsafearea from '../components/andoidsafearea';
import { getConfiguration, pswlas, subpswlas } from '../config';

const Pswla = () => {
    const navi = useNavigation()

    const [data, setData] = useState([])
    const [pswlah, setPswlah] = useState([])
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(false)

    const {
        params: {
            Halat,
            PswlaID,
            Kwrse
        },
    } = useRoute();

    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    }

    const update = async (pswlah, subpsl, dana) => {
        try {
            const loged = await AsyncStorage.getItem('@url');

            const subs = {
                "Znjera": subpsl.Znjera,
                "BashID": subpsl.BashID,
                "XwardnID": subpsl.XwardnID,
                "Chor": subpsl.Chor,
                "Qayas": subpsl.Qayas,
                "Nrx": subpsl.Nrx,
                "Dana": (subpsl.Dana + dana),
                "KoePara": (subpsl.KoePara + ((subpsl.Nrx) * dana)),
                "Hallat": subpsl.Hallat,
                "Tebene": subpsl.Tebene,
                "SubPswlaDate": new Date().addHours(3).toJSON(),
                "SubpswlaTime": new Date().addHours(3).toJSON(),
                "SubPswUpdated": 1,
                "JmarayKwrse": subpsl.JmarayKwrse,
                "Pswlaid": subpsl.Pswlaid
            }


            fetch(`http://${loged}:8000/api/${subpswlas}/${subpsl.ID}`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subs)
            })
                .catch((error) => alert(error)) // display errors
                .then((v) => {
                    if (v.ok) {
                        fetch(`http://${loged}:8000/api/${pswlas}/${pswlah.ID}`, {
                            method: 'PATCH',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(
                                {
                                    "Znjera": pswlah.Znjera,
                                    "JKwrse": pswlah.JKwrse,
                                    "KoePswla": (pswlah.KoePswla + ((subpsl.Nrx) * dana)),
                                    "ServiceUserName": pswlah.ServiceUserName,
                                    "ServiceUserID": pswlah.ServiceUserID,
                                    "Waslkra": pswlah.Waslkra,
                                    "Deleted": pswlah.Deleted,
                                    "USerName": pswlah.USerName,
                                    "USerId": pswlah.USerId,
                                    "Barwar": pswlah.Barwar,
                                    "Kat": pswlah.Kat,
                                    "Discount": pswlah.Discount,
                                    "Total": ((pswlah.Total + ((subpsl.Nrx) * dana)) - pswlah.Discount),
                                    "tebene": pswlah.tebene
                                }
                            )
                        }).then(() => { getData() })
                    }
                })

        } catch (e) {
            alert(e)
        }
    }

    const getData = async () => {
        const loged = await AsyncStorage.getItem('@url');

        try {
            fetch(`http://${loged}:8000/api/${pswlas}/${PswlaID}`)
                .then((response) => response.json()) // get response, convert to json
                .then((json) => {
                    if (json) {
                        setPswlah(json.data[0]);
                    }
                })
                .catch((error) => alert(error)) // display errors
                .finally(() => setLoading(false));
            fetch(`http://${loged}:8000/api/${subpswlas}/${PswlaID}`)
                .then((response) => response.json()) // get response, convert to json
                .then((json) => {
                    if (json) {
                        setData(json.data);
                    }
                })
                .catch((error) => alert(error)) // display errors
                .finally(() => setLoading(false)); // change loading state

        } catch (e) {
            alert(error)
        }
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

        navi.setOptions({
            headerShown: false
        })

        async function fetchData() {
            setUser(await getuser())
            // console.log(await AsyncStorage.getItem('@user'))
        }

        fetchData()

        getData()

    }, [])
    return (
        <SafeAreaView style={andoidsafearea.AndroidSafeArea} className="w-full h-screen flex-1 bg-gray-800">
            <View className="flex flex-row-reverse justify-between py-2 border-cyan-600 border-b shadow-xl relative items-center w-full ">
                <ArrowPathIcon size={40} color='yellow' onPress={
                    () => {
                        getData()
                    }
                } className="m-4" />
                <Text className="text-white text-xl flex-1 absolute left-1/3 text-center  font-bold">پسولەی {pswlah.ID}</Text>

                <TouchableOpacity
                    onPress={() =>
                    (
                        navi.navigate("Tables")
                    )}
                    className="bg-transparent ml-2  "
                >
                    <ArrowLeftIcon size={40} color='white' />

                </TouchableOpacity>

            </View>
            <View className="flex flex-wrap flex-row-reverse justify-items-center m-4 ">
                <Text className="text-right p-2 text-lg text-white">کوورسی :{pswlah.JKwrse}</Text>
                <Text className="text-right p-2 text-lg text-white">کاپتن : {pswlah.ServiceUserName}</Text>
                {/* <Text className="text-right p-2 text-base text-white">{moment.utc(pswlah.Kat).local().format("YYYY/MM/DD HH:mm")}</Text> */}
                <Text className="text-right p-2 text-base text-white">{moment.utc(pswlah.Kat).format("YYYY/MM/DD HH:mm")}</Text>

                {(pswlah.ServiceUserID == user.ID) && <PlusCircleIcon size={40} color='yellow' onPress={
                    () => {
                        navi.navigate("Menu", {
                            Halat: Halat,
                            PswlaID: pswlah.ID,
                            PswlaPara: pswlah.Total,
                            dataPswla: pswlah,
                            Kwrse: Kwrse
                        })
                    }
                } />}

            </View>

            <ScrollView className="flex-1">

                <View className="flex flex-col bg-white border-2 border-[#F3F3F3] rounded-md shadow-sm justify-between mx-4 my-2">

                    {data.map((psl, index) =>
                    (
                        <View key={index} className={`flex flex-row-reverse items-center p-3 justify-between border border-gray-500  ${psl.Hallat == 1 ? 'bg-green-500' : 'bg-yellow-500'} ${psl.SubPswUpdated && 'bg-orange-400'}`}>
                            <View className="flex-1 flex-col">
                                <Text className="text-base text-right  text-black">{psl.Chor}</Text>
                                <Text className="text-base text-right  text-black">${psl.Nrx}</Text>
                            </View>
                            <View className="flex flex-row-reverse gap-2 items-center">
                                {psl.Hallat == 0 && <MinusCircleIcon size={30} color='red' onPress={() => update(pswlah, psl, -1)} />}
                                <Text className="text-lg text-center  text-black">{psl.Dana}X</Text>
                                {psl.Hallat == 0 && <PlusCircleIcon size={30} color='green' onPress={() => update(pswlah, psl, 1)} />}
                            </View>
                            <View>
                                <Text className="text-base text-center  text-black">${psl.KoePara}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View className="flex items-center bg-blue-700 rounded-t-3xl border border-t-white">
                <Text className="text-lg p-3 font-bold text-center  text-white">
                    ${pswlah.Total}
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default Pswla