import firestore from '@react-native-firebase/firestore';
import Item from '../Models/ItemModels/Item';
import {Recipe} from '../Models/ItemModels/Recipe';

export function snapshotItems(callback: (items: Item[]) => void): () => void {
  return firestore()
    .collection('stores')
    .doc('HEB')
    .collection('items')
    .onSnapshot(async snapshot => {
      if (snapshot.empty) {
        console.warn('Error in snapshotItems');
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
}

export function snapshotRecipes(
  callback: (recipes: Item[]) => void,
): () => void {
  return firestore()
    .collection('stores')
    .doc('HEB')
    .collection('recipes')
    .onSnapshot(async snapshot => {
      if (snapshot.empty) {
        console.warn('Error in snapshotRecipes');
        callback([]);
      }
      const recipes = await Promise.all(
        snapshot.docs.map(async doc => {
          const recipe = new Recipe(doc);
          return recipe;
        }),
      );
      callback(recipes);
    });
}
