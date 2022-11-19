import React from 'react';
import { Text, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

function SenderMessage({ message }) {
    const tailwind = useTailwind();

    return (
        <View
            style={[
                tailwind(
                    'bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2',
                ),
                { alignSelf: 'flex-start', marginLeft: 'auto' },
            ]}
        >
            <Text style={tailwind('text-white')}>{message.message}</Text>
        </View>
    );
}

export default SenderMessage;
