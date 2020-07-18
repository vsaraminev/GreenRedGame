const readline = require('readline');
const readlineInterface = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});
const RED_CELL = 0;
const GREEN_CELL = 1;
const MAX_GRID_SIZE = 1000;
let greenGenerations = 0;
const questions = [
   'Size of the grid:',
   'Generation Zero State:',
   'Coordinates and number N:',
];

const allowedCharacters = [0, 1];

const ERROR_MESSAGES = Object.freeze({
   nan: 'The size of the grid should be numbers.Try again!',
   maxGrid: `The grid size should be less then ${MAX_GRID_SIZE}`,
   height: 'Heigh should be greated or equal to the width',
   negative: 'Width and height should not be negative numbers',
   onlyZeroOrOne: 'Allowed characters are only 0 and 1',
   charactersCount: `The count of the characters should be equal to `,
});

const OUTPUT_MESSAGE = 'Expected result: ';

let matrix = [];

let newMatrix;

start();

function checkGridInput(input) {
   const { width, heigh } = parseInput(input);
   if (isNaN(width) || isNaN(heigh)) {
      return { result: false, message: ERROR_MESSAGES.nan };
   } else if (width < 0 || heigh < 0) {
      return { result: false, message: ERROR_MESSAGES.negative };
   } else if (width >= MAX_GRID_SIZE || heigh >= MAX_GRID_SIZE) {
      return { result: false, message: ERROR_MESSAGES.maxGrid };
   } else if (width > heigh) {
      return { result: false, message: ERROR_MESSAGES.height };
   }
   return { result: true };
}

function containsOnlyOneOrZero(array1, array2) {
   return array2.every((elem) => array1.includes(elem));
}

function checkZeroStateInput(input, width) {
   const numbers = input.split('').map(Number);
   if (numbers.length !== width) {
      return { result: false, message: ERROR_MESSAGES.charactersCount };
   } else if (!containsOnlyOneOrZero(allowedCharacters, numbers)) {
      return { result: false, message: ERROR_MESSAGES.onlyZeroOrOne };
   }
   return { result: true };
}

function parseInput(input) {
   const gridArgs = input.split(',');
   const width = parseInt(gridArgs[0]);
   const heigh = parseInt(gridArgs[1]);
   return { width, heigh };
}

async function start() {
   let gridInput = await ask(questions[0]);
   let verifyGridInput = checkGridInput(gridInput);
   while (!verifyGridInput.result) {
      console.log(verifyGridInput.message);
      gridInput = await ask(questions[0]);
      verifyGridInput = checkGridInput(gridInput);
   }
   const { width, heigh } = parseInput(gridInput);

   for (let index = 0; index < heigh; index++) {
      let zeroStateInput = await ask(questions[1]);
      let verifyZeroStateInput = checkZeroStateInput(zeroStateInput, width);
      while (!verifyZeroStateInput.result) {
         console.log(verifyZeroStateInput.message);
         zeroStateInput = await ask(questions[1]);
         verifyZeroStateInput = checkZeroStateInput(zeroStateInput, width);
      }
      const numbers = zeroStateInput.split('').map(Number);
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
