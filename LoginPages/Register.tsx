import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import gs from '../Styles/globalStyles';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useDispatch, useStore } from '../Reducers/store';
import useAuth from '../Auth_Components/AuthContext';

type RegisterProps = {
    setVerificationId: React.Dispatch<React.SetStateAction<string>>;
    setConfirm: React.Dispatch<
      React.SetStateAction<FirebaseAuthTypes.PhoneAuthSnapshot>
    >;
  };

export default function Register({setVerificationId, setConfirm}: RegisterProps) {
    const [areaCode, setAreaCode] = useState('');
    const [firstThree, setFirstThree] = useState('');
    const [lastFour, setLastFour] = useState('');
    const [phone, setPhone] = useState('');

    const [verifying, setVerifying] = useState(false);

    const areaInput = useRef(null);
    const firstThreeInput = useRef(null);
    const lastFourInput = useRef(null);

    const store = useStore();
    const dispatch = useDispatch();
    const authh = useAuth();
    const navigation = useNavigation();

    useEffect(()=>{
        areaInput.current.focus();
    }, [])

     //Handle anonymous sign in
    async function signInAnonymously() {
        try {
            if(store.user === null && authh.isAnonymous){
                dispatch({type:'SET_LOGIN_MODAL', payload:false})
                navigation.navigate('App', {screen: "Promo"});
            }
            else{
                await auth()
                .signInAnonymously()
                .then(() => navigation.navigate('App'))
                .catch(error => console.log('Something went wrong: ', error));
            }
           
        } catch (error) {
            console.log(error);
        }
    }

    // Handle sign in
    async function signInWithPhoneNumber() {
        const fullNum = '+1 ' + areaCode + '-' + firstThree + '-' + lastFour;
        setPhone(fullNum);

        try {
            const authNum = '+1' + areaCode + firstThree + lastFour;
            const confirmation = await auth().verifyPhoneNumber(authNum);

            setConfirm(confirmation);
            setVerificationId(confirmation.verificationId);
            setVerifying(true);
        } catch (error) {
            console.log(error);
        }
    }


    function checkArea(val) {
        let reg = /\d/;
        if (reg.test(val)) {
            setAreaCode(val);
            if (val.length >= 3) {
            firstThreeInput?.current.focus();
            }
        } else if (val.length == 0) {
        } else {
            Alert.alert('Invalid number', 'Please enter only numbers into the input');
        }
    }

    function checkFirst(val) {
        let reg = /\d/;
        let reg1 = /\d/;
        if (reg.test(val)) {
            setFirstThree(val);
            if (val.length >= 3) {
            lastFourInput?.current.focus();
            }
        } else if (val.length == 0) {
            areaInput?.current.focus();
        } else {
            Alert.alert('Invalid number', 'Please enter only numbers into the input');
        }
    }

    function checkLast(val) {
        let reg = /\d/;
        if (reg.test(val)) {
            setLastFour(val);
            if (val.length >= 4) {
            lastFourInput.current.blur();
            }
        } else if (val.length == 0) {
            firstThreeInput.current.focus();
        } else {
            Alert.alert('Invalid number', 'Please enter only numbers into the input');
        }
    }
    return (
        <View style={styles.overlayView}>
            <View style={{width: 250,  ...gs.margin20}}>
                <Text
                    style={styles.loginTitle}>
                    Sign-in/Sign-up with a phone number
                </Text>
            </View>

            {verifying ? <Text>Sending Code...</Text> : <View />}

            <View
            style={{
                ...gs.flexRow,
                // ...gs.margin20,
                marginRight: 20,
                ...gs.aCenter,
            }}>
                <Text style={styles.textBetweenNumber}>+1</Text>
                <TextInput
                    style={styles.phoneInput}
                    autoCompleteType="off"
                    ref={areaInput}
                    placeholder="(999)"
                    onChangeText={val => checkArea(val)}
                    keyboardType="phone-pad"
                />
                <Text style={styles.textBetweenNumber}>-</Text>
                <TextInput
                    style={styles.phoneInput}
                    autoCompleteType="off"
                    ref={firstThreeInput}
                    placeholder="123"
                    onChangeText={val => checkFirst(val)}
                    keyboardType="phone-pad"
                />
                <Text style={styles.textBetweenNumber}>-</Text>
                <TextInput
                    style={styles.phoneInput}
                    autoCompleteType="off"
                    ref={lastFourInput}
                    placeholder="4567"
                    onChangeText={val => checkLast(val)}
                    keyboardType="phone-pad"
                />
            </View>

            <TouchableOpacity
            style={styles.enterTouchable} onPress={() => signInWithPhoneNumber()}>
                <Text style={styles.enterText}>
                    Enter
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={gs.margin20}
                activeOpacity={0.6}
                onPress={() => signInAnonymously()}>
                <Text style={styles.anonymousText}>
                    {store.user=== null ? "Or return to promotions":"Or sign in anonymously with view-only access"} 
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  overlayView: {
    ...gs.flex1,
    ...gs.aCenter,
  },

  loginTitle: {
    fontSize: 20,
    ...gs.bold, 
    ...gs.taCenter,
    ...gs.width100
  },

  phoneInput: {
    height: 55,
    fontSize: 25,
    borderRadius: 10,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  textBetweenNumber: {
    fontSize: 25,
    marginLeft: 5,
    marginRight: 5,
  },

  enterTouchable: {
    width: 80,
    height: 40,
    ...gs.bgBlue,
    ...gs.jCenter,
    ...gs.margin20,
    ...gs.radius10,
  },
  enterText:{
      fontSize: 18,
      ...gs.taCenter,
      ...gs.white
  },
  anonymousText: {
    fontSize: 16,
    ...gs.blue,
  }
});
