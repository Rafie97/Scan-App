import {Dispatch} from 'react';
import {
  snapshotItems,
  snapshotRecipes,
} from '../../Connections/ItemsConnection';
import {defaultMap, snapshotMap} from '../../Connections/MapConnection';
import Item from '../../Models/ItemModels/Item';
import {Recipe} from '../../Models/ItemModels/Recipe';
import Map from '../../Models/MapModels/Map';

export async function loadItems(dispatch) {
  try {
    snapshotItems((loadedItems: Item[]) => {
      if (loadedItems.length) {
        dispatch({type: 'SET_ITEMS', payload: loadedItems});
      } else {
        console.log('Error in loadItems');
        dispatch({type: 'SET_ITEMS', payload: []});
        return;
      }
    });
    snapshotRecipes((loadedRecipes: Recipe[]) => {
      if (loadedRecipes.length) {
        dispatch({type: 'SET_RECIPES', payload: loadedRecipes});
      } else {
        console.log('Error in loadRecipes');
        dispatch({type: 'SET_RECIPES', payload: []});
        return;
      }
    });
  } catch (err) {
    console.log('Error loading items from firestore', err);
  }
}

export async function loadMap(dispatch) {
  try {
    snapshotMap((loadedMap: Map) => {
      if (loadedMap) {
        dispatch({type: 'SET_MAP', payload: loadedMap});
      } else {
        console.log('Error in loadMap');
        dispatch({type: 'SET_MAP', payload: defaultMap});
        return;
      }
    });
  } catch (err) {
    console.log('Error loading map from firestore', err);
  }
}
