import {defaultMap, snapshotMap} from '../../Connections/MapConnection';
import Map from '../../Models/MapModels/Map';

export default async function loadMap(dispatch) {
  try {
    snapshotMap((loadedMap: Map) => {
      if (loadedMap) {
        dispatch({type: 'SET_MAP', payload: loadedMap});
      } else {
        console.warn('Error in loadMap');
        dispatch({type: 'SET_MAP', payload: defaultMap});
        return;
      }
    });
  } catch (err) {
    console.warn('Error loading map from firestore', err);
  }
}
