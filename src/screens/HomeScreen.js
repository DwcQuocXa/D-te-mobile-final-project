import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { useTailwind } from 'tailwind-rn';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import {
    doc,
    onSnapshot,
    collection,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const tailwind = useTailwind();
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);

    const generateId = (id1, id2) => (id1 > id2 ? id1 + id2 : id2 + id1);

    useLayoutEffect(
        () =>
            onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
                if (!snapshot.exists()) {
                    navigation.navigate('Modal');
                }
            }),
        [],
    );

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {
            //Find the Passes person
            const passesSnapshot = await getDocs(
                collection(db, 'users', user.uid, 'passes'),
            );
            const passesIds = passesSnapshot.docs.map((doc) => doc.id);
            const passedUserIds = passesIds.length > 0 ? passesIds : ['empty'];

            //Find the Swipes person
            const swipesSnapshot = await getDocs(
                collection(db, 'users', user.uid, 'swipes'),
            );
            const swipesIds = swipesSnapshot.docs.map((doc) => doc.id);
            const swipedUserIds = swipesIds.length > 0 ? swipesIds : ['empty'];

            console.log([...passedUserIds, ...swipedUserIds]);

            unsub = onSnapshot(
                //Query to filter Passes/Swipes person
                query(
                    collection(db, 'users'),
                    where('id', 'not-in', [...passedUserIds, ...swipedUserIds]),
                ),
                (snapshot) => {
                    setProfiles(
                        snapshot.docs
                            .filter((doc) => doc.id !== user.uid)
                            .map((doc) => ({ id: doc.id, ...doc.data() })),
                    );
                },
            );
        };

        fetchCards().catch((err) => {
            console.log(err);
        });
    }, []);

    const swipeLeft = async (cardIndex) => {
        if (!profiles[cardIndex]) {
            return;
        }

        const userSwiped = profiles[cardIndex];

        console.log(`You just pass ${userSwiped.displayName}`);

        await setDoc(
            doc(db, 'users', user.uid, 'passes', userSwiped.id),
            userSwiped,
        );
    };

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) {
            return;
        }

        const userSwiped = profiles[cardIndex];
        const loggedInProfile = await (
            await getDoc(doc(db, 'users', user.uid))
        ).data();

        //Check if the user swiped on you
        getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
            async (documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    //Check if user has swiped with you
                    //Create a match
                    console.log(
                        `Congrats, you MATCHED with ${userSwiped.displayName}`,
                    );
                    await setDoc(
                        doc(db, 'users', user.uid, 'swipes', userSwiped.id),
                        userSwiped,
                    );

                    await setDoc(
                        doc(db, 'matches', generateId(user.uid, userSwiped.id)),
                        {
                            users: {
                                [user.uid]: loggedInProfile,
                                [userSwiped.id]: userSwiped,
                            },
                            userMatched: [user.uid, userSwiped.id],
                            timestamp: serverTimestamp(),
                        },
                    );

                    navigation.navigate('Match', {
                        loggedInProfile,
                        userSwiped,
                    });
                } else {
                    //Put this user to your Favourite list
                    console.log(`You just swipe ${userSwiped.displayName}`);
                    await setDoc(
                        doc(db, 'users', user.uid, 'swipes', userSwiped.id),
                        userSwiped,
                    );
                }
            },
        );
    };

    return (
        <SafeAreaView style={tailwind('flex-1')}>
            <View
                style={tailwind('flex-row items-center justify-between px-5')}
            >
                <TouchableOpacity onPress={() => logout()}>
                    <Image
                        style={tailwind('h-10 w-10 rounded-full')}
                        source={{ uri: user.photoURL }}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                    <Text
                        style={[
                            tailwind(''),
                            { fontSize: '30', color: '#FF5864' },
                        ]}
                    >
                        DẠTE
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                    <Ionicons
                        name="chatbubbles-sharp"
                        size={30}
                        color="#FF5864"
                    ></Ionicons>
                </TouchableOpacity>
            </View>

            <View style={tailwind('flex-1 -mt-6')}>
                <Swiper
                    ref={swipeRef}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    onSwipedLeft={(cardIndex) => {
                        console.log('left');
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log('right');
                        swipeRight(cardIndex);
                    }}
                    verticalSwipe={false}
                    overlayLabels={{
                        left: {
                            title: 'NOPE',
                            style: {
                                label: {
                                    textAlign: 'right',
                                    color: 'red',
                                },
                            },
                        },
                        right: {
                            title: 'MATCH',
                            style: {
                                label: {
                                    color: '#4DED30',
                                },
                            },
                        },
                    }}
                    renderCard={(card) =>
                        card ? (
                            <View
                                key={card.id}
                                style={tailwind(
                                    'relative bg-white h-3/4 rounded-xl',
                                )}
                            >
                                <Image
                                    style={tailwind(
                                        'absolute top-0 h-full w-full rounded-xl',
                                    )}
                                    source={{ uri: card.photoURL }}
                                />
                                <View
                                    style={[
                                        tailwind(
                                            'absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl',
                                        ),
                                        style.cardShadow,
                                    ]}
                                >
                                    <View>
                                        <Text
                                            style={tailwind(
                                                'text-xl font-bold',
                                            )}
                                        >
                                            {card.displayName}
                                        </Text>
                                        <Text>{card.job}</Text>
                                    </View>
                                    <Text
                                        style={tailwind('text-2xl font-bold')}
                                    >
                                        {card.age}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View
                                style={[
                                    tailwind(
                                        'relative bg-white h-3/4 rounded-xl justify-center items-center',
                                    ),
                                    style.cardShadow,
                                ]}
                            >
                                <Text style={tailwind('font-bold pb-5')}>
                                    No more profiles
                                </Text>
                                <Image
                                    style={tailwind('h-20 w-full')}
                                    height={100}
                                    width={100}
                                    source={{
                                        uri: 'http://links.papareact.com/6gb',
                                    }}
                                />
                            </View>
                        )
                    }
                />
            </View>

            <View style={tailwind('flex flex-row justify-evenly')}>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeLeft()}
                    style={tailwind(
                        'items-center justify-center rounded-full w-16 h-16 bg-red-200',
                    )}
                >
                    <Entypo name="cross" size={24} color="red" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    style={tailwind(
                        'items-center justify-center rounded-full w-16 h-16 bg-green-200',
                    )}
                >
                    <AntDesign name="heart" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const style = StyleSheet.create({
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
