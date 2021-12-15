import React, {useEffect, useRef, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
import gs from '../Styles/globalStyles';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import { useDispatch } from '../Reducers/store';

type CodeConfirmationProps = {
  verificationId: string;
  setConfirm: React.Dispatch<
    React.SetStateAction<FirebaseAuthTypes.PhoneAuthSnapshot>
  >;
};

export default function CodeConfirmation({
  verificationId,
  setConfirm,
}: CodeConfirmationProps) {
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  const codeInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    codeInputRef.current?.focus();
  }, []);

  async function confirmCode(code) {
    try {
      const cred = auth.PhoneAuthProvider.credential(verificationId, code);
      await auth().signInWithCredential(cred);
      dispatch({type: 'SET_LOGIN_MODAL', payload: false});
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

  return (
    <View style={styles.overlayView}>
      <Text style={styles.codeTitle}>
        We've texted your phone with a four-digit code
      </Text>
      <TextInput
        ref={codeInputRef}
        placeholder="Code"
        style={styles.codeInput}
        onChangeText={val => setCode(val)}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={styles.confirmTouchable}
        onPress={() => confirmCode(code)}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.confirmTouchable, gs.margin20]}
        onPress={() => setConfirm(null)}>
        <Text style={styles.confirmText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  overlayView: {
    ...gs.flex1,
    ...gs.aCenter,
  },
  codeTitle: {
    fontSize: 20,
    width: 300,
    ...gs.bold,
    ...gs.taCenter,
  },
  codeInput: {fontSize: 20, ...gs.taCenter, ...gs.margin20},
  confirmTouchable: {
    width: 80,
    height: 40,
    ...gs.bgBlue,
    ...gs.jCenter,
    ...gs.radius10,
  },
  confirmText:{
    fontSize: 18,
    ...gs.taCenter,
    ...gs.white
},
};
