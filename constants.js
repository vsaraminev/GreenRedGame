const RED_CELL = 0;
const GREEN_CELL = 1;
const MAX_GRID_SIZE = 1000;
const OUTPUT_MESSAGE = 'Expected result: ';
const ALLOWED_CHARACTERS = [0, 1];

const ERROR_MESSAGES = Object.freeze({
   NOT_A_NUMBER: 'Parameters of the grid should be numbers!',
   MAX_GRID: `The grid size should be less then ${MAX_GRID_SIZE}`,
   HEIGHT: 'Heigh should be greated or equal to the width',
   NEGATIVE_NUMBERS: 'Parameters should not be negative numbers',
   ALLOWED_CHARACTERS: 'Allowed characters are only 0 and 1',
   CHAR_COUNT: `The number of characters is more than allowed`,
   OUT_OF_GRID: 'The cell is out of the grid',
});

const QUESTIONS = Object.freeze({
   GRID_SIZE: 'Size of the grid:',
   ZERO_STATE: 'Generation Zero State:',
   COORDINATES: 'Coordinates and number N:',
});

module.exports = {
   RED_CELL,
   GREEN_CELL,
   MAX_GRID_SIZE,
   OUTPUT_MESSAGE,
   ALLOWED_CHARACTERS,
   ERROR_MESSAGES,
   QUESTIONS,
};
