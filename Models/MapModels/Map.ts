import Aisle from './Aisle';
import {WallCoordinate} from './Coordinate';

export default interface Map {
  aisles: Aisle[];
  mapSize: MapSize;
  wallCoordinates: WallCoordinate[];
}

export interface MapSize {
  height: number;
  width: number;
};
