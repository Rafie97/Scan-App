import React from 'react';
import {Circle, Line, G} from 'react-native-svg';

export default function Wall({start, end, scale = 1, wallData}) {
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
}
