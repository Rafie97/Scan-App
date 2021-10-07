import React, {Component, useEffect, useState} from 'react';

import Svg, {Circle, Line, G} from 'react-native-svg';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Item from '../../Models/Item';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../../Styles/globalStyles';
import Wall from './MapComponents/Wall';
import SearchBar from '../../Components/SearchBar';

export default MapPage;

function MapPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [backSearches, setBackSearches] = useState([]);
  const [markedAisles, setMarkedAisles] = useState([]);
  const [currentBubble, setCurrentBubble] = useState(-1);
  const [items, setItems] = useState([]);
  const [scaleFactor, setScale] = useState(1);
  const [wallData, setWallData] = useState({
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
    const f = Dimensions.get('window').width / wallData.mapSize.width;
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

  const ProdBubble = ({prods, coord}) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          //position: 'relative',
          left: coord.x,
          top: coord.y,
          backgroundColor: '#0073FE',
          maxWidth: 100,
          borderRadius: 10,
        }}>
        {prods.map(prod => {
          const match = items.findIndex(item => {
            return item.docID === prod;
          });

          return (
            match > -1 && (
              <TouchableOpacity
                // activeOpacity={0.6}
                underlayColor="black"
                onPress={() => {
                  navigation.navigate('Promo', {
                    screen: 'PromoItemPage',
                    initial: false,
                    params: {itemIDCallback: items[match], isRecipe: true},
                  });
                }}
                style={{
                  paddingVertical: 7,
                  paddingLeft: 6,
                  fontSize: 15,
                }}>
                <Text style={{color: 'white'}}>{items[match].name}</Text>
              </TouchableOpacity>
            )
          );
        })}
      </View>
    );
  };

  const Aisle = ({index, aisl, wallData, scaleFactor}) => {
    const shiftedX = aisl.coordinate.x - wallData.mapSize.width / 2;
    const shiftedY = -aisl.coordinate.y + wallData.mapSize.height / 2;

    const newX =
      shiftedX * scaleFactor + (wallData.mapSize.width * scaleFactor) / 2;
    const newY =
      shiftedY * scaleFactor + (wallData.mapSize.height * scaleFactor) / 2;
    return (
      <View>
        <Circle
          onPress={() => {
            setCurrentBubble(index);
          }}
          cx={newX}
          cy={newY}
          r={10}
          stroke="black"
          strokeWidth={1}
          fill={markedAisles.includes(index) ? 'red' : 'rgba(0,0,0,0)'}
        />

        {currentBubble === index && (
          <ProdBubble
            prods={wallData.aisles[currentBubble].products}
            coord={{x: newX, y: newY}}
          />
        )}
      </View>
    );
  };

  return (
    <View style={globalStyles.fullBackground}>
      <View style={styles.mapPageContainer}>
        {!searchFocused && (
          <View>
            <Text style={globalStyles.header}>Map</Text>
          </View>
        )}
        <View
          onPress={() => setCurrentBubble(-1)}
          style={[
            styles.mapBox,
            {
              height: wallData.mapSize.height * scaleFactor - 40,
              width: wallData.mapSize.width * scaleFactor - 40,
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
  mapPageContainer: {
    width: '100%',
    height: '100%',
  },

  mapBox: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
});
