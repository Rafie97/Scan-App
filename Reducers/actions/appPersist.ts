import {Dispatch} from 'react';
import {
  snapshotItems,
  snapshotRecipes,
} from '../../Connections/ItemsConnection';
import Item from '../../Models/ItemModels/Item';
import {Recipe} from '../../Models/ItemModels/Recipe';

export async function loadItems(dispatch) {
  try {
    snapshotItems((loadedItems: Item[]) => {
      if (loadedItems.length) {
        dispatch({type: 'SET_ITEMS', payload: loadedItems});
      } else {
        dispatch({type: 'SET_ITEMS', payload: []});
        return;
      }
    });
    snapshotRecipes((loadedRecipes: Recipe[]) => {
      if (loadedRecipes.length) {
        dispatch({type: 'SET_RECIPES', payload: loadedRecipes});
      } else {
        dispatch({type: 'SET_RECIPES', payload: []});
        return;
      }
    });
  } catch (err) {
    console.log('Error loading items from firestore', err);
  }
}
