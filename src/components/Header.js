import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTailwind } from 'tailwind-rn';

const Header = ({ title, callEnabled }) => {
    const tailwind = useTailwind();
    const navigation = useNavigation();

    return (
        <View style={tailwind('p-2 flex-row items-center justify-between')}>
            <View style={tailwind('flex flex-row items-center')}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={tailwind('p-2')}
                >
                    <Ionicons
                        name="chevron-back-outline"
                        size={34}
                        color="#FF5864"
                    />
                </TouchableOpacity>
                <Text style={tailwind('text-2xl font-bold pl-2')}>{title}</Text>
            </View>
            {callEnabled && (
                <TouchableOpacity
                    style={tailwind('rounded-full mr-4 py-3 bg-red-200 px-4')}
                >
                    <Foundation name="telephone" size={20} color="red" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;
