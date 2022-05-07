import firestore from '@react-native-firebase/firestore';
import Item from '../Models/ItemModels/Item';

export default function snapshotCart(
  uid: string,
  callback: (cartItems: Item[]) => void,
): () => void {
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('Cart')
    .onSnapshot(async snapshot => {
      if (snapshot.empty) {
        console.warn('Error in snapshotItems');
        callback([]);
      }
      const cartItems = await Promise.all(
        snapshot.docs.map(async doc => {
          const item = new Item(doc);
          return item;
        }),
      );
      callback(cartItems);
    });
}
