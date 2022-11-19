import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTailwind } from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import { getMatchedUserInfo } from '../helpers/helper';
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    limit,
} from 'firebase/firestore';
import { db } from '../firebase';

const ChatRow = ({ matchDetails }) => {
    const tailwind = useTailwind();
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');
    const [lastMessageSender, setLastMessageSender] = useState('');

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }, [matchDetails, user]);

    useEffect(
        //Get the last message of the chat
        () =>
            onSnapshot(
                query(
                    collection(db, 'matches', matchDetails.id, 'messages'),
                    orderBy('timestamp', 'desc'),
                    limit(1),
                ),
                (snapshot) => {
                    const lastMessageData = snapshot.docs[0]?.data();
                    if (lastMessageData) {
                        console.log('lastMessageData', lastMessageData);
                        setLastMessage(lastMessageData.message);
                        setLastMessageSender(
                            lastMessageData.userId === user.uid
                                ? 'You'
                                : lastMessageData.displayName,
                        );
                    }
                },
            ),
        [matchDetails, user],
    );

    return (
        <TouchableOpacity
            style={[
                tailwind(
                    'flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg',
                ),
                styles.cardShadow,
            ]}
            onPress={() =>
                navigation.navigate('Message', {
                    matchDetails,
                })
            }
        >
            <Image
                style={tailwind('rounded-full h-16 w-16 mr-4')}
                source={{ uri: matchedUserInfo?.photoURL }}
            />
            <View>
                <Text style={tailwind('text-lg font-semibold')}>
                    {matchedUserInfo?.displayName}
                </Text>
                <Text>
                    {lastMessage
                        ? `${lastMessageSender}:${lastMessage}`
                        : 'Say Hi!!!'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRow;

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
});
