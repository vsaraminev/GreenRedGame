const readline = require('readline');

const { QUESTIONS, OUTPUT_MESSAGE } = require('./constants');
const matrix = require('./matrix');
const utils = require('./utils');

const readlineInterface = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

const start = async function () {
   let gridInput = await ask(QUESTIONS.GRID_SIZE);
   let verifyGridInput = utils.checkGridInput(gridInput);
   while (!verifyGridInput.result) {
      console.log(verifyGridInput.message);
      gridInput = await ask(QUESTIONS.GRID_SIZE);
      verifyGridInput = utils.checkGridInput(gridInput);
   }

   const { width, heigh } = utils.parseGridInput(gridInput);

   for (let index = 0; index < heigh; index++) {
      let zeroStateInput = await ask(QUESTIONS.ZERO_STATE);
      let verifyZeroStateInput = utils.checkZeroStateInput(
         zeroStateInput,
         width
      );
      while (!verifyZeroStateInput.result) {
         console.log(verifyZeroStateInput.message);
         zeroStateInput = await ask(QUESTIONS.ZERO_STATE);
         verifyZeroStateInput = utils.checkZeroStateInput(
            zeroStateInput,
            width
         );
      }
      const numbers = zeroStateInput.trim().split('').map(Number);
      matrix.fillArray(numbers);
   }
   let coordinatesInput = await ask(QUESTIONS.COORDINATES);
   let verifyCoordInput = utils.checkCoordinatesInput(
      coordinatesInput,
      width,
      heigh
   );
   while (!verifyCoordInput.result) {
      console.log(verifyCoordInput.message);
      coordinatesInput = await ask(QUESTIONS.COORDINATES);
      verifyCoordInput = utils.checkCoordinatesInput(
         coordinatesInput,
         width,
         heigh
      );
   }
   const { x1, y1, iterations } = utils.parseCoordInput(coordinatesInput);
   const greenGenerations = matrix.doSomething(
      iterations,
      x1,
      y1,
      width,
      heigh
   );
   console.log(`${OUTPUT_MESSAGE}${greenGenerations}`);

   process.exit();
};

function ask(questionText) {
   return new Promise((resolve, reject) => {
      readlineInterface.question(questionText, (input) => resolve(input));
   });
}

module.exports = {
   start,
};
