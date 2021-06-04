import React from 'react';
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Divider } from 'react-native-elements';

import logo from '../assets/logo.png';

import firebase from '../configs/firebase.config.js';
import supabase from '../configs/supabase.config.js';

const { width: WIDTH } = Dimensions.get('window');

function Home(props) {
    const [userEmail, setUserEmail] = React.useState('');
    const [userData, setUserData] = React.useState([]);
    const [familyGroup, setFamilyGroup] = React.useState([]);

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

    React.useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollView}>
                <View>
                    {familyGroup.map((el, idx) => (
                        <View
                            key={`familiar-${idx}`}
                            style={styles.cardContainer}
                        >
                            <Text style={styles.textDigits}>
                                {el.family_group} {el.dni} {el.plan_id} {el.id}
                            </Text>
                            <Text style={styles.text}>
                                {`${el.name} ${el.lastname}`}
                            </Text>
                            <Text style={styles.text}>
                                {userData.plans.name}
                            </Text>
                            <Divider />
                            <View style={styles.logoContainer}>
                                <Image source={logo} style={styles.imageLogo} />
                                <Text style={styles.text}>Integra Salud</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollView: {
        marginHorizontal: 20,
    },
    text: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 32,
        textAlign: 'center',
    },
    textDigits: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 32,
        textAlign: 'center',
    },
    cardContainer: {
        width: WIDTH - 25,
        backgroundColor: 'green',
        marginBottom: 25,
    },
    imageLogo: {
        width: 50,
        height: 50,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
    },
});

export default Home;
