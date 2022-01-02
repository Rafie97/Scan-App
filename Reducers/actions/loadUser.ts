import snapshotUser, {
  loadFamily,
  snapshotReceipts,
  snapshotWishlists,
} from '../../Connections/AccountConnection';
import Receipt from '../../Models/CartModels/Receipt';
import User, {Wishlist} from '../../Models/UserModels/User';

export async function loadUser(dispatch, uid) {
  try {
    snapshotUser(uid, (loadedUser: User) => {
      if (loadedUser) {
        loadedUser.family = loadFamily(uid);
        dispatch({
          type: 'SET_USER',
          payload: loadedUser,
        });
      } else {
        console.warn('Error in loadUser');
        dispatch({
          type: 'SET_USER',
          payload: null,
        });
        return;
      }
    });

    snapshotWishlists(uid, (loadedWishlists: Wishlist[]) => {
      if (loadedWishlists.length) {
        dispatch({
          type: 'SET_WISHLISTS',
          payload: loadedWishlists,
        });
      } else {
        console.warn('Error in loading wishlists');
        dispatch({
          type: 'SET_WISHLISTS',
          payload: [],
        });
      }
    });

    snapshotReceipts(uid, (loadedReceipts: Receipt[]) => {
      if (loadedReceipts.length) {
        dispatch({
          type: 'SET_RECEIPTS',
          payload: loadedReceipts,
        });
      } else {
        console.warn('Error in loading receipts');
        dispatch({
          type: 'SET_RECEIPTS',
          payload: [],
        });
      }
    });
  } catch (err) {
    console.warn('Error loading user from firestore');
  }
}
