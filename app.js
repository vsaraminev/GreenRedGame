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

//Hard coded 2D array for test

let matrix = [
   [0, 0, 0],
   [1, 1, 1],
   [0, 0, 0],
];

let newMatrix = [
   [0, 0, 0],
   [0, 0, 0],
   [0, 0, 0],
];

start();

async function start() {
   const grid = await ask(questions[0]);
   const numbers = grid.split(',');
   const width = Number(numbers[0]);
   const heigh = Number(numbers[1]);
   let arr = [];
   for (let index = 0; index < heigh; index++) {
      let result = await ask(questions[1]);
      arr.push(result);
   }
   let coordinates = await ask(questions[2]);

   for (let index = 0; index < 10; index++) {
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
               row === 0 &&
               column === 1 &&
               nextGenerationCell === GREEN_CELL
            ) {
               greenGenerations++;
            }
         }
      }

      matrix = newMatrix;
      newMatrix = [
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
      ];
   }
   process.exit();
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
