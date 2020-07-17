const readline = require('readline');
const readlineInterface = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});
const RED_CELL = 0;
const GREEN_CELL = 1;
let greenGenerations = 0;
const questions = [
   'Size of the grid:',
   'Generation Zero State:',
   'Coordinates and number N:',
];

const OUTPUT_MESSAGE = 'Expected result: ';

let matrix = [];

let newMatrix;

start();

async function start() {
   const gridInput = await ask(questions[0]);
   const gridArgs = gridInput.split(',');
   const width = Number(gridArgs[0]);
   const heigh = Number(gridArgs[1]);
   for (let index = 0; index < heigh; index++) {
      const result = await ask(questions[1]);
      const numbers = result.split('').map(Number);
      matrix.push(numbers);
   }
   newMatrix = createEmptyMatrix(width, heigh);
   const coordinatesInput = await ask(questions[2]);
   const coordArgs = coordinatesInput.split(',');
   const x1 = Number(coordArgs[0]);
   const y1 = Number(coordArgs[1]);
   const iterations = Number(coordArgs[2]);

   for (let index = 0; index < iterations; index++) {
      for (let row = 0; row < matrix.length; row++) {
         for (let column = 0; column < matrix[row].length; column++) {
            const neighbors = findAllNeighbors(matrix, row, column);
            const greenNeighbors = getSumOfEqualCells(neighbors, GREEN_CELL);
            const redNeighbors = getSumOfEqualCells(neighbors, RED_CELL);
            const currentCell = matrix[row][column];
            const nextGenerationCell = createNextGeneration(
               currentCell,
               greenNeighbors,
               redNeighbors
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
      matrix = newMatrix;
      newMatrix = createEmptyMatrix(width, heigh);
   }
   console.log(`${OUTPUT_MESSAGE}${greenGenerations}`);

   process.exit();
}

function createEmptyMatrix(length) {
   var arr = new Array(length || 0),
      i = length;

   if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while (i--) arr[length - 1 - i] = createEmptyMatrix.apply(this, args);
   }

   return arr;
}

function findAllNeighbors(matrix, row, column) {
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
}

function getSumOfEqualCells(array, cellType) {
   return array.filter((value) => value === cellType).length;
}

function createNextGeneration(cell, greens, reds) {
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
}

function ask(questionText) {
   return new Promise((resolve, reject) => {
      readlineInterface.question(questionText, (input) => resolve(input));
   });
}
