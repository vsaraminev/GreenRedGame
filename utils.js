const {
   MAX_GRID_SIZE,
   ALLOWED_CHARACTERS,
   ERROR_MESSAGES,
} = require('./constants');

const utils = {};

utils.checkCoordinatesInput = (input, width, height) => {
   const { x1, y1, iterations } = utils.parseCoordInput(input);
   if (isNaN(x1) || isNaN(y1) || isNaN(iterations)) {
      return { result: false, message: ERROR_MESSAGES.NOT_A_NUMBER };
   } else if (x1 < 0 || y1 < 0 || iterations < 0) {
      return { result: false, message: ERROR_MESSAGES.NEGATIVE_NUMBERS };
   } else if (x1 > width || y1 > height) {
      return { result: false, message: ERROR_MESSAGES.OUT_OF_GRID };
   }
   return { result: true };
};

utils.checkGridInput = (input) => {
   const { width, height } = utils.parseGridInput(input);
   if (isNaN(width) || isNaN(height)) {
      return { result: false, message: ERROR_MESSAGES.NOT_A_NUMBER };
   } else if (width < 0 || height < 0) {
      return { result: false, message: ERROR_MESSAGES.NEGATIVE_NUMBERS };
   } else if (width >= MAX_GRID_SIZE || height >= MAX_GRID_SIZE) {
      return { result: false, message: ERROR_MESSAGES.MAX_GRID };
   } else if (width > height) {
      return { result: false, message: ERROR_MESSAGES.HEIGHT };
   }
   return { result: true };
};

utils.containsOnlyOneOrZero = (array1, array2) => {
   return array2.every((elem) => array1.includes(elem));
};

utils.checkZeroStateInput = (input, width) => {
   const numbers = input.trim().split('').map(Number);
   if (numbers.length !== width) {
      return { result: false, message: ERROR_MESSAGES.CHAR_COUNT };
   } else if (!utils.containsOnlyOneOrZero(ALLOWED_CHARACTERS, numbers)) {
      return { result: false, message: ERROR_MESSAGES.ALLOWED_CHARACTERS };
   }
   return { result: true };
};

utils.parseGridInput = (input) => {
   const gridArgs = input.trim().split(',');
   const width = parseInt(gridArgs[0]);
   const height = parseInt(gridArgs[1]);
   return { width, height };
};

utils.parseCoordInput = (input) => {
   const coordArgs = input.trim().split(',');
   const x1 = parseInt(coordArgs[0]);
   const y1 = parseInt(coordArgs[1]);
   const iterations = parseInt(coordArgs[2]);
   return { x1, y1, iterations };
};

module.exports = utils;
