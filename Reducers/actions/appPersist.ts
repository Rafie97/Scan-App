import {snapshotItems} from '../../Connections/ItemsConnection';
import Item from '../../Models/ItemModels/Item';

//add storeId as param
export const loadItems = () => {
  const loadFromDispatch = async (dispatch: any) => {
    snapshotItems((loadedItems: Item[]) => {
      if (!loadedItems.length) {
        dispatch({type: 'SET_PRODUCTS', payload: []});
        return;
      }
      dispatch({type: 'SET_PRODUCTS', payload: loadedItems});
      console.log('loadedItems', loadedItems);
    });
  };

  return loadFromDispatch;
};
