import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const Itemlist = ({ items, selected, updatehandler }) => {

    return (
        <>
            {Object.keys(items).map((key, index) => (
                <View key={index} className="flex flex-col bg-yellow-400 w-full border-2 border-gray-700 rounded-md shadow-sm justify-between">
                    <View className="flex flex-row-reverse items-center border-b-2 border-gray-700 p-3 justify-between">
                        <Text className="text-sm text-right text-black">{key}</Text>
                    </View>
                    <View className="flex flex-col bg-white border-yellow-400">
                        {true && items[key].items.map((item, index) =>
                        (
                            <TouchableOpacity key={index}
                                onPress={() => updatehandler(item)}>
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
            )
            )}
        </>
    )
}

export default Itemlist