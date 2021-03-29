import { CubeState } from './type';
import Cube from './cube';

import { CENTERS, CORNERS, EDGES, allMoves1, allMoves2 } from './constants';
import {
  factorial,
  Cnk,
  max,
  rotateLeft,
  rotateRight,
  range,
  pruning,
  getNextMoves1,
  getNextMoves2,
} from './utils';

const N_TWIST = 2187; // 3^7 corner orientations
const N_FLIP = 2048; // 2^11 possible edge flips
const N_PARITY = 2; // 2 possible parities
const N_FRtoBR = 11880; // 12!/(12-4)! permutations of FR..BR edges
const N_SLICE1 = 495; // (12 choose 4) possible positions of FR..BR edges
const N_SLICE2 = 24; // 4! permutations of FR..BR edges in phase 2
const N_URFtoDLF = 20160; // 8!/(8-6)! permutations of URF..DLF corners
// The URtoDF move table is only computed for phase 2 because the full
// table would have >650000 entries
const N_URtoDF = 20160; // 8!/(8-6)! permutation of UR..DF edges in phase 2
const N_URtoUL = 1320; // 12!/(12-3)! permutations of UR..UL edges
const N_UBtoDF = 1320; // 12!/(12-3)! permutations of UB..DF edges
// Centers
const [U, R, F, D, L, B] = CENTERS;
// Corners
const [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = CORNERS;
// Edges
const [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = EDGES;

const faceNums = {
  U: 0,
  R: 1,
  F: 2,
  D: 3,
  L: 4,
  B: 5,
};

const faceNames = {
  0: 'U',
  1: 'R',
  2: 'F',
  3: 'D',
  4: 'L',
  5: 'B',
};
const nextMoves1 = getNextMoves1();
const nextMoves2 = getNextMoves2();
// Other move tables are computed on the fly
const moveTableParams = {
  // name: [scope, size]
  twist: ['corners', N_TWIST],
  flip: ['edges', N_FLIP],
  FRtoBR: ['edges', N_FRtoBR],
  URFtoDLF: ['corners', N_URFtoDLF],
  URtoDF: ['edges', N_URtoDF],
  URtoUL: ['edges', N_URtoUL],
  UBtoDF: ['edges', N_UBtoDF],
  mergeURtoDF: [], // handled specially
};

const permutationIndex = (
  context: string,
  start: number,
  end: number,
  fromEnd: boolean = false
) => {
  let maxAll: number, permName: string;
  let i: number;
  if (fromEnd == null) {
    fromEnd = false;
  }
  const maxOur = end - start;
  const maxB = factorial(maxOur + 1);

  if (context === 'corners') {
    maxAll = 7;
    permName = 'cp';
  } else {
    maxAll = 11;
    permName = 'ep';
  }

  const our = (() => {
    let asc: boolean, end1: number, j: number;
    const result = [];
    for (
      j = 0, i = j, end1 = maxOur, asc = 0 <= end1;
      asc ? j <= end1 : j >= end1;
      asc ? j++ : j--, i = j
    ) {
      result.push(0);
    }
    return result;
  })();

  return function(index?: number) {
    let a: number,
      b: number,
      j: number,
      k: number,
      perm: { [x: string]: any },
      x: number;
    if (index !== null && index !== undefined) {
      // Reset our to [start..end]
      let asc1: boolean, end2: number;
      let asc2: boolean, end3: number;
      let asc3: boolean, end4: number;
      let c: number;
      for (
        i = 0, end2 = maxOur, asc1 = 0 <= end2;
        asc1 ? i <= end2 : i >= end2;
        asc1 ? i++ : i--
      ) {
        our[i] = i + start;
      }

      b = index % maxB; // permutation
      a = (index / maxB) | 0; // combination

      // Invalidate all edges
      perm = this[permName];
      for (
        i = 0, end3 = maxAll, asc2 = 0 <= end3;
        asc2 ? i <= end3 : i >= end3;
        asc2 ? i++ : i--
      ) {
        perm[i] = -1;
      }

      // Generate permutation from index b
      for (
        j = 1, end4 = maxOur, asc3 = 1 <= end4;
        asc3 ? j <= end4 : j >= end4;
        asc3 ? j++ : j--
      ) {
        k = b % (j + 1);
        b = (b / (j + 1)) | 0;
        // TODO: Implement rotateRightBy(our, 0, j, k)
        while (k > 0) {
          rotateRight(our, 0, j);
          k--;
        }
      }

      // Generate combination and set our edges
      x = maxOur;
      if (fromEnd) {
        let asc4: boolean, end5: number;
        for (
          j = 0, end5 = maxAll, asc4 = 0 <= end5;
          asc4 ? j <= end5 : j >= end5;
          asc4 ? j++ : j--
        ) {
          c = Cnk(maxAll - j, x + 1);
          if (a - c >= 0) {
            perm[j] = our[maxOur - x];
            a -= c;
            x--;
          }
        }
      } else {
        let asc5: boolean;
        for (
          j = maxAll, asc5 = maxAll <= 0;
          asc5 ? j <= 0 : j >= 0;
          asc5 ? j++ : j--
        ) {
          c = Cnk(j, x + 1);
          if (a - c >= 0) {
            perm[j] = our[x];
            a -= c;
            x--;
          }
        }
      }

      return this;
    } else {
      let asc6: boolean, end6: number;
      let asc9: boolean;
      perm = this[permName];
      for (
        i = 0, end6 = maxOur, asc6 = 0 <= end6;
        asc6 ? i <= end6 : i >= end6;
        asc6 ? i++ : i--
      ) {
        our[i] = -1;
      }
      a = b = x = 0;

      // Compute the index a < ((maxAll + 1) choose (maxOur + 1)) and
      // the permutation
      if (fromEnd) {
        let asc7: boolean;
        for (
          j = maxAll, asc7 = maxAll <= 0;
          asc7 ? j <= 0 : j >= 0;
          asc7 ? j++ : j--
        ) {
          if (start <= perm[j] && perm[j] <= end) {
            a += Cnk(maxAll - j, x + 1);
            our[maxOur - x] = perm[j];
            x++;
          }
        }
      } else {
        let asc8: boolean, end7: number;
        for (
          j = 0, end7 = maxAll, asc8 = 0 <= end7;
          asc8 ? j <= end7 : j >= end7;
          asc8 ? j++ : j--
        ) {
          if (start <= perm[j] && perm[j] <= end) {
            a += Cnk(j, x + 1);
            our[x] = perm[j];
            x++;
          }
        }
      }

      // Compute the index b < (maxOur + 1)! for the permutation
      for (
        j = maxOur, asc9 = maxOur <= 0;
        asc9 ? j <= 0 : j >= 0;
        asc9 ? j++ : j--
      ) {
        k = 0;
        while (our[j] !== start + j) {
          rotateLeft(our, 0, j);
          k++;
        }
        b = (j + 1) * b + k;
      }

      return a * maxB + b;
    }
  };
};
const pruningTableParams = {
  // name: [phase, size, currentCoords, nextIndex]
  sliceTwist: [
    1,
    N_SLICE1 * N_TWIST,
    (index: number) => [index % N_SLICE1, (index / N_SLICE1) | 0],
    function(current: any, move: string | number) {
      const [slice, twist] = Array.from(current);
      const newSlice = (Cube.moveTables.FRtoBR[slice * 24][move] / 24) | 0;
      const newTwist = Cube.moveTables.twist[twist][move];
      return newTwist * N_SLICE1 + newSlice;
    },
  ],
  sliceFlip: [
    1,
    N_SLICE1 * N_FLIP,
    (index: number) => [index % N_SLICE1, (index / N_SLICE1) | 0],
    function(current: any, move: string | number) {
      const [slice, flip] = Array.from(current);
      const newSlice = (Cube.moveTables.FRtoBR[slice * 24][move] / 24) | 0;
      const newFlip = Cube.moveTables.flip[flip][move];
      return newFlip * N_SLICE1 + newSlice;
    },
  ],
  sliceURFtoDLFParity: [
    2,
    N_SLICE2 * N_URFtoDLF * N_PARITY,
    (index: number) => [
      index % 2,
      ((index / 2) | 0) % N_SLICE2,
      (((index / 2) | 0) / N_SLICE2) | 0,
    ],
    function(current: any, move: string | number) {
      const [parity, slice, URFtoDLF] = Array.from(current);
      const newParity = Cube.moveTables.parity[parity][move];
      const newSlice = Cube.moveTables.FRtoBR[slice][move];
      const newURFtoDLF = Cube.moveTables.URFtoDLF[URFtoDLF][move];
      return (newURFtoDLF * N_SLICE2 + newSlice) * 2 + newParity;
    },
  ],
  sliceURtoDFParity: [
    2,
    N_SLICE2 * N_URtoDF * N_PARITY,
    (index: number) => [
      index % 2,
      ((index / 2) | 0) % N_SLICE2,
      (((index / 2) | 0) / N_SLICE2) | 0,
    ],
    function(current: any, move: string | number) {
      const [parity, slice, URtoDF] = Array.from(current);
      const newParity = Cube.moveTables.parity[parity][move];
      const newSlice = Cube.moveTables.FRtoBR[slice][move];
      const newURtoDF = Cube.moveTables.URtoDF[URtoDF][move];
      return (newURtoDF * N_SLICE2 + newSlice) * 2 + newParity;
    },
  ],
};
class Solver extends Cube {
  moveTables = {
    parity: [
      [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
      [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    ],
    twist: null,
    flip: null,
    FRtoBR: null,
    URFtoDLF: null,
    URtoDF: null,
    URtoUL: null,
    UBtoDF: null,
    mergeURtoDF: null,
  };
  pruningTables = {
    sliceTwist: null,
    sliceFlip: null,
    sliceURFtoDLFParity: null,
    sliceURtoDFParity: null,
  };

  constructor(s?: CubeState) {
    super(s);
  }
  // The twist of the 8 corners, 0 <= twist < 3^7. The orientation of
  // the DRB corner is fully determined by the orientation of the other
  // corners.
  twist(twist: number) {
    let i: number;
    if (twist != null) {
      let parity = 0;
      for (i = 6; i >= 0; i--) {
        const ori = twist % 3;
        twist = (twist / 3) | 0;

        this.co[i] = ori;
        parity += ori;
      }

      this.co[7] = (3 - (parity % 3)) % 3;
      return this;
    } else {
      let v = 0;
      for (i = 0; i <= 6; i++) {
        v = 3 * v + this.co[i];
      }
      return v;
    }
  }

  // The flip of the 12 edges, 0 <= flip < 2^11. The orientation of the
  // BR edge is fully determined by the orientation of the other edges.
  flip(flip: number) {
    let i: number;
    if (flip != null) {
      let parity = 0;
      for (i = 10; i >= 0; i--) {
        const ori = flip % 2;
        flip = (flip / 2) | 0;

        this.eo[i] = ori;
        parity += ori;
      }

      this.eo[11] = (2 - (parity % 2)) % 2;
      return this;
    } else {
      let v = 0;
      for (i = 0; i <= 10; i++) {
        v = 2 * v + this.eo[i];
      }
      return v;
    }
  }

  // Parity of the corner permutation
  cornerParity() {
    let s = 0;
    for (
      let i = DRB, end = URF + 1, asc = DRB <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      for (
        let start = i - 1, j = start, end1 = URF, asc1 = start <= end1;
        asc1 ? j <= end1 : j >= end1;
        asc1 ? j++ : j--
      ) {
        if (this.cp[j] > this.cp[i]) {
          s++;
        }
      }
    }

    return s % 2;
  }

  // Parity of the edges permutation. Parity of corners and edges are
  // the same if the cube is solvable.
  edgeParity() {
    let s = 0;
    for (
      let i = BR, end = UR + 1, asc = BR <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      for (
        let start = i - 1, j = start, end1 = UR, asc1 = start <= end1;
        asc1 ? j <= end1 : j >= end1;
        asc1 ? j++ : j--
      ) {
        if (this.ep[j] > this.ep[i]) {
          s++;
        }
      }
    }

    return s % 2;
  }

  // Permutation of the six corners URF, UFL, ULB, UBR, DFR, DLF
  URFtoDLF() {
    permutationIndex('corners', URF, DLF);
  }

  // Permutation of the three edges UR, UF, UL
  URtoUL = permutationIndex('edges', UR, UL);

  // Permutation of the three edges UB, DR, DF
  UBtoDF = permutationIndex('edges', UB, DF);

  // Permutation of the six edges UR, UF, UL, UB, DR, DF
  URtoDF = permutationIndex('edges', UR, DF);

  // Permutation of the equator slice edges FR, FL, BL and BR
  FRtoBR = permutationIndex('edges', FR, BR, true);

  solve(maxDepth: number) {
    if (maxDepth == null) {
      maxDepth = 22;
    }
    const clone = this.clone();
    const upright = clone.upright();
    clone.move(upright);
    const rotation = new Cube().move(upright).center;
    const uprightSolution = clone.solveUpright(maxDepth);
    const solution = [];
    for (let move of Array.from(uprightSolution.split(' '))) {
      solution.push(faceNames[rotation[faceNums[move[0]]]]);
      if (move.length > 1) {
        solution[solution.length - 1] += move[1];
      }
    }
    return solution.join(' ');
  }
  computeMoveTables(...tables: string[]) {
    if (tables.length === 0) {
      tables = (() => {
        const result = [];
        for (let name in moveTableParams) {
          result.push(name);
        }
        return result;
      })();
    }

    for (let tableName of Array.from(tables)) {
      // Already computed
      if (this.moveTables[tableName] !== null) {
        continue;
      }

      if (tableName === 'mergeURtoDF') {
        this.moveTables.mergeURtoDF = (() =>
          range(0, 335, true).map((URtoUL: any) =>
            range(0, 335, true).map((UBtoDF: any) =>
              mergeURtoDF(URtoUL, UBtoDF)
            )
          ))();
      } else {
        const [scope, size] = Array.from(moveTableParams[tableName]);
        this.moveTables[tableName] = computeMoveTable(scope, tableName, size);
      }
    }

    return this;
  }
  computePruningTables(tables: string[]) {
    if (tables.length === 0) {
      tables = Object.keys(pruningTableParams);
    }
    for (let tableName of Array.from(tables)) {
      // Already computed
      if (this.pruningTables[tableName] !== null) {
        continue;
      }

      const params = pruningTableParams[tableName];
      this.pruningTables[tableName] = computePruningTable(
        ...Array.from(params || [])
      );
    }

    return this;
  }
  initSolver() {
    this.computeMoveTables();
    return this.computePruningTables();
  }

  clone() {
    return new Solver(this.toJSON());
  }
  solveUpright = function(maxDepth: number) {
    // Names for all moves, i.e. U, U2, U', F, F2, ...
    if (maxDepth == null) {
      maxDepth = 22;
    }
    const moveNames = (function() {
      const faceName = ['U', 'R', 'F', 'D', 'L', 'B'];
      const powerName = ['', '2', "'"];

      const result = [];
      for (let face = 0; face <= 5; face++) {
        for (let power = 0; power <= 2; power++) {
          result.push(faceName[face] + powerName[power]);
        }
      }

      return result;
    })();

    class State {
      parent: any;
      lastMove: any;
      depth: number;
      flip: any;
      twist: any;
      slice: number;
      parity: any;
      URFtoDLF: any;
      FRtoBR: number;
      URtoUL: any;
      UBtoDF: any;
      URtoDF: number;
      constructor(cube: undefined) {
        this.parent = null;
        this.lastMove = null;
        this.depth = 0;

        if (cube) {
          this.init(cube);
        }
      }

      init(cube: {
        flip: () => any;
        twist: () => any;
        FRtoBR: () => number;
        cornerParity: () => any;
        URFtoDLF: () => any;
        URtoUL: () => any;
        UBtoDF: () => any;
      }) {
        // Phase 1 coordinates
        this.flip = cube.flip();
        this.twist = cube.twist();
        this.slice = (cube.FRtoBR() / N_SLICE2) | 0;

        // Phase 2 coordinates
        this.parity = cube.cornerParity();
        this.URFtoDLF = cube.URFtoDLF();
        this.FRtoBR = cube.FRtoBR();

        // These are later merged to URtoDF when phase 2 begins
        this.URtoUL = cube.URtoUL();
        this.UBtoDF = cube.UBtoDF();

        return this;
      }

      solution() {
        if (this.parent) {
          return this.parent.solution() + moveNames[this.lastMove] + ' ';
        } else {
          return '';
        }
      }

      //# Helpers

      move(table: string, index: number, move: string | number) {
        return Cube.moveTables[table][index][move];
      }

      pruning(table: string, index: any) {
        return pruning(Cube.pruningTables[table], index);
      }

      //# Phase 1

      // Return the next valid phase 1 moves for this state
      moves1() {
        if (this.lastMove !== null) {
          return nextMoves1[(this.lastMove / 3) | 0];
        } else {
          return allMoves1;
        }
      }

      // Compute the minimum number of moves to the end of phase 1
      minDist1() {
        // The maximum number of moves to the end of phase 1 wrt. the
        // combination flip and slice coordinates only
        const d1 = this.pruning('sliceFlip', N_SLICE1 * this.flip + this.slice);

        // The combination of twist and slice coordinates
        const d2 = this.pruning(
          'sliceTwist',
          N_SLICE1 * this.twist + this.slice
        );

        // The true minimal distance is the maximum of these two
        return max(d1, d2);
      }

      // Compute the next phase 1 state for the given move
      next1(move: any) {
        const next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;

        next.flip = this.move('flip', this.flip, move);
        next.twist = this.move('twist', this.twist, move);
        next.slice = (this.move('FRtoBR', this.slice * 24, move) / 24) | 0;

        return next;
      }

      //# Phase 2

      // Return the next valid phase 2 moves for this state
      moves2() {
        if (this.lastMove !== null) {
          return nextMoves2[(this.lastMove / 3) | 0];
        } else {
          return allMoves2;
        }
      }

      // Compute the minimum number of moves to the solved cube
      minDist2() {
        const index1 =
          (N_SLICE2 * this.URtoDF + this.FRtoBR) * N_PARITY + this.parity;
        const d1 = this.pruning('sliceURtoDFParity', index1);

        const index2 =
          (N_SLICE2 * this.URFtoDLF + this.FRtoBR) * N_PARITY + this.parity;
        const d2 = this.pruning('sliceURFtoDLFParity', index2);

        return max(d1, d2);
      }

      // Initialize phase 2 coordinates
      init2(top: boolean) {
        if (top == null) {
          top = true;
        }
        if (this.parent === null) {
          // Already assigned for the initial state
          return;
        }

        // For other states, the phase 2 state is computed based on
        // parent's state.
        this.parent.init2(false);

        this.URFtoDLF = this.move(
          'URFtoDLF',
          this.parent.URFtoDLF,
          this.lastMove
        );
        this.FRtoBR = this.move('FRtoBR', this.parent.FRtoBR, this.lastMove);
        this.parity = this.move('parity', this.parent.parity, this.lastMove);
        this.URtoUL = this.move('URtoUL', this.parent.URtoUL, this.lastMove);
        this.UBtoDF = this.move('UBtoDF', this.parent.UBtoDF, this.lastMove);

        if (top) {
          // This is the initial phase 2 state. Get the URtoDF coordinate
          // by merging URtoUL and UBtoDF
          return (this.URtoDF = this.move(
            'mergeURtoDF',
            this.URtoUL,
            this.UBtoDF
          ));
        }
      }

      // Compute the next phase 2 state for the given move
      next2(move: any) {
        const next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;

        next.URFtoDLF = this.move('URFtoDLF', this.URFtoDLF, move);
        next.FRtoBR = this.move('FRtoBR', this.FRtoBR, move);
        next.parity = this.move('parity', this.parity, move);
        next.URtoDF = this.move('URtoDF', this.URtoDF, move);

        return next;
      }
    }

    let solution = null;

    const phase1search = (state: any) =>
      (() => {
        const result = [];
        for (
          let depth = 1, end = maxDepth, asc = 1 <= end;
          asc ? depth <= end : depth >= end;
          asc ? depth++ : depth--
        ) {
          phase1(state, depth);
          if (solution !== null) {
            break;
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();

    var phase1 = function(
      state: {
        minDist1: () => number;
        lastMove: any;
        moves1: () => any;
        next1: (arg0: any) => any;
      },
      depth: number
    ) {
      if (depth === 0) {
        if (state.minDist1() === 0) {
          // Make sure we don't start phase 2 with a phase 2 move as the
          // last move in phase 1, because phase 2 would then repeat the
          // same move.
          if (
            state.lastMove === null ||
            !Array.from(allMoves2).includes(state.lastMove)
          ) {
            return phase2search(state);
          }
        }
      } else if (depth > 0) {
        if (state.minDist1() <= depth) {
          return (() => {
            const result = [];
            for (let move of Array.from(state.moves1())) {
              const next = state.next1(move);
              phase1(next, depth - 1);
              freeStates.push(next);
              if (solution !== null) {
                break;
              } else {
                result.push(undefined);
              }
            }
            return result;
          })();
        }
      }
    };

    var phase2search = function(state: { init2: () => void; depth: number }) {
      // Initialize phase 2 coordinates
      state.init2();

      return (() => {
        const result = [];
        for (
          let depth = 1, end = maxDepth - state.depth, asc = 1 <= end;
          asc ? depth <= end : depth >= end;
          asc ? depth++ : depth--
        ) {
          phase2(state, depth);
          if (solution !== null) {
            break;
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    };

    var phase2 = function(
      state: {
        minDist2: () => number;
        solution: () => any;
        moves2: () => any;
        next2: (arg0: any) => any;
      },
      depth: number
    ) {
      if (depth === 0) {
        if (state.minDist2() === 0) {
          return (solution = state.solution());
        }
      } else if (depth > 0) {
        if (state.minDist2() <= depth) {
          return (() => {
            const result = [];
            for (let move of Array.from(state.moves2())) {
              const next = state.next2(move);
              phase2(next, depth - 1);
              freeStates.push(next);
              if (solution !== null) {
                break;
              } else {
                result.push(undefined);
              }
            }
            return result;
          })();
        }
      }
    };

    var freeStates = range(0, maxDepth + 1, true).map((x: any) => new State());
    const state = freeStates.pop().init(this);
    phase1search(state);
    freeStates.push(state);

    // Trim the trailing space and return
    return solution.trim();
  };
}

const computeMoveTable = function(
  context: string,
  coord: string | number,
  size: number
) {
  // Loop through all valid values for the coordinate, setting cube's
  // state in each iteration. Then apply each of the 18 moves to the
  // cube, and compute the resulting coordinate.
  const apply = context === 'corners' ? 'cornerMultiply' : 'edgeMultiply';
  const cube = new Solver();
  const result = [];
  for (
    let i = 0, end = size - 1, asc = 0 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    cube[coord](i);
    const inner = [];
    for (let j = 0; j <= 5; j++) {
      const move = Cube.moves[j];
      for (let k = 0; k <= 2; k++) {
        cube[apply](move);
        inner.push(cube[coord]());
      }
      // 4th face turn restores the cube
      cube[apply](move);
    }
    result.push(inner);
  }
  return result;
};

// pure function <=====>
const mergeURtoDF = () => {
  const a = new Solver();
  const b = new Solver();
  return function(URtoUL: any, UBtoDF: any) {
    // Collisions can be found because unset are set to -1
    a.URtoUL(URtoUL);
    b.UBtoDF(UBtoDF);

    for (let i = 0; i <= 7; i++) {
      if (a.ep[i] !== -1) {
        if (b.ep[i] !== -1) {
          return -1; // collision
        } else {
          b.ep[i] = a.ep[i];
        }
      }
    }
    return b.URtoDF();
  };
};
export default Solver;
