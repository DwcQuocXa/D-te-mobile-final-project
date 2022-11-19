import React, { useEffect, useState } from 'react';
import {
    Button,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTailwind } from 'tailwind-rn';

import Header from '../components/Header';
import { getMatchedUserInfo } from '../helpers/helper';
import useAuth from '../hooks/useAuth';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { db } from '../firebase';
import {
    addDoc,
    collection,
    query,
    serverTimestamp,
    onSnapshot,
    orderBy,
} from 'firebase/firestore';

const MessageScreen = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const tailwind = useTailwind();
    const { matchDetails } = params;
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    //Get messages
    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db, 'matches', matchDetails.id, 'messages'),
                    orderBy('timestamp', 'desc'),
                ),
                (snapshot) =>
                    setMessages(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })),
                    ),
            ),
        [matchDetails, db],
    );

    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        });

        setInput('');
    };

    return (
        <SafeAreaView style={tailwind('flex-1')}>
            <Header
                title={
                    getMatchedUserInfo(matchDetails.users, user.uid).displayName
                }
                callEnabled
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tailwind('flex-1')}
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={messages}
                        inverted={-1}
                        style={tailwind('pl-4')}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) =>
                            item.userId === user.uid ? (
                                <SenderMessage key={item.id} message={item} />
                            ) : (
                                <ReceiverMessage key={item.id} message={item} />
                            )
                        }
                    />
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <View
                style={tailwind(
                    'flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2',
                )}
            >
                <TextInput
                    style={tailwind('h-10 text-lg')}
                    placeholder="Send message..."
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    value={input}
                />
                <Button title="Send" onPress={sendMessage} color="#FF5864" />
            </View>
        </SafeAreaView>
    );
};

export default MessageScreen;
