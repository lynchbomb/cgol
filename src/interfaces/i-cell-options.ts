import { ICoords } from './i-coords';

export interface ICellOptions {
  fillStyle?: string;
  coords?: ICoords;
  width?: number;
  height?: number;
  isAlive?: boolean;
  liveNeighborsCount?: number;
};
