import React, {useEffect, useState} from 'react';
import Svg from 'react-native-svg';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import Map from '../../Models/MapModels/Map';
import gs from '../../Styles/globalStyles';

import SearchBar from '../../Components/SearchBar';
import Aisle from './MapComponents/Aisle';
import Wall from './MapComponents/Wall';

import {useStore} from '../../Reducers/store';
import {defaultMap} from '../../Connections/MapConnection';

export default MapPage;

function MapPage() {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [backSearches, setBackSearches] = useState<number[]>([]);
  const [markedAisles, setMarkedAisles] = useState<number[]>([]);
  const [currentBubble, setCurrentBubble] = useState<number>(-1);
  const [scaleFactor, setScale] = useState<number>(1);

  const store = useStore();
  const wallData = store.map;
  const navigation = useNavigation();

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
            const match = store.items.findIndex(i => {
              return i.docID === p;
            });
            if (match >= 0 && store.items[match].name.includes(val)) {
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
        {!searchFocused && <Text style={gs.header}>Map</Text>}
        <View
          style={[
            styles.mapBox,
            {
              height: wallData.mapSize.height * scaleFactor,
              width: wallData.mapSize.width * scaleFactor,
            },
          ]}>
          <Svg
            onPress={() => {
              setCurrentBubble(-1);
            }}>
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
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },
});
