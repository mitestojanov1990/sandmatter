const cellSize = 50;

export function getCell(x: number, y: number) {
  return [Math.floor(x / cellSize), Math.floor(y / cellSize)];
}
