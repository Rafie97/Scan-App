import {useCallback} from 'react';
import {Recipe} from '../Models/Recipe';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';

export function snapshotItems(callback: (items: Item[]) => void): () => void {
  const ItemsSnap = firestore()
    .collection('stores')
    .doc('HEB')
    .collection('items')
    .onSnapshot(async snapshot => {
      if (snapshot.empty) {
        callback([]);
      }
      const items = await Promise.all(
        snapshot.docs.map(async doc => {
          const item = new Item(doc);
          return item;
        }),
      );
      callback(items);
    });

  return ItemsSnap;
}
