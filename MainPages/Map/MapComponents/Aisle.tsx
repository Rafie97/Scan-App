import React from 'react';
import {View} from 'react-native';
import {Circle} from 'react-native-svg';
import gs from '../../../Styles/globalStyles';
import ProdBubble from './ProdBubble';
import Aisle from '../../../Models/MapModels/Aisle';
import Map from '../../../Models/MapModels/Map';

type AisleProps = {
  aisl: Aisle;
  currentBubble: number;
  setCurrentBubble: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  markedAisles: number[];
  scaleFactor: number;
  wallData: Map;
};

export default function AisleComponent({
  aisl,
  currentBubble,
  setCurrentBubble,
  index,
  markedAisles,
  scaleFactor,
  wallData,
}) {
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
        strokeWidth={0}
        fill={markedAisles.includes(index) ? '#0073FE' : 'rgba(0,0,0,0)'}
      />

      <Circle cx={newX} cy={newY} r={2} fill="#777" />

      {currentBubble === index && (
        <ProdBubble
          prods={wallData.aisles[currentBubble].products}
          coord={{x: newX, y: newY}}
        />
      )}
    </View>
  );
}
