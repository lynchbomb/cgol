import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

export default class Cell implements ICellOptions {
  public fillStyle: string | any = '#000';
  public width: number = 10;
  public height: number = 10;
  public coords: ICoords = {x: 0, y: 0};
  public isAlive: boolean = false;
  public prevLiveNeighborsCount: number = 0;
  public currentLiveNeighborsCount: number = 0;

  constructor(options: ICellOptions) {
    this.coords = options.coords || {x: 0, y: 0};
    this.fillStyle = options.fillStyle;
    this.randomizeLife();
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

  private randomizeLife() {
    let _isAlive = Math.random() >= 0.5;
    if (_isAlive) {
      this.revive();
    }else {
      this.die();
    }
  }
};
