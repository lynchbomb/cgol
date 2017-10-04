export function generateMatrix(rows: number, columns: number, fillWith: any = undefined) {
  return new Array(rows).fill(fillWith).map(() => new Array(columns).fill(fillWith));
}

export function randomIntBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomVectorBetween(min: number, max: number) {
  return [randomIntBetween(min, max), randomIntBetween(min, max)];
}
