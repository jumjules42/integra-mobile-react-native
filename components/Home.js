import React from 'react';
import BackgroundTimer from 'react-native-background-timer';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { Divider } from 'react-native-elements';
import logo from '../assets/logo.png';
import firebase from '../configs/firebase.config.js';
import supabase from '../configs/supabase.config.js';

const { width: widthS, height: heightS } = Dimensions.get('screen');
const { width: WIDTH } = Dimensions.get('window');

const cardW = widthS * 0.8;
const cardH = cardW * 1.54;

function Home() {
    const [secondsLeft, setSecondsLeft] = React.useState(3601);
    const [timerOn, setTimerOn] = React.useState(false);

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
        if (timerOn) startTimer();
        else BackgroundTimer.stopBackgroundTimer();
        return () => {
            BackgroundTimer.stopBackgroundTimer();
        };
    }, [timerOn]);

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <FlatList
                data={familyGroup.map((el) => el)}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                renderItem={({ item }) => {
                    console.log(item);
                    return (
                        <View
                            style={{
                                width: widthS,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: 10,
                                    width: cardW,
                                    height: cardH,
                                    resizeMode: 'cover',
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: '#fff',
                                    }}
                                >
                                    Nro credencial:
                                </Text>
                                <Text style={styles.text}>
                                    {item.family_group} {item.dni}{' '}
                                    {item.plan_id} {item.id}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: '#fff',
                                    }}
                                >
                                    Nombre y apellido:
                                </Text>
                                <Text style={styles.text}>
                                    {`${item.name} ${item.lastname}`}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: '#fff',
                                    }}
                                >
                                    Plan:
                                </Text>
                                <Text style={styles.text}>
                                    {userData.plans.name}
                                </Text>
                                <Divider />

                                <View style={styles.logoContainer}>
                                    <Image
                                        source={logo}
                                        style={styles.imageLogo}
                                    />
                                    <Text style={styles.text}>
                                        Integra Salud
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    text: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 32,
        textAlign: 'center',
    },
    cardContainer: {
        width: cardW,
        height: cardH,
        backgroundColor: 'green',
    },
    imageLogo: {
        width: 50,
        height: 50,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
});

export default Home;
