import firestore from '@react-native-firebase/firestore';
import User from '../Models/UserModels/User';

export default function snapshotUser(
  uid: string,
  callback: (user: User) => void,
): () => void {
  return firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(async snap => {
      if (snap.exists) {
        const user = {id: uid, name: snap.data().name} as User;
        callback(user);
      } else {
        console.warn('Error in snapshotUser', uid);
        callback(null);
      }
    });
}

export function loadFamily(uid): string[] {
  const famRef = firestore()
    .collection('users')
    .doc(uid)
    .collection('Family');

  let newNames: string[] = [];

  famRef
    .get()
    .then(snap => {
      snap.forEach(async doc => {
        newNames.push(doc.data().name);
      });
    })
    .catch(err => {
      console.warn('Error in loadFamily: ', err);
    });

  return newNames;
}
