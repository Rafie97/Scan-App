import React, {useState} from 'react';
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

  return (
    <View style={styles.overlayView}>
      <Text
        style={{
          margin: 60,
          fontSize: 20,
          width: 250,
          ...gs.taCenter,
        }}>
        We've texted your phone number, please enter the four-digit code
      </Text>
      <TextInput
        placeholder="Code"
        style={{fontSize: 20, textAlign: 'center'}}
        onChangeText={val => setCode(val)}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={{
          width: 80,
          height: 40,
          borderWidth: 1,
          ...gs.aSelfCenter,
          ...gs.jCenter,
          ...gs.margin20,
        }}
        onPress={() => confirmCode(code)}>
        <Text style={{...gs.aSelfCenter, fontSize: 18}}>Confirm</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 80,
          height: 40,
          borderWidth: 1,
          justifyContent: 'center',
          marginTop: 20,
        }}
        onPress={() => setConfirm(null)}>
        <Text style={{fontSize: 18, alignSelf: 'center'}}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  overlayView: {
    ...gs.flex1,
    ...gs.aCenter,
  },
};
