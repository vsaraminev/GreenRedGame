const RED_CELL = 0;
const GREEN_CELL = 1;

//Hard coded 2D array for test

let matrix = [
   [0, 0, 0],
   [1, 1, 1],
   [0, 0, 0],
];

for (let row = 0; row < matrix.length; row++) {
   for (let column = 0; column < matrix[row].length; column++) {
      const neighbors = findAllNeighbors(matrix, row, column);
   }
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
