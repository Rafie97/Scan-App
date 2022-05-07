import snapshotCart from '../../Connections/CartConnection';
import Item from '../../Models/ItemModels/Item';

export default async function loadCart(dispatch, uid) {
  try {
    snapshotCart(uid, (loadedItems: Item[]) => {
      if (loadedItems.length) {
        dispatch({type: 'SET_CART', payload: loadedItems});
      } else {
        console.warn('Error in loadItems');
        dispatch({type: 'SET_CART', payload: []});
        return;
      }
    });
  } catch (err) {
    console.warn('Error loading items from firestore', err);
  }
}
