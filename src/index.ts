import Cell from './cell';
import { ICellOptions } from './interfaces/i-cell-options';
import { ICoords } from './interfaces/i-coords';

export default class CGOL {

  public cell = <Cell> {};
  public $canvas = <HTMLCanvasElement> document.getElementById('canvas');
  public canvasContext = <CanvasRenderingContext2D> this.$canvas.getContext('2d');
  public canvasWidth = <number> 0;
  public canvasHeight = <number> 0;

  public someNum = 1;

  constructor() {
    this.initCanvas('#000');
    this.cell = new Cell({
      fillStyle: 'green',
      origin: [{x: this.canvasWidth / 2, y: this.canvasHeight / 2}]
    });
    this.eventController();
    this.update();
  }

  public initCanvas(fillStyle: string = '#000') {
    this.canvasWidth = this.$canvas.width;
    this.canvasHeight = this.$canvas.height;
    this.canvasContext.fillStyle = fillStyle;
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  public eventController() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  public _update() {
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

  public handleKeydown(e: any) {
    switch (e.keyCode) {
      case 37: this.handleLeftArrow();
        break;
      case 38: this.handleUpArrow();
        break;
      case 39: this.handleRightArrow();
        break;
      case 40: this.handleDownArrow();
        break;
      default: return;
    }
  }

  public handleLeftArrow() {
    this.cell.heading = 0;
  }

  public handleUpArrow() {
    this.cell.heading = 1;
  }

  public handleRightArrow() {
    this.cell.heading = 2;

    // throw-away
    this.cell.incrementDirection('right');
  }

  public handleDownArrow() {
    this.cell.heading = 3;
  }

  public clearCanvas(x: number = 0, y: number = 0, width: number = this.canvasWidth, height: number = this.canvasHeight) {
		// instead of clearing the entire canvas
    // just pass the object/proto to be cleared
    // default is the clear the entire canvas
    this.canvasContext.clearRect(x, y, width, height);

    return true;
  }

  public renderPoint(renderedPoint: ICoords) {
    this.canvasContext.fillStyle = this.cell.fillStyle;
    // fill a point that is {x:0,y:0, 1, 1}
    this.canvasContext.fillRect(renderedPoint.x, renderedPoint.y, this.cell.width, this.cell.height);

    return renderedPoint;
  }

  // TODO: prob delete this method
  public updateRenderedPoint(renderedPoint: ICoords) {
    renderedPoint.x++;
    renderedPoint.y++;

    return renderedPoint;
  }

  public eat() {

  }

  public update() {
    for (let i = 0; i < this.cell.coords.length; i++) {
      // {x:0, y:0}
      let coords = this.cell.coords[i];
      // point above is rendered to canvas
      let _renderedPointMeta = this.renderPoint(coords);

      // this.renderedPointMeta = this.updateRenderedPoint(_renderedPointMeta);
      // this.clearCanvas(_renderedPointMeta.x, _renderedPointMeta.y, _renderedPointMeta.width, _renderedPointMeta.height);
    }

    window.requestAnimationFrame(this.update.bind(this));
  }
};
