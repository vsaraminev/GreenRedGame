# GreenRedGame

Green vs Red is a game played on a 2D grid that in theory can be infinite.

RUNNING

RUNNING COMMAND LINE
node app.js

DESCRIPTION

Green vs Red is a game played on a 2D grid that in theory can be infinite(in our case we will assme that x <= y< 1000).

Each cell on this grid can be either green(represented by 1) or red(represented by 0). The game always receives an initial state of the grid which we will call 'Generation Zero'. After that a set of 4 rules are applied across the grid and those rules form the next generation.
Rules that create the next generation:

1. Each red cell that is surrounded by exactly 3 or exactly 6 green cells will also become green in the next generation.
2. A red cell will stay red in the next generation if it has either 0, 1, 2, 4, 5, 7 or 8 green neighbours.
3. Each green cell surrounded by 0, 1, 4, 5, 7 or 8 green neighbours will become red in the next generation.
4. A green cell will stay green in the next generation if it has either 2, 3 or 6 green neighbours.

INPUT
Example 1
3, 3
000
111
000
1, 0, 10

# expected result: 5

Example 2
4, 4
1001
1111
0100
1010
2, 2, 15

# expected result: 14
