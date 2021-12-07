import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React from 'react';
import {View} from 'react-native';
import gs from '../Styles/globalStyles';
import LoginModal from './LoginModal';

export default function MainLogin() {
  return (
    <View style={gs.fullBackground}>
      <LoginModal visible={true} />
    </View>
  );
}
