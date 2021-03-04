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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Item from '../Models/Item';
import {FlatList} from 'react-native-gesture-handler';
import MapBubble from '../Models/Components/MapBubble';

function MapPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [backSearches, setBackSearches] = useState([]);
  const [markedAisles, setMarkedAisles] = useState([]);
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

    mapRef.onSnapshot(async snap => {
      console.log(snap.data());
      await setWallData({...snap.data()});
    });
  }, []);

  async function searchItems(val) {
    if (val === '' || val === ' ') {
      await setBackSearches([]);
    } else if (val !== '') {
      await setBackSearches([]);
      const BreakException = {};
      const hebRef = firestore()
        .collection('stores')
        .doc('HEB')
        .collection('items');
      await hebRef.get().then(async qSnap => {
        try {
          qSnap.forEach(async (doc, index) => {
            if (doc.data().name.includes(val)) {
              const item = new Item(doc);
              await setBackSearches([...backSearches, item]);
            }
          });
        } catch (e) {
          if (e !== BreakException) throw e;
        }
      });
    }

    if (backSearches) {
      console.log(backSearches.length);
      const aislesTemp = [];
      backSearches.forEach(el => {
        aislesTemp.push(el.location);
      });
      setMarkedAisles(aislesTemp);
    }
  }

  function drawCircles() {
    if (markedAisles) {
      return markedAisles.map(function(loc) {
        return <MapBubble location={loc} />;
      });
    }
  }

  return (
    <ImageBackground
      source={require('../res/grad_3.png')}
      style={styles.fullBackground}>
      <View style={styles.mapPageContainer}>
        <View style={styles.mapTitleView}>
          <Text
            style={{fontSize: 24, fontFamily: 'Segoe UI', textAlign: 'center'}}>
            Map
          </Text>
        </View>

        <View style={styles.mapView}>
          {markedAisles ? drawCircles() : {}}

          <Svg height="75%" width="100%" style={{backgroundColor: 'purple'}}>
            <Rect
              width={wallData.mapSize.width}
              height={wallData.mapSize.width}
              stroke="red"
              strokeWidth="2"
              fill="yellow"
            />
            {wallData.aisles ? (
              wallData.aisles.map((coordinate, index) => {
                return (
                  <>
                    <G>
                      <Circle
                        cx={coordinate.x}
                        cy={coordinate.y}
                        r={3}
                        stroke="black"
                        strokeWidth={1}
                        fill="white"
                      />
                    </G>
                  </>
                );
              })
            ) : (
              <></>
            )}

            {wallData.wallCoordinates.map((coordinates, index) => {
              return (
                <Wall
                  start={coordinates.start}
                  end={coordinates.end}
                  key={index}
                />
              );
            })}
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
            backgroundColor="#a2a3a1"
            placeholderTextColor="#545454"
            placeholder="Search this store"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

export default MapPage;

const Wall = ({start, end}) => {
  return (
    <G>
      <Line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="black"
        strokeWidth={2}
      />

      <Circle
        cx={start.x}
        cy={start.y}
        r={2}
        stroke="white"
        strokeWidth={1}
        fill="#283d6d"
      />

      <Circle
        cx={end.x}
        cy={end.y}
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

  mapView: {
    flex: 4,
    justifyContent: 'center',
  },

  searchBarView: {
    alignItems: 'center',
    fontFamily: 'Segoe UI',
    marginBottom: 10,
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
});
