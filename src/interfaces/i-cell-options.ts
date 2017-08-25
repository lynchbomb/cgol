import { HEADING } from '../heading';
import { ICoords } from './i-coords';

export interface ICellOptions {
  heading?: HEADING;
  length?: number;
  origin?: object;
  fillStyle?: string;
  lives?: number;
  coords?: ICoords[];
};
