export default interface Coordinate {
  x: number;
  y: number;
}

export interface WallCoordinate {
  start: Coordinate;
  end: Coordinate;
}
