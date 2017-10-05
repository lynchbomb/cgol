import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

export default class Cell implements ICellOptions {
  public fillStyle: string;
  public width: number;
  public height: number;
  public coords: ICoords;
  public probabilityDOA: number;
  public isAlive: boolean = false;
  public prevLiveNeighborsCount: number = 0;
  public currentLiveNeighborsCount: number = 0;

  constructor(options: ICellOptions) {
    this.coords = options.coords || {x: 0, y: 0};
    this.probabilityDOA = options.probabilityDOA || 0.95;
    this.fillStyle = options.fillStyle || '#000';
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.randomizeLife(this.probabilityDOA);
  }

  public die() {
    this.isAlive = false;
    this.setFillStyle = '#000';
  }

  public revive() {
    this.isAlive = true;
    this.setFillStyle = '#aaa';
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

  // the probability 
  private randomizeLife(probabilityDOA: number) {
    let _isAlive = Math.random() >= probabilityDOA;
    if (_isAlive) {
      this.revive();
    }else {
      this.die();
    }
  }
};
