import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

export default class Cell implements ICellOptions {
  public fillStyle: string;
  public width: number = 10;
  public height: number = 10;
  public coords: ICoords = {x: 0, y: 0};
  public isAlive: boolean = false;
  public prevLiveNeighborsCount: number = 0;
  public currentLiveNeighborsCount: number = 0;

  constructor(options: ICellOptions) {
    this.coords = options.coords || {x: 0, y: 0};
    this.fillStyle = options.fillStyle || this.getRandomColor;
  }

  public die() {
    this.isAlive = false;
    this.setFillStyle = '#000';
  }

  public revive() {
    this.isAlive = true;
    this.setFillStyle = '#aaa';
  }

  public getLiveNeighborsCount(cells: Array<[Cell]>, distance: number = 1): number {
    /*
      0,0,0
      0,X,0
      0,0,0
    */
    // `distance` from this cell = 1
    cells.forEach((cellRow: Cell[], _x: number) => {
      cellRow.forEach((cellNeighbor: Cell, _y: number) => {
        if (Math.abs(this.coords.x - cellNeighbor.coords.x) <= distance) {
          if (Math.abs(this.coords.y - cellNeighbor.coords.y) <= distance) {
            this.prevLiveNeighborsCount++;
          }
        }
      });
    });

    this.currentLiveNeighborsCount = this.prevLiveNeighborsCount;
    this.prevLiveNeighborsCount = 0;

    return this.currentLiveNeighborsCount;
  }

  public set setFillStyle(fillStyle: string) {
    this.fillStyle = fillStyle;
  }

  public get getCoords(): object {
    return this.coords;
  }

  // add color sampling for gradients and patterns etc
  private get getRandomColor(): string {
    return '#' + Math.floor(Math.random() * (9999999 - 0o0)).toString(16);
  }
};
