import { HEADING } from './heading';
import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

export default class Cell {
  public heading: HEADING;
  public length: number;
  public origin: object;
  public fillStyle: string;
  public lives: number;
  public width: number = 1;
  public height: number = 1;
  public coords: ICoords[];

  constructor(options: ICellOptions) {
    this.heading = options.heading || this.heading;
    this.length = options.length || 1;
    this.origin = options.origin || {x: 0, y: 0};
    this.fillStyle = options.fillStyle || '#000';
    this.lives = options.lives || 3;
    // TODO: overly simplified prob flush this out to be a function or class
    this.coords = [];

    this.defaultCoords();
  }

  public defaultCoords() {
    for (let i = 0; i < 20; i++) {
      this.coords.push({x: i, y: 0});
    }
  }

  public incrementDirection(direction: string) {
    let currentHeadCoords = this.coords[0];

    switch (direction) {
      case 'right': currentHeadCoords.x = currentHeadCoords.x + 1;
        break;
      default: return;
    }

    this.updateCoords(currentHeadCoords);
  }

  public updateCoords(newHeadCoords: ICoords) {
    this.coords[0] = newHeadCoords;
  }

  public destroy() {
    this.length = 0;
    this.heading = 0;
    this.lives = 0;
  }
}
