import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyDKwrhBcxo9CUis6v-vK5DrJDOSBcdV_dM",
    authDomain: "qstnsformybabyy.firebaseapp.com",
    projectId: "qstnsformybabyy",
    storageBucket: "qstnsformybabyy.firebasestorage.app",
    messagingSenderId: "1003504838393",
    appId: "1:1003504838393:web:c91b3192f3677f07616428"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, collection, addDoc };