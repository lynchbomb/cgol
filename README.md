# CGOL

### Overview

All individual cells are binary either dead (0) or alive (1)


### Rules

1. Generation Rule #1
If an alive cell has < 2 live neighbor cells it dies

2. Generation Rule #2
If an alive cell has 2 || 3 live neighbor cells it lives on to the next generation

3. Generation Rule #3
If an alive cell has > 3 live neighbor cells it dies

4. Generation Rule #4
If a dead cell has === 3 live neighbors it becomes alive


let cellLiveNeighborsCount = cell.getLiveNeighborsCount();

if(cell.isAlive){
  if(cellLiveNeighborsCount < 2 || cellLiveNeighborsCount > 3) {
    cell.die();
  }
}else{
  if(cellLiveNeighborsCount === 3){
    cell.revive();
  }
}