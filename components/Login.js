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
import bgLogin from '../assets/bgLogin.png';
import logo from '../assets/logo.png';
import Icon from 'react-native-vector-icons/Ionicons';

import firebase from '../configs/firebase.config.js';
import supabase from '../configs/supabase.config.js';

const { width: WIDTH } = Dimensions.get('window');

export default function Login() {
    const [showPass, setShowPass] = React.useState(false);
    const [press, setPress] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [input, setInput] = React.useState({ dni: '', pass: '' });

    const handleShowPass = () => {
        if (!press) {
            setShowPass(false);
            setPress(true);
        } else {
            setShowPass(true);
            setPress(false);
        }
    };

    const handleLogin = async () => {
        try {
            const { data: mailUser } = await supabase
                .from('users')
                .select('email, dni, role, account, avatar_url')
                .match({ role: 'affiliate', dni: input.dni });
            const successInfo = await firebase.auth.signInWithEmailAndPassword(
                mailUser[0].email,
                input.pass
            );
            console.log(successInfo.user.uid);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <ImageBackground source={bgLogin} style={styles.backgroundContainer}>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.logoText}>Iniciar Sesion</Text>
            </View>

            <View style={styles.inputContainer}>
                <Icon
                    name={'ios-person-outline'}
                    size={28}
                    color={'rgba(255, 255, 255, 0.7)'}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder={'N° de documento'}
                    placeholderTextColor='rgba(255, 255, 255, 0.7)'
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => setInput({ ...input, dni: text })}
                    keyboardType='number-pad'
                    maxLength={8}
                />
            </View>

            <View style={styles.inputContainer}>
                <Icon
                    name={'ios-lock-closed-outline'}
                    size={28}
                    color={'rgba(255, 255, 255, 0.7)'}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder={'Contraseña'}
                    secureTextEntry={showPass}
                    placeholderTextColor='rgba(255, 255, 255, 0.7)'
                    underlineColorAndroid='transparent'
                    onChangeText={(text) => setInput({ ...input, pass: text })}
                />
                <TouchableOpacity
                    style={styles.btnEye}
                    onPress={handleShowPass}
                >
                    <Icon
                        name={
                            !press ? 'ios-eye-outline' : 'ios-eye-off-outline'
                        }
                        size={26}
                        color={'rgba(255, 255, 255, 0.7)'}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnLogin}>
                <Text style={styles.text} onPress={handleLogin}>
                    Iniciar Sesion
                </Text>
            </TouchableOpacity>
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 150,
        height: 150,
    },
    logoText: {
        color: 'white',
        fontSize: 20,
        marginTop: 10,
        opacity: 0.5,
    },
    input: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        color: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 25,
    },
    inputIcon: {
        position: 'absolute',
        top: 10,
        left: 37,
    },
    inputContainer: {
        marginTop: 10,
    },
    btnEye: {
        position: 'absolute',
        top: 10,
        right: 37,
    },
    btnLogin: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        backgroundColor: 'green',
        marginTop: 20,
        justifyContent: 'center',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        textAlign: 'center',
    },
});
