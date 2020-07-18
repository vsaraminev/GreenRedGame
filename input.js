const readline = require('readline');

const { QUESTIONS, OUTPUT_MESSAGE } = require('./constants');
const matrix = require('./matrix');
const utils = require('./utils');

const readlineInterface = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

const start = async function () {
   const { width, height } = await askGridInput();
   for (let index = 0; index < height; index++) {
      const numbers = await askZeroStateInput(width);
      matrix.fillArray(numbers);
   }
   const { x1, y1, iterations } = await askCoordinatesInput(width, height);
   const greenGenerations = matrix.iterateGrid(
      iterations,
      x1,
      y1,
      width,
      height
   );
   console.log(`${OUTPUT_MESSAGE}${greenGenerations}`);

   process.exit();
};

const ask = (questionText) => {
   return new Promise((resolve, reject) => {
      readlineInterface.question(questionText, (input) => resolve(input));
   });
};

const askGridInput = async () => {
   let gridInput = await ask(QUESTIONS.GRID_SIZE);
   let verifyGridInput = utils.checkGridInput(gridInput);
   while (!verifyGridInput.result) {
      console.log(verifyGridInput.message);
      gridInput = await ask(QUESTIONS.GRID_SIZE);
      verifyGridInput = utils.checkGridInput(gridInput);
   }

   return utils.parseGridInput(gridInput);
};

const askZeroStateInput = async (width) => {
   let zeroStateInput = await ask(QUESTIONS.ZERO_STATE);
   let verifyZeroStateInput = utils.checkZeroStateInput(zeroStateInput, width);
   while (!verifyZeroStateInput.result) {
      console.log(verifyZeroStateInput.message);
      zeroStateInput = await ask(QUESTIONS.ZERO_STATE);
      verifyZeroStateInput = utils.checkZeroStateInput(zeroStateInput, width);
   }

   return zeroStateInput.trim().split('').map(Number);
};

const askCoordinatesInput = async (width, height) => {
   let coordinatesInput = await ask(QUESTIONS.COORDINATES);
   let verifyCoordInput = utils.checkCoordinatesInput(
      coordinatesInput,
      width,
      height
   );
   while (!verifyCoordInput.result) {
      console.log(verifyCoordInput.message);
      coordinatesInput = await ask(QUESTIONS.COORDINATES);
      verifyCoordInput = utils.checkCoordinatesInput(
         coordinatesInput,
         width,
         height
      );
   }
   return utils.parseCoordInput(coordinatesInput);
};

module.exports = {
   start,
};
