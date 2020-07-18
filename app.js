const readline = require('readline');
const {
   RED_CELL,
   GREEN_CELL,
   MAX_GRID_SIZE,
   QUESTIONS,
   OUTPUT_MESSAGE,
   ALLOWED_CHARACTERS,
   ERROR_MESSAGES,
} = require('./constants');

const readlineInterface = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

let greenGenerations = 0;

let matrix = [];

let newMatrix;

start();

function checkCoordinatesInput(input, width, heigh) {
   const { x1, y1, iterations } = parseCoordInput(input);
   if (isNaN(x1) || isNaN(y1) || isNaN(iterations)) {
      return { result: false, message: ERROR_MESSAGES.NOT_A_NUMBER };
   } else if (x1 < 0 || y1 < 0 || iterations < 0) {
      return { result: false, message: ERROR_MESSAGES.NEGATIVE_NUMBERS };
   } else if (x1 > width || y1 > heigh) {
      return { result: false, message: ERROR_MESSAGES.OUT_OF_GRID };
   }
   return { result: true };
}

function checkGridInput(input) {
   const { width, heigh } = parseGridInput(input);
   if (isNaN(width) || isNaN(heigh)) {
      return { result: false, message: ERROR_MESSAGES.NOT_A_NUMBER };
   } else if (width < 0 || heigh < 0) {
      return { result: false, message: ERROR_MESSAGES.NEGATIVE_NUMBERS };
   } else if (width >= MAX_GRID_SIZE || heigh >= MAX_GRID_SIZE) {
      return { result: false, message: ERROR_MESSAGES.MAX_GRID };
   } else if (width > heigh) {
      return { result: false, message: ERROR_MESSAGES.HEIGHT };
   }
   return { result: true };
}

function containsOnlyOneOrZero(array1, array2) {
   return array2.every((elem) => array1.includes(elem));
}

function checkZeroStateInput(input, width) {
   const numbers = input.trim().split('').map(Number);
   if (numbers.length !== width) {
      return { result: false, message: ERROR_MESSAGES.CHAR_COUNT };
   } else if (!containsOnlyOneOrZero(ALLOWED_CHARACTERS, numbers)) {
      return { result: false, message: ERROR_MESSAGES.ALLOWED_CHARACTERS };
   }
   return { result: true };
}

function parseGridInput(input) {
   const gridArgs = input.split(',');
   const width = parseInt(gridArgs[0].trim());
   const heigh = parseInt(gridArgs[1].trim());
   return { width, heigh };
}

function parseCoordInput(input) {
   const coordArgs = input.split(',');
   const x1 = parseInt(coordArgs[0].trim());
   const y1 = parseInt(coordArgs[1].trim());
   const iterations = parseInt(coordArgs[2].trim());
   return { x1, y1, iterations };
}

async function start() {
   let gridInput = await ask(QUESTIONS.GRID_SIZE);
   let verifyGridInput = checkGridInput(gridInput);
   while (!verifyGridInput.result) {
      console.log(verifyGridInput.message);
      gridInput = await ask(QUESTIONS.GRID_SIZE);
      verifyGridInput = checkGridInput(gridInput);
   }
   const { width, heigh } = parseGridInput(gridInput);

   for (let index = 0; index < heigh; index++) {
      let zeroStateInput = await ask(QUESTIONS.ZERO_STATE);
      let verifyZeroStateInput = checkZeroStateInput(zeroStateInput, width);
      while (!verifyZeroStateInput.result) {
         console.log(verifyZeroStateInput.message);
         zeroStateInput = await ask(QUESTIONS.ZERO_STATE);
         verifyZeroStateInput = checkZeroStateInput(zeroStateInput, width);
      }
      const numbers = zeroStateInput.trim().split('').map(Number);
      matrix.push(numbers);
   }
   newMatrix = createEmptyMatrix(width, heigh);
   let coordinatesInput = await ask(QUESTIONS.COORDINATES);
   let verifyCoordInput = checkCoordinatesInput(coordinatesInput, width, heigh);
   while (!verifyCoordInput.result) {
      console.log(verifyCoordInput.message);
      coordinatesInput = await ask(QUESTIONS.COORDINATES);
      verifyCoordInput = checkCoordinatesInput(coordinatesInput, width, heigh);
   }
   const { x1, y1, iterations } = parseCoordInput(coordinatesInput);
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
