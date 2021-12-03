import snapshotUser from '../../Connections/UserConnection';
import User from '../../Models/UserModels/User';

export async function loadUser(dispatch, uid) {
  try {
    snapshotUser(uid, (loadedUser: User) => {
      if (loadedUser) {
        console.log('User loading...');
        dispatch({
          type: 'SET_USER',
          payload: loadedUser,
        });
      } else {
        console.log('Error in loadUser');
        dispatch({
          type: 'SET_USER',
          payload: null,
        });
        return;
      }
    });
  } catch (err) {
    console.log('Error loading user from firestore');
  }
}
