import {snapshotItems} from '../../Connections/ItemsConnection';
import Item from '../../Models/ItemModels/Item';

//add storeId as param
export function loadItems() {
  console.log('LOAD ITEMS HAPPENED');
  return async (dispatch: any) => {
    snapshotItems((loadedItems: Item[]) => {
      console.log('loadedItems', loadedItems);
      if (loadedItems.length) {
        dispatch({type: 'SET_PRODUCTS', payload: loadedItems});
        console.log('loadedItems', loadedItems);
      } else {
        dispatch({type: 'SET_PRODUCTS', payload: []});
        return;
      }
    });
  };
}
