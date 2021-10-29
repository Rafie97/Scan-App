import Aisle from './Aisle';

export default interface Wall {
  id?: number;
  aisles: Aisle[];
  mapSize: {
    height: number;
    width: number;
  };
  wallCoordinates: any[];
}
