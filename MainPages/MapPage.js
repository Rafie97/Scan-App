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
import MapBubble from '../Models/Components/MapBubble';

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

      //await setCurrentBubble(matches);
      // const BreakException = {};
      // const hebRef = firestore()
      //   .collection('stores')
      //   .doc('HEB')
      //   .collection('items');
      // await hebRef.get().then(async qSnap => {
      //   try {
      //     qSnap.forEach(async (doc, index) => {
      //       if (doc.data().name.includes(val)) {
      //         const item = new Item(doc);
      //         await setBackSearches([...backSearches, item]);
      //       }
      //     });
      //   } catch (e) {
      //     if (e !== BreakException) throw e;
      //   }
      // });
    }

    if (backSearches) {
      await setMarkedAisles(backSearches);
    }
  }

  function DrawCircles() {
    if (markedAisles) {
      return (
        <View>
          {markedAisles.map(index => {
            return <MapBubble location={wallData.aisles[index].coordinate} />;
          })}
        </View>
      );
    } else {
      return <></>;
    }
  }

  const ProdBubble = ({prods, coord}) => {
    if (currentBubble >= 0) {
      return (
        <View
          style={{
            flexDirection: 'column',
            position: 'relative',
            left: coord.x,
            top: coord.y,
            backgroundColor: 'white',
            maxWidth: 100,
          }}>
          {prods.map(p => {
            const match = items.findIndex(i => {
              return i.docID === p;
            });
            if (match > -1) {
              return <Text>{items[match].name}</Text>;
            } else {
              return <></>;
            }
          })}
        </View>
      );
    } else {
      return <></>;
    }
  };

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
                fontFamily: 'Segoe UI',
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
            alignSelf: 'center',
          }}>
          <DrawCircles />

          <Svg style={styles.mapBox}>
            <Rect
              width={wallData.mapSize.width * scaleFactor}
              height={wallData.mapSize.height * scaleFactor}
              fillOpacity={0.5}
            />

            {currentBubble >= 0 ? (
              <ProdBubble
                prods={wallData.aisles[currentBubble].products}
                coord={wallData.aisles[currentBubble].coordinate}
              />
            ) : (
              <></>
            )}

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
                  <>
                    <G
                      onPress={() => {
                        setCurrentBubble(index);
                      }}>
                      <Circle
                        cx={aisl.coordinate.x * scaleFactor}
                        cy={aisl.coordinate.y * scaleFactor}
                        r={20}
                        stroke="black"
                        strokeWidth={1}
                        fill="rgba(0,0,0,0)"
                      />
                    </G>
                  </>
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

export default MapPage;

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

const styles = StyleSheet.create({
  mapTitleView: {
    marginTop: 40,
    marginBottom: 60,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Segoe UI',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapPageContainer: {
    width: '100%',
    height: '100%',
  },

  searchBarView: {
    alignItems: 'center',
    // marginBottom: 10,
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
    fontFamily: 'Segoe UI',
    fontSize: 20,
    color: 'black',
  },

  fullBackground: {
    flex: 1,
    width: '100%',
  },

  mapBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 0,
    borderColor: 'grey',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
});
