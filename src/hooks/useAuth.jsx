import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from 'firebase/auth';

import { auth } from '../firebase';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState();
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(
        () =>
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user);
                } else {
                    setUser(null);
                }

                setLoadingInitial(false);
            }),
        [],
    );

    const config = {
        androidClientId:
            '492714706923-2jtsdur2g2tai8o94vq4157sqoprcnu8.apps.googleusercontent.com',
        iosClientId:
            '492714706923-4rq0vh3ja9rqpmht5so406of5l9pk3v1.apps.googleusercontent.com',
        expoClientId:
            '492714706923-vt47a3ikvv79nnk14fmluj2u9016scha.apps.googleusercontent.com',
    };

    const [request, response, promptAsync] = Google.useAuthRequest(config);

    useEffect(() => {
        const signIn = async () => {
            if (response?.type === 'success') {
                setAccessToken(response.authentication.accessToken);
                const credential = GoogleAuthProvider.credential(
                    response.authentication.idToken
                        ? response.authentication.idToken
                        : null,
                    accessToken,
                );
                await signInWithCredential(auth, credential);
            }
        };

        signIn()
            .catch((e) => {
                setError(e);
            })
            .finally(() => setLoading(false));
    }, [response]);

    const signInWithGoogle = async () => {
        setLoading(true);
        await promptAsync({ useProxy: true, showInRecents: true });
    };

    const logout = () => {
        setLoading(true);
        signOut(auth)
            .catch((e) => {
                setError(e);
            })
            .finally(() => setLoading(false));
    };

    const memoedValue = useMemo(
        () => ({ user, signInWithGoogle, loading, error, logout }),
        [user, loading, error],
    );

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}
