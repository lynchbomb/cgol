import Cell from './cell';
import CellFactory from './cell-factory';
import { ICanvasMeta } from './interfaces/i-canvas-meta';
import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

class CGOL {
  public cells: Array<[Cell]>;
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

    // instantiate cells and push them into an array
    // this.cells = new Array(_cellCountX).fill(new Array(_cellCountY).fill(this.cellFactory.init({})));
    this.cells = new Array(_cellCountX).fill(new Array(_cellCountY).fill(0));

    // !TODO had an issue that the factory is being ignored and inheriting the protype rather than instance
    this.cells.forEach((cellRow: Cell[], _x: number) => {
      cellRow.forEach((cell: Cell, _y: number) => {
        cell = this.cellFactory.init({});
        cell.coords.x = _x;
        cell.coords.y = _y;
        this.renderPoint(cell);
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
    // each cell within the matrix run `liveNeighbors = cell.getLiveNeighborsCount(this.cells)`

    this.cells.forEach((cellRow: Cell[], _x: number) => {
      cellRow.forEach((cell: Cell, _y: number) => {
        let liveNeighbors = cell.getLiveNeighborsCount(this.cells);

        if (cell.isAlive) {
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            cell.die();
          }
        }else {
          if (liveNeighbors === 3) {
            cell.revive();
          }
        }
      });
    });
  }

  public clearCanvas(x: number = 0, y: number = 0, width: number = this.canvasMeta.canvasWidth, height: number = this.canvasMeta.canvasHeight): boolean {
		// instead of clearing the entire canvas
    // just pass the object/proto to be cleared
    // default is the clear the entire canvas
    this.canvasContext.clearRect(x, y, width, height);

    return true;
  }

  public renderPoint(cell: Cell): Cell {
    this.canvasContext.fillStyle = cell.fillStyle;
    this.canvasContext.fillRect(cell.coords.x, cell.coords.y, cell.width, cell.height);

    return cell;
  }

  public updateRenderedPoint(renderedPoint: ICoords): ICoords {
    renderedPoint.x++;
    renderedPoint.y++;

    return renderedPoint;
  }

  public update() {
    this.clearCanvas();
    this.runRules();

    window.requestAnimationFrame(this.update.bind(this));
  }
};
