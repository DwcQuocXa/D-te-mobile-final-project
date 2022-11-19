import React, { useEffect, useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { db } from '../firebase';
import ChatRow from './ChatRow';

const ChatList = () => {
    const tailwind = useTailwind();
    const [matches, setMatches] = useState([]);
    const { user } = useAuth();

    //Get matches of user account
    useEffect(() => {
        onSnapshot(
            query(
                collection(db, 'matches'),
                where('userMatched', 'array-contains', user.uid),
            ),
            (snapshot) =>
                setMatches(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })),
                ),
        );
    }, [user]);

    console.log('matches', matches);

    return matches.length > 0 ? (
        <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatRow matchDetails={item} />}
        />
    ) : (
        <View style={tailwind('p-5')}>
            <Text style={tailwind('text center text-lg')}>
                You have no matches to talk with :(
            </Text>
        </View>
    );
};

export default ChatList;
