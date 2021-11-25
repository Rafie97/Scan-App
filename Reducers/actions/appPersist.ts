import {Dispatch} from 'react';
import {snapshotItems} from '../../Connections/ItemsConnection';
import Item from '../../Models/ItemModels/Item';

export async function loadItems(dispatch) {
  try {
    snapshotItems((loadedItems: Item[]) => {
      if (loadedItems.length) {
        dispatch({type: 'SET_PRODUCTS', payload: loadedItems});
      } else {
        dispatch({type: 'SET_PRODUCTS', payload: []});
        return;
      }
    });
  } catch (err) {
    console.log('Error loading items from firestore', err);
  }
}
