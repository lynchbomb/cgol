import Cell from './cell';
import CellFactory from './cell-factory';
import { ICanvasMeta } from './interfaces/i-canvas-meta';
import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';
import { generateMatrix, randomVectorBetween } from './utils';

class CGOL {
  public cells: Array<[Cell]> | any;
  public $canvas = document.getElementById('canvas') as HTMLCanvasElement;
  public canvasContext = this.$canvas.getContext('2d') as CanvasRenderingContext2D;
  public canvasMeta: ICanvasMeta = {
    canvasWidth: 0,
    canvasHeight: 0,
    canvasScaleWidth: 10,
    canvasScaleHeight: 10
  };
  public cellFactory = new CellFactory();

  constructor() {
    this.initCanvas();
    this.initCells();
    this.initRenderCells();
    // this.runRules();
    this.update();
  }

  public initCanvas(fillStyle: string = '#000') {
    this.canvasMeta.canvasWidth = this.$canvas.width;
    this.canvasMeta.canvasHeight = this.$canvas.height;
    this.canvasContext.fillStyle = fillStyle;
    this.canvasContext.fillRect(0, 0, this.canvasMeta.canvasWidth, this.canvasMeta.canvasHeight);
    this.canvasContext.scale(10, 10);
  }

  public initCells() {
    // scene is 400 x 400 or 40 x 40 cells each 10 x 10 at a scale of 10 x 10
    let _cellCountX: number = this.canvasMeta.canvasWidth / this.canvasMeta.canvasScaleWidth;
    let _cellCountY: number = this.canvasMeta.canvasHeight / this.canvasMeta.canvasScaleHeight;

    this.cells = generateMatrix(_cellCountX, _cellCountY);

    this.cells.forEach((cellRow: Cell[], y: number) => {
      cellRow.forEach((cell: Cell, x: number) => {
        this.cells[y][x] = this.cellFactory.init({});
        this.cells[y][x].coords.x = x;
        this.cells[y][x].coords.y = y;
        // TODO: this isn't being set as default
        this.cells[y][x].randomizeLife();
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

  [ ALL METHODS BELOW ARE RUNNING AT 60 FPS!! ]

  *********************************************
  *********************************************/

  public runRules() {
    // iterate over the entire matrix
    // each cell within the matrix run `liveNeighbors = cell.getLiveNeighborsCount(this.cells)
    this.cells.forEach((cellRow: Cell[]) => {
      cellRow.forEach((cell: Cell) => {
        let liveNeighbors = cell.getLiveNeighborsCount(cell, this.cells);

        if (cell.isAlive) {
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            cell.die();
          }
        }else {
          if (liveNeighbors === 3) {
            cell.revive();
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

  public clearCanvas(x: number = 0, y: number = 0, width: number = this.canvasMeta.canvasWidth, height: number = this.canvasMeta.canvasHeight): boolean {
		// instead of clearing the entire canvas
    // just pass the object/proto to be cleared
    // default is the clear the entire canvas
    this.canvasContext.clearRect(x, y, width, height);

    return true;
  }

  public update() {
    this.clearCanvas.bind(this);
    this.runRules.bind(this);
    window.requestAnimationFrame(this.update.bind(this));
  }
};
