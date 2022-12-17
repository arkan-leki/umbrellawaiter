import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { ArrowLeftIcon, ArrowPathIcon } from 'react-native-heroicons/outline'
import andoidsafearea from '../components/andoidsafearea'
import Itemlist from '../components/itemlist'
import { xwardamaniakans } from '../config'

const Menu = () => {
    const navigation = useNavigation()

    const [data, setData] = useState([])
    const [data1, setData1] = useState([])
    const [data2, setData2] = useState([])
    const [data3, setData3] = useState([])
    const [datazz, setDatazz] = useState([])

    const [items, setItems] = useState([])
    const [isLoading, setLoading] = useState(true);
    const [selected, setSelected] = useState([])

    const {
        params: {
            Halat,
            PswlaID,
            Kwrse,
            PswlaPara,
            dataPswla
        },
    } = useRoute();



    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@menu', jsonValue)
        } catch (e) {
            // saving error
        }
    }


    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@menu')
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
            const menis = await getData()
            setData(menis)

            if (menis == null) {
                console.log("awd");
                const loged = await AsyncStorage.getItem('@url');
                fetch(`http://${loged}:8000/api/${xwardamaniakans}`)
                    .then((response) => response.json()) // get response, convert to json
                    .then((json) => {
                        if (json) {
                            setData(json.data);
                            json.data && storeData(json.data)
                            const data1z = json.data.filter((v) => v.Bash == 1).reduce((acc, curr) => {
                                const { XGroup } = curr;

                                if (!acc[XGroup]) {
                                    acc[XGroup] = {
                                        items: [],
                                    };
                                }

                                acc[XGroup].items.push(curr);

                                return acc;
                            }, {});
                            const data2z = json.data.filter((v) => v.Bash == 2).reduce((acc, curr) => {
                                const { XGroup } = curr;

                                if (!acc[XGroup]) {
                                    acc[XGroup] = {
                                        items: [],
                                    };
                                }

                                acc[XGroup].items.push(curr);

                                return acc;
                            }, {});
                            const data3z = json.data.filter((v) => v.Bash == 3).reduce((acc, curr) => {
                                const { XGroup } = curr;

                                if (!acc[XGroup]) {
                                    acc[XGroup] = {
                                        items: [],
                                    };
                                }

                                acc[XGroup].items.push(curr);

                                return acc;
                            }, {});
                            setData1(data1z);
                            setData2(data2z);
                            setData3(data3z);
                            setItems(data2z);
                        }
                    })
                    .catch((error) => alert(error)) // display errors
                    .finally(() => { setLoading(false); }); // change loading state
                return
            }

            getData().then((menis) => {

                const data1z = menis.filter((v) => v.Bash == 1).reduce((acc, curr) => {
                    const { XGroup } = curr;

                    if (!acc[XGroup]) {
                        acc[XGroup] = {
                            items: [],
                        };
                    }

                    acc[XGroup].items.push(curr);

                    return acc;
                }, {});
                const data2z = menis.filter((v) => v.Bash == 2).reduce((acc, curr) => {
                    const { XGroup } = curr;

                    if (!acc[XGroup]) {
                        acc[XGroup] = {
                            items: [],
                        };
                    }

                    acc[XGroup].items.push(curr);

                    return acc;
                }, {});
                const data3z = menis.filter((v) => v.Bash == 3).reduce((acc, curr) => {
                    const { XGroup } = curr;

                    if (!acc[XGroup]) {
                        acc[XGroup] = {
                            items: [],
                        };
                    }

                    acc[XGroup].items.push(curr);

                    return acc;
                }, {});
                setData1(data1z);
                setData2(data2z);
                setData3(data3z);
                setItems(data2z);
            }).catch((error) => alert(error)) // display errors
                .finally(() => { setLoading(false); })

        }

        fetchData();
    }, [])


    const updatehandler = (item) => {
        selected.some((v) => (v.id == item.ID)) ? setSelected([...selected.filter((v) => (v.id != item.ID)), { id: item.ID, dana: (selected.filter((v) => (v.id == item.ID))[0].dana + 1), data: item }]) : setSelected([...selected, { id: item.ID, dana: 1, data: item }])
    }

    const menuOpt = Object.keys(items) ? [...Object.keys(items).map((opt) => ({ key: opt, value: opt, data: opt.items }))] : []

    return (
        <SafeAreaView style={andoidsafearea.AndroidSafeArea} className="w-full h-screen flex-1 justify-around bg-gray-800">
            <View className="flex flex-row justify-between py-2 border-cyan-600 border-b shadow-xl relative items-center w-full ">

                <TouchableOpacity
                    onPress={() =>
                    (
                        navigation.navigate("Tables")
                    )}
                    className="bg-transparent ml-2  "
                >
                    <ArrowLeftIcon size={30} color='white' />

                </TouchableOpacity>

                <Text className="text-white text-xl flex-1 absolute left-2/4 text-center font-bold">مینیو</Text>

                <ArrowPathIcon size={40} color='yellow' onPress={
                    async () => {
                        await AsyncStorage.removeItem('@menu'); 
                        setData(data)// change loading state
                    }
                } className="m-4" />
            </View>
            <View className="h-5/6">
                <View className="flex flex-row gap-x-3 items-center justify-center py-2 my-2 ">
                    <TouchableOpacity onPress={() => { setItems(data1); setDatazz([]) }}>
                        <View className="flex p-3 bg-yellow-500 rounded-md shadow-md">
                            <Text className="text-2xl">گەرمەکان</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setItems(data2); setDatazz([]) }}>
                        <View className="flex p-3 bg-yellow-500 rounded-md shadow-md">
                            <Text className="text-2xl">ساردەکان</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setItems(data3); setDatazz([]) }}>
                        <View className="flex p-3 bg-yellow-500 rounded-md shadow-md">
                            <Text className="text-2xl">نێرگیلە</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <View className="flex flex-col  shadow-sm border border-gray-700 rounded-md bg-gray-800 justify-items-start mx-2 p-2 h-5/6 justify-between">
                    <Text className="text-right text-white font-bold py-1 px-2 text-base">جۆرەکان</Text>
                    <View className="bg-white rounded-xl text-right mx-3 mb-2">
                        <SelectList
                            setSelected={(key) => setDatazz(items[key].items)}
                            data={menuOpt}
                            save="Key"
                            placeholder="جۆر"
                        // search={false}
                        />
                    </View>
                    <ScrollView className="h-full">
                        {(!items) || isLoading ? (
                            <View className="flex items-center justify-center w-full h-full">
                                <ActivityIndicator color={'#0B30E0'} size={100} />
                            </View>
                        ) :

                            <View className="flex flex-col gap-y-1 justify-start pb-3 my-4 mx-2 rounded-md">
                                {(datazz.length > 1) ?
                                    <View className="flex flex-col bg-yellow-400 w-full border-2 border-gray-700 rounded-md shadow-sm justify-between">
                                        <View className="flex flex-row-reverse items-center border-b-2 border-gray-700 p-3 justify-between">
                                            <Text className="text-sm text-right text-black">{datazz[0].XGroup}</Text>
                                        </View>
                                        <View className="flex flex-col bg-white border-yellow-400">

                                            {datazz.map((item, index) => (
                                                <TouchableOpacity key={index}
                                                    onPress={() => updatehandler(item)}
                                                    className="m-0">
                                                    <View className={` flex flex-row-reverse items-center justify-between py-2 px-4 rounded-md shadow-md ${(selected.some((v) => (v.id == item.ID))) ? 'bg-yellow-500 border-white border-2' : 'bg-[#f3f3f3]'}`} >
                                                        <View>
                                                            <Text className="text-black text-right text-sm">{item.Chor}</Text>
                                                            <Text className="text-black text-right text-xs">${item.Nrx}</Text>
                                                        </View>
                                                        <Text className="text-black text-base">{selected.some((v) => (v.id == item.ID)) && selected.filter((v) => (v.id == item.ID))[0].dana}x</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                            )}
                                        </View>
                                    </View>
                                    :
                                    <Itemlist items={items} selected={selected} updatehandler={updatehandler} />
                                }
                            </View>
                        }
                    </ScrollView>

                </View>

            </View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Order", {
                        Halat: Halat,
                        PswlaID: PswlaID,
                        Kwrse: Kwrse,
                        Pswla: selected,
                        PswlaPara: PswlaPara,
                        dataPswla: dataPswla
                    })

                }
                }
                className="p-2 bg-[#3EB8D4] border border-gray-300 bottom-0 rounded-t-3xl">
                <View>
                    <Text className="text-lg font-bold text-center  text-white">
                        داواکردن
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView >
    )
}

export default Menu