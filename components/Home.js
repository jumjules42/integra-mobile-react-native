import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
    Dimensions,
    ImageBackground,
    Image,
    TextInput,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import firebase from '../configs/firebase.config.js';
import supabase from '../configs/supabase.config.js';

const { width: WIDTH } = Dimensions.get('window');

function Home(props) {
    const [userEmail, setUserEmail] = React.useState('');
    const [userData, setUserData] = React.useState([]);
    const [familyGroup, setFamilyGroup] = React.useState([]);
    const [storage, setStorage] = React.useState('');

    const fetchUserData = async () => {
        firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                return setUserEmail(user.email);
            }
            alert('Not found.');
        });
        try {
            const { data: titular } = await supabase
                .from('partners')
                .select('*, plans(name)')
                .eq('email', userEmail);
            setUserData(titular[0]);

            const { data: family } = await supabase
                .from('partners')
                .select('*')
                .match({
                    family_group: titular[0].family_group,
                    state: 'aceptado',
                });
            setFamilyGroup(family);
        } catch (error) {
            alert(error);
        }
    };

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@userdata');
            return setStorage(jsonValue ? JSON.parse(jsonValue) : null);
        } catch (error) {
            alert(error);
        }
    };

    React.useEffect(() => {
        fetchUserData();
        getData();
    }, []);

    console.log(storage);
    return (
        <ImageBackground style={styles.backgroundContainer}>
            <View>
                {familyGroup.length > 0 ? (
                    familyGroup.map((el, idx) => (
                        <Text style={styles.text} key={`familiar-${idx}`}>
                            {`${el.name} ${el.lastname}`}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.text}>{userData.name}</Text>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 32,
        textAlign: 'center',
    },
});

export default Home;
