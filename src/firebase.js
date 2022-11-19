// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCaMNws_gVgfDj4XadIMBgnT5kY7FqOu4Q',
    authDomain: 'mobile-final-project-10106.firebaseapp.com',
    projectId: 'mobile-final-project-10106',
    storageBucket: 'mobile-final-project-10106.appspot.com',
    messagingSenderId: '492714706923',
    appId: '1:492714706923:web:60012e7f0d20b6a1cdbbae',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
