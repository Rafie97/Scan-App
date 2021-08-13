import React, {Component, useEffect, useState} from 'react';

import Svg, {
  Circle,
  Path,
  Line,
  G,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Pattern,
} from 'react-native-svg';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';

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
    console.log('WINDOW ', Dimensions.get('window').width);
    console.log('MAP SIZE ', wallData.mapSize.width);
    const f = Dimensions.get('window').width / (wallData.mapSize.width * 1.05);
    setScale(f);
  }, [wallData.mapSize.width]);

  async function searchItems(val) {
    if (val === '' || val === ' ') {
      await setBackSearches([]);
    } else if (val !== '') {
      await setBackSearches([]);

      const matches = [];
      await wallData.aisles.forEach((a, index) => {
        if (a.products) {
          a.products.map(p => {
            const match = items.findIndex(i => {
              return i.docID === p;
            });
            if (match > -1) {
              if (items[match].name.includes(val)) {
                matches.push(index);
              }
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
    <ImageBackground
      source={require('../res/grad_3.png')}
      style={styles.fullBackground}>
      <View style={styles.mapPageContainer}>
        {searchFocused ? (
          <></>
        ) : (
          <View style={styles.mapTitleView}>
            <Text
              style={{
                fontSize: 24,
                textAlign: 'center',
              }}>
              Map
            </Text>
          </View>
        )}

        <View
          style={{
            height: wallData.mapSize.height * scaleFactor,
            width: wallData.mapSize.width * scaleFactor,
            backgroundColor: 'yellow',
          }}>
          <Svg style={styles.mapBox}>
            {wallData.wallCoordinates.map((coordinates, index) => {
              return (
                <Wall
                  scale={scaleFactor}
                  start={coordinates.start}
                  end={coordinates.end}
                  key={index}
                />
              );
            })}

            {wallData.aisles ? (
              wallData.aisles.map((aisl, index) => {
                return (
                  <Aisle
                    onPress={() => {
                      console.log(
                        'Coords',
                        wallData.aisles[index].coordinate.x,
                        wallData.aisles[index].coordinate.y,
                      );
                      // setCurrentBubble(index);
                    }}
                    aisl={aisl}
                    scaleFactor={scaleFactor}
                  />
                );
              })
            ) : (
              <></>
            )}
          </Svg>
        </View>

        <View style={styles.searchBarView}>
          <TextInput
            style={styles.searchInput}
            onChangeText={val => {
              searchItems(val);
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholderTextColor="#545454"
            placeholder="Search this store"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const Wall = ({start, end, scale = 1}) => {
  return (
    <G>
      <Line
        x1={scale * start.x}
        y1={scale * start.y}
        x2={scale * end.x}
        y2={scale * end.y}
        stroke="black"
        strokeWidth={2}
      />

      <Circle
        cx={scale * start.x}
        cy={scale * start.y}
        r={2}
        stroke="white"
        strokeWidth={1}
        fill="#283d6d"
      />

      <Circle
        cx={scale * end.x}
        cy={scale * end.y}
        r={2}
        stroke="white"
        strokeWidth={1}
        fill="#283d6d"
      />
    </G>
  );
};

const Aisle = ({aisl, scaleFactor, onPress}) => {
  console.log(scaleFactor);
  return (
    <Circle
      onPress={onPress}
      cx={aisl.coordinate.x * scaleFactor * 2 - 100 / scaleFactor} // need to scale and subtract. Decide how to compare phone map size and admin map size
      cy={aisl.coordinate.y * scaleFactor * 2 - 100 / scaleFactor}
      r={10}
      stroke="black"
      strokeWidth={1}
      fill="rgba(0,0,0,0)"
    />
  );
};

const styles = StyleSheet.create({
  mapTitleView: {
    marginTop: 40,
    marginBottom: 60,
    textAlign: 'center',
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapPageContainer: {
    width: '100%',
    height: '100%',
  },

  searchBarView: {
    alignItems: 'center',
    flex: 1,
  },

  searchInput: {
    width: '65%',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 25,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#545454',
    fontSize: 20,
    color: 'black',
  },

  fullBackground: {
    flex: 1,
    width: '100%',
  },

  mapBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', //rgba(255, 255, 255, 0.3)
    borderWidth: 0,
    borderColor: 'grey',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
});
