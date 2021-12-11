import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Modal, View} from 'react-native';
import CodeConfirmation from './CodeConfirmation';
import Register from './Register';
import gs from '../Styles/globalStyles';
import {useStore} from '../Reducers/store';

type Props = {
  visible: boolean;
};

export default function LoginModal({visible}: Props) {
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.PhoneAuthSnapshot>(
    null,
  );
  const [verificationId, setVerificationId] = useState('');

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {confirm ? (
            <CodeConfirmation
              verificationId={verificationId}
              setConfirm={setConfirm}
            />
          ) : (
            <Register
              setVerificationId={setVerificationId}
              setConfirm={setConfirm}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  centeredView: {
    ...gs.aCenter,
    ...gs.flex1,
    ...gs.jCenter,
  },
  modalView: {
    minHeight: 350,
    maxHeight: '50%',
    ...gs.aCenter,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.padding20,
    ...gs.radius10,
    ...gs.shadow,
  },
};
