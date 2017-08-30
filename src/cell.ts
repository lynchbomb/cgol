import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

export default class Cell {
  public fillStyle: string;
  public width: number = 1;
  public height: number = 1;
  public coords: ICoords;
  public isAlive: boolean = false;

  constructor(options: ICellOptions) {
    this.coords = options.coords || {x: 0, y: 0};
    this.fillStyle = options.fillStyle || this.getRandomColor();
  }

  public getLiveNeighborsCount() {
    return 3;
  }

  public die() {
    this.isAlive = false;
    this.setFillStyle('#000');
  }

  public revive() {
    this.isAlive = true;
    this.setFillStyle('#aaa');
  }

  public setFillStyle(fillStyle: string) {
    this.fillStyle = fillStyle;
  }

  private getRandomColor() {
    return '#' + Math.floor(Math.random() * (9999999 - 0o0)).toString(16);
  }
}
