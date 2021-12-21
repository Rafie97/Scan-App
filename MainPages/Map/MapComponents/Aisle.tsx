import React from 'react';
import {View} from 'react-native';
import {Circle} from 'react-native-svg';
import gs from '../../../Styles/globalStyles';
import ProdBubble from './ProdBubble';
import Aisle from '../../../Models/MapModels/Aisle';
import Map, {MapSize} from '../../../Models/MapModels/Map';

type AisleProps = {
  aisl: Aisle;
  currentBubble: number;
  setCurrentBubble: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  markedAisles: number[];
  scaleFactor: number;
  mapSize: MapSize;
};

export default function AisleComponent({
  aisl,
  setCurrentBubble,
  index,
  markedAisles,
  scaleFactor,
  mapSize,
}: AisleProps) {
  const {newX, newY} = calcCurrCoords(aisl, mapSize, scaleFactor);
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
    </View>
  );
}

export function calcCurrCoords(aisl, mapSize, scaleFactor) {
  const shiftedX = aisl.coordinate.x - mapSize.width / 2;
  const shiftedY = -aisl.coordinate.y + mapSize.height / 2;

  const newX = shiftedX * scaleFactor + (mapSize.width * scaleFactor) / 2;
  const newY = shiftedY * scaleFactor + (mapSize.height * scaleFactor) / 2;

  return {newX, newY};
}
