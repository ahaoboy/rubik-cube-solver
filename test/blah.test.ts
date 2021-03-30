import { Cube } from '../src/index';
describe('solve', () => {
  it('works', () => {
    const cubeState = [
      'dbbburrfb', // front
      'rudrruddl', // right
      'flulfbddr', // up
      'llffdrubf', // down
      'rludlubrf', // left
      'lubfbfudl', // back
    ]
      .join('')
      .toUpperCase();

    Cube.initSolver();
    const cube = Cube.fromString(cubeState);
    const path = cube.solve();
    console.log(path);
    expect(path).toEqual(
      "U F B R L U2 B2 U L2 F' U' F2 U2 L2 D L2 F2 U' R2 U2 L2 U'"
    );
  });
});
