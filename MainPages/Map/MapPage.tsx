import React, {useEffect, useState} from 'react';
import Svg from 'react-native-svg';
import {View, Text, Dimensions} from 'react-native';
import gs from '../../Styles/globalStyles';
import SearchBar from '../../Components/SearchBar';
import Aisle, {calcCurrCoords} from './MapComponents/Aisle';
import Wall from './MapComponents/Wall';
import {useStore} from '../../Reducers/store';
import ProductBubble from './MapComponents/ProductBubble';

export default MapPage;

function MapPage() {
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [backSearches, setBackSearches] = useState<number[]>([]);
  const [markedAisles, setMarkedAisles] = useState<number[]>([]);
  const [currentBubble, setCurrentBubble] = useState<number>(-1);
  const [scaleFactor, setScale] = useState<number>(1);

  const store = useStore();
  const wallData = store.map;

  const {newX, newY} =
    currentBubble > -1 &&
    calcCurrCoords(
      wallData.aisles[currentBubble],
      wallData.mapSize,
      scaleFactor,
    );

  useEffect(() => {
    const f = (Dimensions.get('window').width - 40) / wallData.mapSize.width;
    setScale(f);
  }, [wallData.mapSize.width]);

  //on dismount
  useEffect(() => {
    return () => setCurrentBubble(-1);
  }, []);

  async function searchItems(val) {
    if (!val || val.match(/\s+/g)) {
      setBackSearches([]);
      setMarkedAisles([]);
      return;
    }
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
    setBackSearches(matches);

    if (backSearches.length) {
      setMarkedAisles(backSearches);
      setCurrentBubble(-1);
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
            {wallData.wallCoordinates.map(coordinates => {
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
                    mapSize={wallData.mapSize}
                  />
                );
              })
            ) : (
              <></>
            )}
          </Svg>
          {currentBubble >= 0 && (
            <ProductBubble
              prods={wallData.aisles[currentBubble].products}
              coord={{x: newX, y: newY}}
              mapSize={wallData.mapSize}
              scaleFactor={scaleFactor}
            />
          )}
        </View>
        <SearchBar
          searchItems={searchItems}
          setSearchFocused={setSearchFocused}
        />
      </View>
    </View>
  );
}

const styles = {
  mapBox: {
    ...gs.bgWhite,
    ...gs.margin20,
    ...gs.radius10,
    ...gs.shadow,
  },
};
