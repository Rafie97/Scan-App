import Aisle from './Aisle';
import {WallCoordinate} from './Coordinate';

export default interface Map {
  aisles: Aisle[];
  mapSize: {
    height: number;
    width: number;
  };
  wallCoordinates: WallCoordinate[];
}
