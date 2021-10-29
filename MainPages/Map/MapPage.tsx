import React, {useEffect, useState} from 'react';
import Svg, {Circle} from 'react-native-svg';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

import Item from '../../Models/ItemModels/Item';
import gs from '../../Styles/globalStyles';
import SearchBar from '../../Components/SearchBar';

import Aisle from './MapComponents/Aisle';
import Wall from './MapComponents/Wall';

import WallType from '../../Models/MapModels/Wall';

export default MapPage;

function MapPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [backSearches, setBackSearches] = useState([]);
  const [markedAisles, setMarkedAisles] = useState([]);
  const [currentBubble, setCurrentBubble] = useState(-1);
  const [items, setItems] = useState([]);
  const [scaleFactor, setScale] = useState(1);
  const [wallData, setWallData] = useState<WallType>({
    aisles: [],
    mapSize: {
      height: 300,
      width: 300,
    },
    wallCoordinates: [],
  });

  const navigation = useNavigation();

  useEffect(() => {
    const mapRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('map-data')
      .doc('walls');

    mapRef.get().then(snap => {
      try {
        if (snap.exists) {
          setWallData({
            aisles: snap.data().aisles,
            mapSize: {
              height: snap.data().mapSize.height,
              width: snap.data().mapSize.width,
            },
            wallCoordinates: snap.data().wallCoordinates,
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
  }, []);

  useEffect(() => {
    setItems([]);
    const hebRef = firestore()
      .collection('stores')
      .doc('HEB')
      .collection('items');

    hebRef.onSnapshot(snap => {
      const itemsTemp = [];
      snap.forEach(async doc => {
        const item = new Item(doc);
        itemsTemp.push(item);
      });
      setItems(itemsTemp);
    });
  }, []);

  useEffect(() => {
    const f = (Dimensions.get('window').width - 40) / wallData.mapSize.width;
    setScale(f);
  }, [wallData.mapSize.width]);

  //on dismount
  useEffect(() => {
    return () => setCurrentBubble(-1);
  }, []);

  async function searchItems(val) {
    if (val === '' || val === ' ') {
      setBackSearches([]);
      setMarkedAisles([]);
    } else if (val !== '') {
      await setBackSearches([]);

      const matches = [];
      await wallData.aisles.forEach((a, index) => {
        if (a.products) {
          a.products.map(p => {
            const match = items.findIndex(i => {
              return i.docID === p;
            });
            if (match >= 0 && items[match].name.includes(val)) {
              matches.push(index);
            }
          });
        }
      });
      await setBackSearches(matches);

      if (backSearches) {
        await setMarkedAisles(backSearches);
      }
    }
  }

  return (
    <View style={gs.fullBackground}>
      <View style={[gs.width100, gs.height100]}>
        {!searchFocused && (
          <View>
            <Text style={gs.header}>Map</Text>
          </View>
        )}
        <View
          style={[
            styles.mapBox,
            {
              height: wallData.mapSize.height * scaleFactor,
              width: wallData.mapSize.width * scaleFactor,
            },
          ]}>
          <Svg>
            {wallData.wallCoordinates.map((coordinates, index) => {
              return (
                <Wall
                  scale={scaleFactor}
                  start={coordinates.start}
                  end={coordinates.end}
                  wallData={wallData}
                />
              );
            })}

            {wallData.aisles ? (
              wallData.aisles.map((aisl, index) => {
                return (
                  <Aisle
                    index={index}
                    currentBubble={currentBubble}
                    setCurrentBubble={setCurrentBubble}
                    markedAisles={markedAisles}
                    aisl={aisl}
                    scaleFactor={scaleFactor}
                    wallData={wallData}
                  />
                );
              })
            ) : (
              <></>
            )}
          </Svg>
        </View>
        <SearchBar
          searchItems={searchItems}
          setSearchFocused={setSearchFocused}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapBox: {
    marginHorizontal: 20,
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },
});
