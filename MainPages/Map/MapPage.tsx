import React, {useEffect, useState} from 'react';
import Svg, {Circle} from 'react-native-svg';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

import Item from '../../Models/ItemModels/Item';
import gs from '../../Styles/globalStyles';
import SearchBar from '../../Components/SearchBar';
import Wall from './MapComponents/Wall';

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

  const ProdBubble = ({prods, coord}) => {
    return (
      <View
        style={[
          gs.flexColumn,
          gs.bgBlue,
          gs.radius10,
          {
            left: coord.x,
            top: coord.y,
            maxWidth: 100,
          },
        ]}>
        {prods.map(prod => {
          const match = items.findIndex(item => {
            return item.docID === prod;
          });

          return (
            match > -1 && (
              <TouchableOpacity
                // activeOpacity={0.6}
                // underlayColor="black"
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
          fill={markedAisles.includes(index) ? '#0073FE' : 'rgba(0,0,0,0)'}
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
            gs.bgWhite,
            gs.margin20,
            gs.radius10,
            gs.shadow,
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
  },
});
