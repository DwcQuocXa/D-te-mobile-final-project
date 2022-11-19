import StackNavigator from './src/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import { TailwindProvider } from 'tailwind-rn';
import utilities from './tailwind.json';

export default function App() {
    return (
        <TailwindProvider utilities={utilities}>
            <NavigationContainer>
                <AuthProvider>
                    <StackNavigator />
                </AuthProvider>
            </NavigationContainer>
        </TailwindProvider>
    );
}
