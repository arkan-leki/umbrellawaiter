import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import andoidsafearea from '../components/andoidsafearea'
import { getConfiguration, kwrses, pswlas, subpswlas } from '../config'

const Order = () => {
    const navigation = useNavigation()
    const [selected, setSelected] = useState([])
    const [user, setUser] = useState()
    const [menu, setMenu] = useState([])
    const {
        params: {
            Halat,
            PswlaID,
            Kwrse,
            Pswla,
            PswlaPara,
            dataPswla
        },
    } = useRoute();

    const menuOpt = menu ? [...menu.map((opt) => ({ key: opt.ID, value: opt.Chor }))] : []


    useEffect(() => {



        navigation.setOptions({
            headerShown: true
        })

        setSelected(Pswla)
        async function fetchData() {
            const menis = await getData()
            setMenu(menis)
            setUser(await getuser())
        }
        fetchData()
        return () => {
            // console.log(selected);
        }
    }, [])

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@menu')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            return null;
        }
    }

    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    }

    const getuser = async () => {

        try {
            const jsonValue = await AsyncStorage.getItem('@user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            return null;
        }
    }

    return (
        <SafeAreaView style={andoidsafearea.AndroidSafeArea} className="w-full h-screen flex-1 justify-between bg-gray-800">
            <View className="bg-white mx-4 rounded-md mt-2">
                <SelectList
                    setSelected={(val) => {
                        setSelected([...selected, { id: val, dana: 1, data: menu.filter((vals) => (vals.ID == val))[0] }])
                    }}
                    boxStyles={{ borderRadius: 4 }}
                    data={menuOpt}
                    save="Key"
                    placeholder='خواردنەکان خیرا بگەرێ'
                    search={true}
                />
            </View>
            <ScrollView className="h-full">
                <View className="flex flex-col gap-2 py-4 mb-10">
                    {Pswla && selected.map((item, index) =>
                    (
                        <View key={index} className="flex flex-row-reverse gap-1 items-center mx-2">
                            <TouchableOpacity key={index}
                                onPress={() => {
                                    (0 == item.dana) ? setSelected([...selected.filter((v) => (v.id != item.id))])
                                        : selected.some((v) => (v.id == item.id)) && setSelected([...selected.filter((v) => (v.id != item.id)), { id: item.id, dana: (item.dana - 1), data: item.data }])

                                }}
                                className="bg-red-500 rounded-md">
                                <Text className="p-3 py-5 text-xl text-white">-</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    selected.some((v) => (v.id == item.id)) && setSelected([...selected.filter((v) => (v.id != item.id)), { id: item.id, dana: (item.dana + 1), data: item.data }])
                                }}
                                className={`flex-1 flex-row-reverse justify-between items-center p-3 mx-3 rounded-md shadow-md  bg-yellow-400 border border-gray-500s`}>
                                <View>
                                    <Text className="text-black text-right text-base">{item.data.Chor}</Text>
                                    <Text className="text-black text-right text-base">${item.data.Nrx}</Text>
                                </View>
                                <Text className="text-base">{item.dana}x</Text>
                                <Text className="text-base">${item.data.Nrx * item.dana}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={async () => {
                    const loged = await AsyncStorage.getItem('@url');

                    if (Halat == '1') {
                        const total = selected && Object.values(selected).reduce((r, {
                            dana,
                            data,
                        }) => r + (parseFloat(dana) * parseFloat(data.Nrx)), 0)

                        fetch(`http://${loged}:8000/api/${pswlas}/${PswlaID}`, {
                            method: 'PATCH',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(
                                {
                                    "Znjera": dataPswla.Znjera,
                                    "JKwrse": dataPswla.JKwrse,
                                    "KoePswla": (total + PswlaPara) - dataPswla.Discount,
                                    "ServiceUserName": dataPswla.ServiceUserName,
                                    "ServiceUserID": dataPswla.ServiceUserID,
                                    "Waslkra": dataPswla.Waslkra,
                                    "Deleted": dataPswla.Deleted,
                                    "USerName": dataPswla.USerName,
                                    "USerId": dataPswla.USerId,
                                    "Barwar": dataPswla.Barwar,
                                    "Kat": dataPswla.Kat,
                                    "Discount": dataPswla.Discount,
                                    "Total": (total + PswlaPara),
                                    "tebene": dataPswla.tebene
                                }
                            )
                        })

                        const groupsOpt = selected.map((val) => (
                            fetch(`http://${loged}:8000/api/${subpswlas}`, {
                                method: 'PUT',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(
                                    {
                                        "Znjera": (Math.random() * 9999).toFixed(0),
                                        "BashID": val.data.Bash,
                                        "XwardnID": val.id,
                                        "Chor": val.data.Chor,
                                        "Qayas": "",
                                        "Nrx": val.data.Nrx,
                                        "Dana": val.dana,
                                        "KoePara": (val.data.Nrx * val.dana),
                                        "Hallat": 0,
                                        "Tebene": "",
                                        "SubPswlaDate": new Date().addHours(3).toJSON(),
                                        "SubpswlaTime": new Date().addHours(3).toJSON(),
                                        "SubPswUpdated": 0,
                                        "JmarayKwrse": Kwrse,
                                        "Pswlaid": PswlaID
                                    }
                                )
                            })

                        ))

                        navigation.navigate("Pswla", {
                            Halat: '1',
                            PswlaID: PswlaID,
                            Kwrse: Kwrse,
                        })

                        return
                    }

                    const total = selected && Object.values(selected).reduce((r, {
                        dana,
                        data,
                    }) => r + (parseFloat(dana) * parseFloat(data.Nrx)), 0)

                    fetch(`http://${loged}:8000/api/${pswlas}`, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(
                            {
                                "Znjera": (Math.random() * 9999).toFixed(0),
                                "JKwrse": Kwrse,
                                "KoePswla": total,
                                "ServiceUserName": user.UserName,
                                "ServiceUserID": user.ID,
                                "Waslkra": 0,
                                "Deleted": 0,
                                "USerName": user.UserName,
                                "USerId": user.ID,
                                "Barwar": new Date().addHours(3).toJSON(),
                                "Kat": new Date().addHours(3).toJSON(),
                                "Discount": 0,
                                "Total": total,
                                "tebene": ""
                            }
                        )
                    }).then((response) => response.json()).then((json) => {
                        if (json) {
                            const pswlids = json.data.ID

                            fetch(`http://${loged}:8000/api/${kwrses}/${Kwrse}`, {
                                method: 'PATCH',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(
                                    {
                                        "ID": 2,
                                        "PswlaID": pswlids,
                                        "Halat": 1
                                    }
                                )
                            })
                            const groupsOpt = selected.map((val) => (
                                fetch(`http://${loged}:8000/api/${subpswlas}`, {
                                    method: 'PUT',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(
                                        {
                                            "Znjera": (Math.random() * 9999).toFixed(0),
                                            "BashID": val.data.Bash,
                                            "XwardnID": val.id,
                                            "Chor": val.data.Chor,
                                            "Qayas": "",
                                            "Nrx": val.data.Nrx,
                                            "Dana": val.dana,
                                            "KoePara": (val.data.Nrx * val.dana),
                                            "Hallat": 0,
                                            "Tebene": "",
                                            "SubPswlaDate": new Date().addHours(3).toJSON(),
                                            "SubpswlaTime": new Date().addHours(3).toJSON(),
                                            "SubPswUpdated": 0,
                                            "JmarayKwrse": Kwrse,
                                            "Pswlaid": pswlids
                                        }
                                    )
                                })

                            ))

                            navigation.navigate("Pswla", {
                                Halat: '1',
                                PswlaID: pswlids,
                                Kwrse: Kwrse,
                            })

                        }
                    })


                }
                }
                className="p-2 bg-[#3EB8D4] border border-gray-300 rounded-t-3xl">
                <View>
                    <Text className="text-lg font-bold text-center  text-white">
                        ناردن {selected && Object.values(selected).reduce((r, {
                            dana,
                            data,
                        }) => r + (parseFloat(dana) * parseFloat(data.Nrx)), 0)}
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView >
    )
}

export default Order