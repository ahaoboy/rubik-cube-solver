# WIP

## fork from [cubejs](https://github.com/ldez/cubejs#readme)


```
yarn add rubik-cube-solver

const cubeState = [
  "dbbburrfb", // front
  "rudrruddl", // right
  "flulfbddr", // up
  "llffdrubf", // down
  "rludlubrf", // left
  "lubfbfudl", // back
]
  .join("")
  .toUpperCase();

import { Cube } from 'rubik-cube-solver'
Cube.initSolver();
const cube = Cube.fromString(cubeState);
console.log(cube.solve());
// U F B R L U2 B2 U L2 F' U' F2 U2 L2 D L2 F2 U' R2 U2 L2 U'
```