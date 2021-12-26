import firestore from '@react-native-firebase/firestore';
import {CartItem} from '../Models/ItemModels/CartItem';
import Item from '../Models/ItemModels/Item';

export default function snapshotCart(
  uid: string,
  callback: (cartItems: CartItem[]) => void,
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
          const item = new Item(doc) as CartItem;
          item.quantity = doc.data().quantity;
          return item;
        }),
      );
      callback(cartItems);
    });
}
