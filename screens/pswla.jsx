import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native'
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react'
import { Button, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ArrowLeftIcon, ArrowPathIcon, ArrowUturnRightIcon, ClockIcon, CubeTransparentIcon, CurrencyDollarIcon, MinusCircleIcon, PlusCircleIcon } from 'react-native-heroicons/outline';
import andoidsafearea from '../components/andoidsafearea';
import { kwrses, pswlas, subpswlas } from '../config';

const Pswla = () => {
    const navi = useNavigation()

    const [data, setData] = useState([])
    const [pswlah, setPswlah] = useState([])
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(false)
    const [showmodal, setShowmodal] = useState(false)
    const [table, setTable] = useState()

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
    const handleUpdate2 = async () => {
        if (table == pswlah.JKwrse) { return alert("هەمان مێزە") }
        fetch(`http://${loged}:8000/api/${kwrses}/${table}`)
            .then((response) => response.json()).then((json) => {
                if (json.data[0].Halat == 0) return alert("گۆڕین ئەنجام بدە ")
                if (json.data[0].Halat != 0) {
                    fetch(`http://${loged}:8000/api/${kwrses}/${pswlah.JKwrse}`, {
                        method: 'PATCH',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "ID": Kwrse,
                            "PswlaID": 0,
                            "Halat": 0
                        })
                    })

                    fetch(`http://${loged}:8000/api/${pswlas}/${json.data[0].PswlaID}`)
                        .then((response) => response.json()) // get response, convert to json
                        .then((json) => {
                            if (json) {
                                fetch(`http://${loged}:8000/api/${pswlas}/${json.data[0].ID}`, {
                                    method: 'PATCH',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(
                                        { ...json.data[0], Total: pswlah.Total + json.data[0].Total, KoePswla: pswlah.KoePswla + json.data[0].KoePswla }
                                    )
                                })
                            }
                        })
                    fetch(`http://${loged}:8000/api/${pswlas}/${pswlah.ID}`)
                        .then((response) => response.json()) // get response, convert to json
                        .then((json) => {
                            if (json) {
                                fetch(`http://${loged}:8000/api/${pswlas}/${pswlah.ID}`, {
                                    method: 'PATCH',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(
                                        { ...json.data[0], Total: 0, KoePswla: 0, Deleted: 1 }
                                    )
                                })
                            }
                        })
                    const newdata = data.map((itemd) => ({ ...itemd, JmarayKwrse: table, SubPswUpdated: 1, Pswlaid: json.data[0].PswlaID }))
                    newdata && newdata.map((val) => {
                        fetch(`http://${loged}:8000/api/${subpswlas}/${val.ID}`, {
                            method: 'PATCH',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(val)
                        })
                    })
                    getData()
                    setShowmodal(false)
                    navi.navigate("Tables")
                }
            })

    }
    const handleUpdate = async () => {
        if (table > 0 && table < 200) {
            fetch(`http://${loged}:8000/api/${kwrses}/${table}`)
                .then((response) => response.json()) // get response, convert to json
                .then((json) => {
                    if (json) {
                        if (json.data[0].Halat == 1) { return alert("ناتوانیت ") }
                        console.log('====================================');
                        console.log(`http://${loged}:8000/api/${kwrses}/${pswlah.JKwrse}`);
                        console.log('====================================');
                        fetch(`http://${loged}:8000/api/${kwrses}/${pswlah.JKwrse}`, {
                            method: 'PATCH',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "ID": Kwrse,
                                "PswlaID": 0,
                                "Halat": 0
                            })
                        }).then((vv) => {
                            if (vv.ok) {
                                fetch(`http://${loged}:8000/api/${kwrses}/${table}`, {
                                    method: 'PATCH',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        "ID": 1,
                                        "PswlaID": pswlah.ID,
                                        "Halat": 1
                                    })
                                }).then((vs) => {
                                    if (vs.ok) {

                                        fetch(`http://${loged}:8000/api/${pswlas}/${pswlah.ID}`, {
                                            method: 'PATCH',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(
                                                { ...pswlah, JKwrse: table }
                                            )
                                        }).then((vd) => {
                                            if (vd.ok) {
                                                getData();
                                                const newdata = data.map((itemd) => ({ ...itemd, JmarayKwrse: table, SubPswUpdated: 1 }))
                                                newdata && newdata.map((val) => {
                                                    fetch(`http://${loged}:8000/api/${subpswlas}/${val.ID}`, {
                                                        method: 'PATCH',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify(val)
                                                    }).then(() => {
                                                        getData(); setShowmodal(false)
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })
                            }

                        })
                    }
                })
                .catch((error) => alert(error)) // display errors
                .finally(() => setLoading(false));

        }

    }

    const update = async (pswlah, subpsl, dana) => {
        try {
            const loged = await AsyncStorage.getItem('@url');

            const subs = {
                ...subpsl, SubPswlaDate: new Date().addHours(3).toJSON(),
                SubpswlaTime: new Date().addHours(3).toJSON(), SubPswUpdated: 1, Dana: (subpsl.Dana + dana),
                KoePara: (subpsl.KoePara + ((subpsl.Nrx) * dana))
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
                                { ...pswlah, KoePswla: (pswlah.KoePswla + ((subpsl.Nrx) * dana)), Total: ((pswlah.Total + ((subpsl.Nrx) * dana)) - pswlah.Discount) }
                            )
                        }).then(() => {
                            getData();

                        })
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
                {/* //chak kaptin free */}
                <PlusCircleIcon size={40} color='yellow' onPress={
                    () => {
                        navi.navigate("Menu", {
                            Halat: Halat,
                            PswlaID: pswlah.ID,
                            PswlaPara: pswlah.Total,
                            dataPswla: pswlah,
                            Kwrse: pswlah.JKwrse
                        })
                    }
                } />
                <Pressable onPress={() => { setShowmodal(true) }}>

                    <ArrowUturnRightIcon size={40} color='orange' />

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
                            <View className="flex flex-col gap-y-2 m-4 ">
                                <TextInput
                                    className="bg-white p-3 text-right w-fit border rounded-xl border-gray-500"
                                    keyboardType='numeric'
                                    onChangeText={(val) => setTable(val)}
                                    placeholder="مێز"
                                    value={table}
                                />
                                <View className="mx-10 w-32 bg-white rounded-md">
                                    <Button
                                        className="w-٣٢"
                                        onPress={() => {
                                            handleUpdate()
                                        }}
                                        title="گۆرین"
                                        color="#0B30E0"
                                    // accessibilityLabel="Login"
                                    />
                                </View>
                                <View className="mx-10 w-32 bg-white rounded-md">
                                    <Button
                                        className="w-٣٢"
                                        onPress={() => {
                                            handleUpdate2()
                                        }}
                                        title="گواستنەوە"
                                        color="#0B30E0"
                                    // accessibilityLabel="Login"
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

            <ScrollView className="flex-1">

                <View className="flex flex-col  bg-white border-2 border-[#F3F3F3] rounded-md shadow-sm justify-between mx-4 my-2">

                    {data.map((psl, index) =>
                    (
                        <View key={index} className={`flex flex-col  items-center p-3 justify-between border border-gray-500  ${psl.Hallat == 1 ? 'bg-green-500' : `${psl.SubPswUpdated ? 'bg-orange-400' : 'bg-yellow-500'}`} `}>
                            <View className="flex flex-row-reverse flex-wrap items-center gap-x-2 mb-2">
                                <Text className="text-base text-right font-bold text-black">{psl.Chor}</Text>
                                <Text className="text-sm text-right  text-black">{psl.Tebene}</Text>
                            </View>
                            <View className="flex flex-row-reverse gap-x-2 items-center">
                                <Text className="text-sm text-right  text-black"><CurrencyDollarIcon size={20} color='white' />{psl.Nrx}</Text>
                                <Text className="text-sm text-right  text-black"><ClockIcon size={20} color='white' />{moment(new Date(psl.SubpswlaTime)).format("hh:mm A")}</Text>
                                <View className="flex flex-row-reverse gap-x-2 items-center">
                                    {psl.Hallat == 0 && <MinusCircleIcon size={30} color='red' onPress={() => { (0 != psl.Dana) && update(pswlah, psl, -1) }} />}
                                    <Text className="text-lg text-center text-black font-bold">{psl.Dana}X</Text>
                                    {<PlusCircleIcon size={30} color='green' onPress={() => update(pswlah, psl, 1)} />}
                                </View>
                                <View>
                                    <Text className="text-base text-center font-bold text-black">${psl.KoePara}</Text>
                                </View>
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