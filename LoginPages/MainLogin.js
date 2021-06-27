import React, {Component, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

function MainLogin() {
  // If null, no SMS has been sent
  const [confirmation, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [areaCode, setAreaCode] = useState('');
  const [firstThree, setFirstThree] = useState('');
  const [lastFour, setLastFour] = useState('');

  const [phone, setPhone] = useState('');
  const [verificationId, setVId] = useState('');
  const [verifying, setVerifying] = useState(false);

  const areaInput = useRef();
  const firstThreeInput = useRef();
  const lastFourInput = useRef();

  const navigation = useNavigation();

  //Handle anonymous sign in
  async function signInAnonymously() {
    try {
      await auth()
        .signInAnonymously()
        .then(() => navigation.navigate('App'))
        .catch(error => console.log('Something went wrong: ', error));
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
      console.log(authNum);

      const confirmation = await auth().verifyPhoneNumber(authNum);

      setConfirm(confirmation);
      setVId(confirmation.verificationId);
      setVerifying(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function confirmCode(code) {
    try {
      const cred = auth.PhoneAuthProvider.credential(verificationId, code);
      await auth().signInWithCredential(cred);

      navigation.navigate('App');
    } catch (error) {
      if (
        error.toString().startsWith('Error: [auth/invalid-verification-code]')
      ) {
        console.log('Invalid code');
      } else {
        console.log('Some other error: ' + error);
      }
    }
  }

  function checkArea(val) {
    let reg = /\d/;
    if (reg.test(val)) {
      setAreaCode(val);
      if (val.length >= 3) {
        firstThreeInput.current.focus();
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
        lastFourInput.current.focus();
      }
    } else if (val.length == 0) {
      areaInput.current.focus();
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

  if (confirmation) {
    return (
      <ImageBackground
        source={require('../res/login-background-crop.png')}
        style={styles.fullBackground}>
        <View style={styles.overlayView}>
          <Text
            style={{
              color: 'white',
              margin: 60,
              fontSize: 20,
              width: 250,
              textAlign: 'center',
            }}>
            We've texted your phone number, please enter the four-digit code
          </Text>
          <TextInput
            placeholder="Code"
            style={{fontSize: 20, textAlign: 'center'}}
            backgroundColor="grey"
            width={100}
            onChangeText={val => setCode(val)}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              borderColor: 'white',
              width: 80,
              height: 40,
              borderWidth: 1,
              justifyContent: 'center',
              marginTop: 20,
            }}
            onPress={() => confirmCode(code)}>
            <Text style={{color: 'white', fontSize: 18, alignSelf: 'center'}}>
              Confirm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderColor: 'white',
              width: 80,
              height: 40,
              borderWidth: 1,
              justifyContent: 'center',
              marginTop: 20,
            }}
            onPress={() => setConfirm(false)}>
            <Text style={{color: 'white', fontSize: 18, alignSelf: 'center'}}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../res/login-background-crop.png')}
      style={styles.fullBackground}>
      <View style={styles.overlayView}>
        <View style={{width: 250, marginTop: 80, marginBottom: 100}}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              marginBottom: 0,
              textAlign: 'center',
            }}>
            Please signin/signup with your phone number
          </Text>
        </View>

        {verifying ? <Text>Sending Code...</Text> : <View />}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Text style={styles.textBetweenNumber}>+1</Text>
          <TextInput
            style={styles.phoneInput}
            autoCompleteType="off"
            ref={areaInput}
            placeholder="(999)"
            backgroundColor="grey"
            onChangeText={val => checkArea(val)}
            keyboardType="phone-pad"
          />
          <Text style={styles.textBetweenNumber}>-</Text>
          <TextInput
            style={styles.phoneInput}
            autoCompleteType="off"
            ref={firstThreeInput}
            placeholder="123"
            backgroundColor="grey"
            onChangeText={val => checkFirst(val)}
            keyboardType="phone-pad"
          />
          <Text style={styles.textBetweenNumber}>-</Text>
          <TextInput
            style={styles.phoneInput}
            autoCompleteType="off"
            ref={lastFourInput}
            placeholder="4567"
            backgroundColor="grey"
            onChangeText={val => checkLast(val)}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={{
            borderColor: 'white',
            width: 80,
            height: 40,
            borderWidth: 1,
            justifyContent: 'center',
            marginTop: 20,
            marginLeft: 20,
          }}
          onPress={() => signInWithPhoneNumber()}>
          <Text style={{color: 'white', fontSize: 18, alignSelf: 'center'}}>
            Enter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginTop: 100}}
          activeOpacity={0.6}
          onPress={() => signInAnonymously()}>
          <Text style={{color: '#5D87CA', fontSize: 16, alignSelf: 'flex-end'}}>
            Or sign in anonymously with view-only access
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default MainLogin;

const styles = StyleSheet.create({
  fullBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayView: {
    flex: 1,
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  headerText: {
    fontSize: 30,
    paddingBottom: 50,
    color: 'white',
    opacity: 1,
  },
  phoneEnter: {
    width: '100%',
    height: 20,
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
    color: 'white',
    marginLeft: 5,
    marginRight: 5,
  },
});
