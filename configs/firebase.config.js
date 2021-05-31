import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAHWBqXhlpvL-YW4XExb7NZhfWllx8QPWI',
    authDomain: 'integra-platform.firebaseapp.com',
    databaseURL: 'https://integra-platform-default-rtdb.firebaseio.com',
    projectId: 'integra-platform',
    storageBucket: 'integra-platform.appspot.com',
    messagingSenderId: '727323389783',
    appId: '1:727323389783:web:1e87cf77debb6c894c1812',
    measurementId: 'G-KW64SJDZTK',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export default {
    firebase,
    auth,
};
