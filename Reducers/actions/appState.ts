import Item from '../../Models/ItemModels/Item';

export const setProducts = (products: Item[]) => ({
  type: 'SET_PRODUCTS',
  payload: products,
});
