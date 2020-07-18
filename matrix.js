const { RED_CELL, GREEN_CELL } = require('./constants');

const matrix = {};

let matrixArr = [];

matrix.createEmptyMatrix = (length) => {
   let arr = new Array(length || 0),
      i = length;

   if (arguments.length > 1) {
      let args = Array.prototype.slice.call(arguments, 1);
      while (i--)
         arr[length - 1 - i] = matrix.createEmptyMatrix.apply(this, args);
   }

   return arr;
};

matrix.fillArray = (numbers) => {
   matrixArr.push(numbers);
};

matrix.findAllNeighbors = (matrix, row, column) => {
   let allPosibleIndexes = [
      [row - 1, column],
      [row, column - 1],
      [row - 1, column - 1],
      [row + 1, column],
      [row, column + 1],
      [row + 1, column + 1],
      [row + 1, column - 1],
      [row - 1, column + 1],
   ];
   let allPosibleValues = [];
   allPosibleIndexes.forEach(([row, column]) => {
      try {
         allPosibleValues.push(matrix[row][column]);
      } catch (err) {}
   });
   return allPosibleValues.filter((value) => value != undefined);
};

matrix.getSumOfEqualCells = (array, cellType) => {
   return array.filter((value) => value === cellType).length;
};

matrix.createNextGeneration = (cell, greens) => {
   if (cell === RED_CELL) {
      if (greens === 3 || greens === 6) {
         return GREEN_CELL;
      }
      return RED_CELL;
   } else {
      if (greens === 2 || greens === 3 || greens === 6) {
         return GREEN_CELL;
      }
      return RED_CELL;
   }
};

matrix.doSomething = (iterations, x1, y1, width, heigh) => {
   let greenGenerations = 0;
   let newMatrix = matrix.createEmptyMatrix(width, heigh);
   for (let index = 0; index < iterations; index++) {
      for (let row = 0; row < matrixArr.length; row++) {
         for (let column = 0; column < matrixArr[row].length; column++) {
            const neighbors = matrix.findAllNeighbors(matrixArr, row, column);
            const greenNeighbors = matrix.getSumOfEqualCells(
               neighbors,
               GREEN_CELL
            );
            const redNeighbors = matrix.getSumOfEqualCells(neighbors, RED_CELL);
            const currentCell = matrixArr[row][column];
            const nextGenerationCell = matrix.createNextGeneration(
               currentCell,
               greenNeighbors
            );
            newMatrix[row][column] = nextGenerationCell;
            if (
               row === x1 &&
               column === y1 &&
               nextGenerationCell === GREEN_CELL
            ) {
               greenGenerations++;
            }
         }
      }
      matrixArr = newMatrix;
      newMatrix = matrix.createEmptyMatrix(width, heigh);
   }

   return greenGenerations;
};

module.exports = matrix;
