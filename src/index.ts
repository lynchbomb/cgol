import Cell from './cell';
import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

class CGOL {

  public cells: any;
  public canvasWidth: number = 0;
  public canvasHeight: number = 0;
  public $canvas = <HTMLCanvasElement> document.getElementById('canvas');
  public canvasContext = <CanvasRenderingContext2D> this.$canvas.getContext('2d');
  public canvasScaleWidth: number = 10;
  public canvasScaleHeight: number = 10;

  constructor() {
    this.initCanvas();
    this.initCells();
    this.update();
  }

  public initCanvas(fillStyle: string = '#000') {
    this.canvasWidth = this.$canvas.width;
    this.canvasHeight = this.$canvas.height;
    this.canvasContext.fillStyle = fillStyle;
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.scale(10, 10);
  }

  public initCells() {
    // scene is 400 x 400 or 40 x 40 cells each 10 x 10 at a scale of 10 x 10
    let _cellCountX: number = this.canvasWidth / this.canvasScaleWidth;
    let _cellCountY: number = this.canvasHeight / this.canvasScaleHeight;

    this.cells = new Array(_cellCountX).fill(new Array(_cellCountY).fill(new Cell({
      coords: { x: 0, y: 0 },
      width: 10,
      height: 10
    })));

    this.cells.forEach((cellRow: Cell[], _x: number) => {
      cellRow.forEach((cell: Cell, _y: number) => {
        cell.coords.x = _x;
        cell.coords.y = _y;
        this.renderPoint(cell);
      });
    });
  }

  public _cellCondition() {
    // this.cells.forEach((cell) => {
    //   cell.
    // });
    // let cellLiveNeighborsCount = cell.getLiveNeighborsCount();
    // if(cell.isAlive){
    //   if(cellLiveNeighborsCount < 2 || cellLiveNeighborsCount > 3) {
    //     cell.die();
    //   }
    // }else{
    //   if(cellLiveNeighborsCount === 3){
    //     cell.revive();
    //   }
    // }
  }

  public clearCanvas(x: number = 0, y: number = 0, width: number = this.canvasWidth, height: number = this.canvasHeight) {
		// instead of clearing the entire canvas
    // just pass the object/proto to be cleared
    // default is the clear the entire canvas
    this.canvasContext.clearRect(x, y, width, height);

    return true;
  }

  public renderPoint(cell: Cell) {
    this.canvasContext.fillStyle = cell.fillStyle;
    this.canvasContext.fillRect(cell.coords.x, cell.coords.y, cell.width, cell.height);

    return cell;
  }

  public updateRenderedPoint(renderedPoint: ICoords) {
    renderedPoint.x++;
    renderedPoint.y++;

    return renderedPoint;
  }

  public update() {
    // this.clearCanvas(_renderedPointMeta.x, _renderedPointMeta.y, _renderedPointMeta.width, _renderedPointMeta.height);
    // this._cellCondition();

    window.requestAnimationFrame(this.update.bind(this));
  }
};
