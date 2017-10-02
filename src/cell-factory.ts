import Cell from './cell';
import { ICellOptions } from './interfaces/i-cell-options';

export default class CellFactory {
  public init(options: ICellOptions) {
    return new Cell(options);
  }
};
