import * as GUI from 'dat.gui';
import Cell from './cell';
import { ICanvasMeta } from './interfaces/i-canvas-meta';
import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';
import { beehive } from './stable-patterns';
import { generateMatrix, randomVectorBetween } from './utils';

class CGOL {
  public FPS_THROTTLE: null | number = 10;
  public cellWidth: number = 4;
  public cellHeight: number = 4;
  public cells: Array<[Cell]> | any;
  public newCells: Array<[Cell]> | any;
  public $canvas = document.getElementById('canvas') as HTMLCanvasElement;
  public canvasContext = this.$canvas.getContext('2d') as CanvasRenderingContext2D;
  public canvasMeta: ICanvasMeta = {
    canvasWidth: 0,
    canvasHeight: 0,
    canvasScaleWidth: this.cellWidth,
    canvasScaleHeight: this.cellHeight
  };
  public beehiveShape: [ICoords] = beehive();

  constructor() {
    this.initCanvas();
    this.initCells();
    this.initRenderCells();
    this.update();
  }

  public initCanvas(fillStyle: string = '#000') {
    this.canvasMeta.canvasWidth = this.$canvas.width;
    this.canvasMeta.canvasHeight = this.$canvas.height;
    this.canvasContext.fillStyle = fillStyle;
    this.canvasContext.fillRect(0, 0, this.canvasMeta.canvasWidth, this.canvasMeta.canvasHeight);
    this.canvasContext.scale(this.canvasMeta.canvasScaleWidth, this.canvasMeta.canvasScaleHeight);
  }

  public initCells() {
    // cellCountX/Y = canvasWidth:canvasHeight / cellWidth:cellHeight
    // cellWidth/Height should always === canvasScaleWidth/Height
    let _cellWidth: number = this.cellWidth;
    let _cellHeight: number = this.cellHeight;
    let _cellCountX: number = this.canvasMeta.canvasWidth / _cellWidth;
    let _cellCountY: number = this.canvasMeta.canvasHeight / _cellHeight;

    this.cells = generateMatrix(_cellCountX, _cellCountY);

    for (let i = 0; i < this.cells.length; i++) {
      for (let ii = 0; ii < this.cells[i].length; ii++) {
        this.cells[i][ii] = new Cell({
          coords: {x: ii, y: i},
          width: _cellWidth,
          height: _cellHeight,
          probabilityDOA: 0.9
        });
      }
    }

    this.initRenderCells();
  }

  public initSimpleShape(cell: Cell, shape: [ICoords]) {
    this.beehiveShape.forEach((coord: ICoords) => {
      if (JSON.stringify(coord) === JSON.stringify(cell.coords)) {
        cell.revive();
      }
    });
  }

  public initRenderCells() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let ii = 0; ii < this.cells[i].length; ii++) {
        // this.initSimpleShape(this.cells[i][ii], this.beehiveShape);
        this.renderCell(this.cells[i][ii]);
      }
    }
  }

  /********************************************
  *********************************************

  [ ALL METHODS BELOW ARE RUNNING AT ~60 FPS!! ]

  *********************************************
  *********************************************/

  public getLiveNeighborsCount(cell: Cell, cells: Array<[Cell]>, distance: number = 1): number {
    for (let i = 0; i < this.cells.length; i++) {
      for (let ii = 0; ii < this.cells[i].length; ii++) {
        if (cell !== cells[i][ii] && cells[i][ii].isAlive) {
          if (Math.abs(cell.coords.x - cells[i][ii].coords.x) <= distance) {
            if (Math.abs(cell.coords.y - cells[i][ii].coords.y) <= distance) {
              ++cell.prevLiveNeighborsCount;
            }
          }
        }
      }
    }

    cell.currentLiveNeighborsCount = cell.prevLiveNeighborsCount;
    cell.prevLiveNeighborsCount = 0;

    return cell.currentLiveNeighborsCount;
  }

  public runRules() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let ii = 0; ii < this.cells[i].length; ii++) {

        let liveNeighbors = this.getLiveNeighborsCount(this.cells[i][ii], this.cells);

        if (this.cells[i][ii].isAlive) {
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            this.cells[i][ii].die();
            this.cellStateChange(this.cells[i][ii]);
          }
        }else {
          if (liveNeighbors === 3) {
            this.cells[i][ii].revive();
            this.cellStateChange(this.cells[i][ii]);
          }
        }
        this.renderCell(this.cells[i][ii]);
      }
    }
  }

  public renderCell(cell: Cell): Cell {
    this.canvasContext.fillStyle = cell.fillStyle;
    this.canvasContext.fillRect(cell.coords.x, cell.coords.y, cell.width, cell.height);

    return cell;
  }

  public cellStateChange(cell: Cell) {
    this.clearCanvas(cell.coords.x, cell.coords.y, cell.width, cell.height);
  }

  public clearCanvas(x: number = 0, y: number = 0, width: number = this.canvasMeta.canvasWidth, height: number = this.canvasMeta.canvasHeight): boolean {
    this.canvasContext.clearRect(x, y, width, height);

    return true;
  }

  public update() {
    this.runRules();

    if (this.FPS_THROTTLE) {
      setTimeout(() => {
        window.requestAnimationFrame(this.update.bind(this));
      }, 1000 / this.FPS_THROTTLE);
    }else {
      window.requestAnimationFrame(this.update.bind(this));
    }
  }
};
