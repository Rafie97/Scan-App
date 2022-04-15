import React from 'react';
import {View} from 'react-native';
import {Circle, G} from 'react-native-svg';
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
  currentBubble,
  setCurrentBubble,
  index,
  markedAisles,
  scaleFactor,
  mapSize,
}: AisleProps) {
  const {newX, newY} = calcCurrCoords(aisl, mapSize, scaleFactor);
  const marked = markedAisles.includes(index) || currentBubble === index;
  return (
    <G>
      <Circle cx={newX} cy={newY} r={2} fill="#777" />
      <Circle
        onPress={() => {
          setCurrentBubble(index);
        }}
        cx={newX}
        cy={newY}
        r={10}
        fill={marked ? '#0073FE' : 'rgba(0,0,0,0)'}
      />
    </G>
  );
}

export function calcCurrCoords(aisl, mapSize, scaleFactor) {
  const shiftedX = aisl.coordinate.x - mapSize.width / 2;
  const shiftedY = -aisl.coordinate.y + mapSize.height / 2;

  const newX = shiftedX * scaleFactor + (mapSize.width * scaleFactor) / 2;
  const newY = shiftedY * scaleFactor + (mapSize.height * scaleFactor) / 2;

  return {newX, newY};
}
