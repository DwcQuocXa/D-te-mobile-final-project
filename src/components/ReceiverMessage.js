import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

function ReceiverMessage({ message }) {
    const tailwind = useTailwind();
    return (
        <View
            style={[
                tailwind(
                    'bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14',
                ),
                { alignSelf: 'flex-start' },
            ]}
        >
            <Image
                style={tailwind(
                    'h-12 w-12 rounded-full absolute top-0 -left-14',
                )}
                source={{ uri: message.photoURL }}
            />
            <Text style={tailwind('text-white')}>{message.message}</Text>
        </View>
    );
}

export default ReceiverMessage;
