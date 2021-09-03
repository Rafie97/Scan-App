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
import Item from '../Models/Item';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';

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
  });

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
          backgroundColor: 'white',
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
                <Text>{items[match].name}</Text>
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
        {/* <BlurView blurType="light" blurAmount={1}> */}
        <View
          onPress={() => setCurrentBubble(-1)}
          style={{
            height: wallData.mapSize.height * scaleFactor,
            width: wallData.mapSize.width * scaleFactor,
          }}>
          <Svg style={styles.mapBox}>
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
        {/* </BlurView> */}

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

const Wall = ({start, end, scale = 1, wallData}) => {
  const shiftedStartX = start.x - wallData.mapSize.width / 2;
  const shiftedStartY = -start.y + wallData.mapSize.height / 2;

  const newStartX =
    shiftedStartX * scale + (wallData.mapSize.width * scale) / 2;
  const newStartY =
    shiftedStartY * scale + (wallData.mapSize.height * scale) / 2;

  const shiftedEndX = end.x - wallData.mapSize.width / 2;
  const shiftedEndY = -end.y + wallData.mapSize.height / 2;

  const newEndX = shiftedEndX * scale + (wallData.mapSize.width * scale) / 2;
  const newEndY = shiftedEndY * scale + (wallData.mapSize.height * scale) / 2;

  return (
    <G>
      <Line
        x1={newStartX}
        y1={newStartY}
        x2={newEndX}
        y2={newEndY}
        stroke="black"
        strokeWidth={2}
      />

      <Circle
        cx={newStartX}
        cy={newStartY}
        r={2}
        stroke="white"
        strokeWidth={1}
        fill="#283d6d"
      />

      <Circle
        cx={newEndX}
        cy={newEndY}
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
