import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

const ModalScreen = () => {
    const tailwind = useTailwind();
    const { user } = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState('');
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    const incompleteForm = !job || !age;

    const defaultAvatarUrl =
        'https://secure.gravatar.com/avatar/33dbb14aede9bc48aa232b1d52faef54.jpg?d=mp&s=1200';

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image.length > 0 ? image : defaultAvatarUrl,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
        })
            .then(() => {
                navigation.navigate('Home');
            })
            .catch((error) => {
                alert('Error: ' + error.message);
            });
    };

    return (
        <View style={tailwind('flex-1 items-center pt-3')}>
            <Text style={[tailwind(''), { fontSize: '40', color: '#FF5864' }]}>
                DẠTE
            </Text>

            <Text style={tailwind('text-xl text-gray-400 p-2 font-bold')}>
                Welcome {user.displayName}
            </Text>

            <Text style={tailwind('text-center text-red-400 p-4 font-bold')}>
                Step 1: The Profile Pic
            </Text>
            <TextInput
                style={tailwind('text-center text-xl pb-2')}
                placeholder="Enter your profile pic URL"
                value={image}
                onChangeText={(text) => setImage(text)}
            />

            <Text style={tailwind('text-center text-red-400 p-4 font-bold')}>
                Step 2: The Job
            </Text>
            <TextInput
                style={tailwind('text-center text-xl pb-2')}
                placeholder="Enter your occupation"
                value={job}
                onChangeText={(text) => setJob(text)}
            />

            <Text style={tailwind('text-center text-red-400 p-4 font-bold')}>
                Step 3: The Age
            </Text>
            <TextInput
                style={tailwind('text-center text-xl pb-2')}
                placeholder="Enter your age"
                value={age}
                onChangeText={(text) => setAge(text)}
                keyboardType="numeric"
                maxLength={2}
            />

            <TouchableOpacity
                style={[
                    tailwind('w-64 p-3 rounded-xl absolute bottom-10'),
                    incompleteForm
                        ? tailwind('bg-gray-400')
                        : tailwind('bg-red-400'),
                ]}
                disabled={incompleteForm}
                onPress={updateUserProfile}
            >
                <Text style={tailwind('text-center text-white text-xl')}>
                    Update Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ModalScreen;
