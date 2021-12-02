import firestore from '@react-native-firebase/firestore';
import Item from '../Models/ItemModels/Item';
import Map from '../Models/MapModels/Map';

export const defaultMap: Map = {
  aisles: [],
  mapSize: {
    height: 300,
    width: 300,
  },
  wallCoordinates: [],
};

export function snapshotMap(callback: (map: Map) => void): () => void {
  return firestore()
    .collection('stores')
    .doc('HEB')
    .collection('map-data')
    .doc('map')
    .onSnapshot(async snap => {
      if (snap.exists) {
        const wallData = snap.data() as Map;
        callback(wallData);
      } else {
        console.log('Error in snapshotMap');
        callback(defaultMap);
      }
    });
}
