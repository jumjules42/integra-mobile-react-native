import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    AppState,
} from 'react-native';
import moment from 'moment';
import { Divider } from 'react-native-elements';
import logo from '../assets/logo.png';
import firebase from '../configs/firebase.config.js';
import supabase from '../configs/supabase.config.js';

const { width: widthS, height: heightS } = Dimensions.get('screen');

const cardW = widthS * 0.8;
const cardH = cardW * 1.54;

function Home() {
    const [countDown, setCountDown] = React.useState({
        eventDate: moment
            .duration()
            .add({ days: 0, hours: 0, minutes: 1, seconds: 0 }), // add 9 full days, 3 hours, 40 minutes and 50 seconds
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0,
    });
    const [token, setToken] = React.useState(
        Math.floor(Math.random() * (999 - 100)) + 100
    );
    const [userEmail, setUserEmail] = React.useState('');
    const [userData, setUserData] = React.useState([]);
    const [familyGroup, setFamilyGroup] = React.useState([]);

    const updateTimer = () => {
        const x = setInterval(() => {
            let { eventDate } = countDown;

            if (eventDate <= 0) {
                clearInterval(x);
            } else {
                eventDate = eventDate.subtract(1, 's');
                const days = eventDate.days();
                const hours = eventDate.hours();
                const mins = eventDate.minutes();
                const secs = eventDate.seconds();

                setCountDown({
                    days,
                    hours,
                    mins,
                    secs,
                    eventDate,
                });
            }
        }, 1000);
    };

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
        updateTimer();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <FlatList
                data={familyGroup.map((el) => el)}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                renderItem={({ item }) => {
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
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly',
                                        alignItems: 'center',
                                        color: '#fff',
                                        marginTop: 36,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 24,
                                        }}
                                    >
                                        {countDown.mins}:{countDown.secs}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 24,
                                            color: '#fff',
                                        }}
                                    >
                                        TOKEN: {token}
                                    </Text>
                                </View>

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
