import { ICoords } from './i-coords';

export interface ICellOptions {
  fillStyle?: string;
  coords?: ICoords;
  STRcoords?: string;
  width?: number;
  height?: number;
  isAlive?: boolean;
  liveNeighborsCount?: number;
  probabilityDOA?: number;
};
