import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { PencilSquareIcon } from 'react-native-heroicons/outline'
import andoidsafearea from '../components/andoidsafearea'
import { kwrses, pswlas, subpswlas } from '../config'

const Order = () => {
    const navigation = useNavigation()
    const [selected, setSelected] = useState([])
    const [user, setUser] = useState()
    const [menu, setMenu] = useState([])
    const [barcode, setBarcode] = useState()
    const [showmodal, setShowmodal] = useState(false)
    const [text, setText] = useState();
    const [open, setOpen] = useState()

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
    const menuOpt2 = menu ? [...menu.map((opt) => ({ key: opt.ID, value: (opt.ID).toString() }))] : []


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
            <View className="bg-white mx-4 rounded-md text-right mt-2">
                {/* chak ba id behene */}
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
            <View className="flex flex-row-reverse items-center justify-around gap-x-2  bg-white mx-4  rounded-md my-2">
                {/* chak ba id behene */}
                {/* <SelectList
                    setSelected={(val) => {
                        setSelected([...selected, { id: val, dana: 1, data: menu.filter((vals) => (vals.ID == val))[0] }])
                    }}
                    boxStyles={{ borderRadius: 4 }}
                    data={menuOpt2}
                    save="Key"
                    placeholder='خواردنەکان خیرا بگەرێ'
                    search={true}
                /> */}
                <TextInput
                    className="bg-white p-3 flex-1 text-right "
                    keyboardType='numeric'
                    onChangeText={(val) => setBarcode(val)}
                    placeholder="کۆد"
                    value={barcode}
                />
                <View className="p-3">
                    <Button
                        onPress={() => {
                            menu.some((vals) => (vals.ID == barcode)) && setSelected([...selected, { id: barcode, dana: 1, data: menu.filter((vals) => (vals.ID == barcode))[0] }])
                        }}
                        title="گەران"
                        color="#0B30E0" />
                </View>
            </View>
            <ScrollView className="h-full">
                <View className="flex flex-col gap-2 py-4 mb-10">
                    {Pswla && selected.map((item, index) =>
                    (
                        <View key={index} className="flex flex-row-reverse gap-1 items-center mx-2">
                            <TouchableOpacity
                                onPress={() => {
                                    (0 == item.dana) ? setSelected([...selected.filter((v) => (v.id != item.id))])
                                        : setSelected(selected.map((value, indexs) => {
                                            return (indexs != index) ? value : { ...value, dana: (item.dana - 1) };
                                        }))

                                }}
                                className="bg-red-500 rounded-md">
                                <Text className="p-3 py-5 text-xl text-white">-</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    // setSelected(selected.map((value) => {
                                    //     return (value.id != item.id) ? value : { ...value, dana: (item.dana + 1) };
                                    // }))
                                    setSelected(selected.map((value, indexs) => {
                                        console.log(indexs);
                                        console.log(index);
                                        return (indexs != index) ? value : { ...value, dana: (item.dana + 1) };
                                    }))
                                }}
                                className={`flex-1 flex-row-reverse flex-wrap justify-between items-center p-3 mx-3 rounded-md shadow-md  bg-yellow-400 border border-gray-500s`}>
                                <View>
                                    <Text className="text-black text-right text-base">{item.data.Chor}</Text>
                                    <Text className="text-black text-right text-base">${item.data.Nrx}</Text>
                                </View>
                                <Text className="text-base">{item.dana}x</Text>
                                <Text className="text-base">{item.tebene}</Text>
                                <Text className="text-base">${item.data.Nrx * item.dana}</Text>
                            </TouchableOpacity>

                            <Pressable onPress={() => { setShowmodal(true); setOpen(index) }}>

                                <PencilSquareIcon size={30} color='orange' />

                            </Pressable>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={showmodal}
                                onRequestClose={() => {
                                    Alert.alert("Modal has been closed.");
                                    setShowmodal(!showmodal);
                                }}>
                                <View className="fixed justify-center h-full z-50 overflow-auto bg-[#2d2d2dad]  flex">
                                    <View className="rrelative p-8 bg-white w-3/4 items-center max-w-md m-auto flex-col flex rounded-md " >
                                        <View className="flex flex-col gap-y-2 m-4">
                                            <TextInput
                                                className="bg-white p-3 text-right w-fit border rounded-xl border-gray-500"
                                                multiline
                                                onChangeText={(val) => setText(val)}
                                                placeholder="تێبینی"
                                                value={text}
                                            />
                                            <View className="mx-10 w-32 bg-white rounded-md">
                                                <Button
                                                    className="w-32"
                                                    onPress={() => {
                                                        setSelected(selected.map((value, indexs) => {
                                                            console.log(open);
                                                            return (indexs != open) ? value : { ...value, tebene: text };
                                                        }))

                                                        setShowmodal(false)
                                                        setText()
                                                    }}
                                                    title="دانان"
                                                    color="#0B30E0"
                                                />
                                            </View>
                                            <Pressable
                                                onPress={() => setShowmodal(!showmodal)}
                                            >
                                                <Text className="text-white p-3 bg-red-800 rounded">داخستن</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
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
                                { ...dataPswla, KoePswla: (total + PswlaPara) - dataPswla.Discount, Total: (total + PswlaPara) }
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
                                        "Tebene": val.tebene ? val.tebene : "",
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
                                            "Tebene": val.tebene ? val.tebene : "",
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