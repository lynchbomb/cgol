import * as GUI from 'dat.gui';
import Cell from './cell';
import { ICanvasMeta } from './interfaces/i-canvas-meta';
import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';
import { generateMatrix, randomVectorBetween } from './utils';

class CGOL {
  public FPS_THROTTLE: null | number = 5;
  public cellWidth: number = 10;
  public cellHeight: number = 10;
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

    this.cells.forEach((cellRow: Cell[], _y: number) => {
      cellRow.forEach((cell: Cell, _x: number) => {
        this.cells[_y][_x] = new Cell({
          coords: {x: _x, y: _y},
          width: _cellWidth,
          height: _cellHeight,
          probabilityDOA: 0.95
        });
      });
    });

    this.initRenderCells();
  }

  public initRenderCells() {
    this.cells.forEach((cellRow: Cell[], y: number) => {
      cellRow.forEach((cell: Cell, x: number) => {
        this.renderCell(cell);
      });
    });
  }

  /********************************************
  *********************************************

  [ ALL METHODS BELOW ARE RUNNING AT ~60 FPS!! ]

  *********************************************
  *********************************************/

  public getLiveNeighborsCount(cell: Cell, cells: Array<[Cell]>, distance: number = 1): number {
    cells.forEach((cellRow: Cell[], _x: number) => {
      cellRow.forEach((cellNeighbor: Cell, _y: number) => {
        if (cell !== cellNeighbor && cellNeighbor.isAlive) {
          if (Math.abs(cell.coords.x - cellNeighbor.coords.x) <= distance) {
            if (Math.abs(cell.coords.y - cellNeighbor.coords.y) <= distance) {
              ++cell.prevLiveNeighborsCount;
            }
          }
        }
      });
    });

    cell.currentLiveNeighborsCount = cell.prevLiveNeighborsCount;
    cell.prevLiveNeighborsCount = 0;

    return cell.currentLiveNeighborsCount;
  }

  public runRules() {
    this.cells.forEach((cellRow: Cell[]) => {
      cellRow.forEach((cell: Cell) => {
        let liveNeighbors = this.getLiveNeighborsCount(cell, this.cells);

        if (cell.isAlive) {
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            cell.die();
            this.cellStateChange(cell);
          }
        }else {
          if (liveNeighbors === 3) {
            cell.revive();
            this.cellStateChange(cell);
          }
        }
        this.renderCell(cell);
      });
    });
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
