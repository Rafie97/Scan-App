import firestore from '@react-native-firebase/firestore';
import User, {Wishlist} from '../Models/UserModels/User';

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

export function snapshotWishlists(
  uid: string,
  callback: (wishlists: Wishlist[]) => void,
) {
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('Wishlists')
    .onSnapshot(async snap => {
      if (snap.empty) {
        console.warn('Error in snapshotWishlists', uid);
        callback([]);
      } else {
        const wishlists = await Promise.all(
          snap.docs.map(doc => {
            return {id: doc.id, items: doc.data().items} as Wishlist;
          }),
        );
        callback(wishlists);
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
