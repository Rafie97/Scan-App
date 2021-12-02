import firestore from '@react-native-firebase/firestore';
import useAuth from '../Auth_Components/AuthContext';
import User from '../Models/UserModels/User';

export function snapshotUser(callback: (user: User) => void): () => void {
  const uid = useAuth().currentUser.uid;
  return firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(async snap => {
      if (snap.exists) {
        const user = {id: uid, name: snap.data().name} as User;
        callback(user);
      } else {
        console.log('Error in snapshotUser');
        callback(null);
      }
    });
}
