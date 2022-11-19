import React, { useLayoutEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useNavigation } from '@react-navigation/native';

import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
    const { signInWithGoogle } = useAuth();
    const navigation = useNavigation();
    const tailwind = useTailwind();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <View style={tailwind('flex-1')}>
            <ImageBackground
                resizeMode="cover"
                style={tailwind('flex-1')}
                source={{
                    uri: 'https://images.squarespace-cdn.com/content/v1/5d390d4236304f0001b0b2eb/1564289300831-1TLL2M78V3BQXCI8NG95/OMGdateme_OMGdateme+Background+Gradient.png?format=2500w',
                }}
            >
                <TouchableOpacity
                    style={[
                        tailwind('absolute bottom-40 w-52 p-4'),
                        { marginHorizontal: '25%', marginVertical: '60%' },
                    ]}
                >
                    <Text
                        style={[
                            tailwind('text-center text-white'),
                            { fontSize: '76' },
                        ]}
                    >
                        DẠTE
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        tailwind('absolute bottom-40 w-48 p-4'),
                        { marginHorizontal: '25%', marginVertical: '40%' },
                    ]}
                    onPress={signInWithGoogle}
                >
                    <Text
                        style={tailwind('text-center text-white font-semibold')}
                    >
                        Sign in & get swiping
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

export default LoginScreen;
