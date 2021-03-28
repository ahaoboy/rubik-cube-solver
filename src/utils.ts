import { faceNums, allMoves1, allMoves2 } from './constants';
// n choose k, i.e. the binomial coeffiecient
export const Cnk = (n: number, k: number) => {
  if (n < k) {
    return 0;
  }

  if (k > n / 2) {
    k = n - k;
  }

  let s = 1;
  let i = n;
  let j = 1;
  while (i !== n - k) {
    s *= i;
    s /= j;
    i--;
    j++;
  }
  return s;
};

// n!
export const factorial = (n: number) => {
  let f = 1;
  for (
    let i = 2, end = n, asc = 2 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    f *= i;
  }
  return f;
};

// Maximum of two values
export const max = (a: number, b: number) => {
  if (a > b) {
    return a;
  } else {
    return b;
  }
};

export const initFacelet = () => {
  const _U = (x: number) => x - 1;
  const _R = (x: number) => _U(9) + x;
  const _F = (x: number) => _R(9) + x;
  const _D = (x: number) => _F(9) + x;
  const _L = (x: number) => _D(9) + x;
  const _B = (x: number) => _L(9) + x;
  return {
    // Centers
    centerFacelet: [4, 13, 22, 31, 40, 49],
    // Corners
    cornerFacelet: [
      [_U(9), _R(1), _F(3)],
      [_U(7), _F(1), _L(3)],
      [_U(1), _L(1), _B(3)],
      [_U(3), _B(1), _R(3)],
      [_D(3), _F(9), _R(7)],
      [_D(1), _L(9), _F(7)],
      [_D(7), _B(9), _L(7)],
      [_D(9), _R(9), _B(7)],
    ],
    // Edges
    edgeFacelet: [
      [_U(6), _R(2)],
      [_U(8), _F(2)],
      [_U(4), _L(2)],
      [_U(2), _B(2)],
      [_D(6), _R(8)],
      [_D(2), _F(8)],
      [_D(4), _L(8)],
      [_D(8), _B(8)],
      [_F(6), _R(4)],
      [_F(4), _L(6)],
      [_B(6), _L(4)],
      [_B(4), _R(6)],
    ],
  } as const;
};

// Rotate elements between l and r left by one place
export const rotateLeft = (array: number[], l: number, r: number) => {
  const tmp = array[l];
  for (
    let i = l, end = r - 1, asc = l <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    array[i] = array[i + 1];
  }
  return (array[r] = tmp);
};

// Rotate elements between l and r right by one place
export const rotateRight = (
  //   array: { [x: string]: T },
  array: number[],
  l: number,
  r: number
) => {
  const tmp = array[r];
  for (
    let i = r, end = l + 1, asc = r <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    array[i] = array[i - 1];
  }
  return (array[l] = tmp);
};

export const range = (left: number, right: number, inclusive: boolean) => {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
};
export const parseAlg = (arg: string | number[]) => {
  if (typeof arg === 'string') {
    // String
    const result: number[] = [];
    for (let part of arg.split(/\s+/)) {
      var power: number;
      if (part.length === 0) {
        // First and last can be empty
        continue;
      }

      if (part.length > 2) {
        throw new Error(`Invalid move: ${part}`);
      }

      // @ts-ignore
      const move = faceNums[part[0]];
      if (move === undefined) {
        throw new Error(`Invalid move: ${part}`);
      }

      if (part.length === 1) {
        power = 0;
      } else {
        if (part[1] === '2') {
          power = 1;
        } else if (part[1] === "'") {
          power = 2;
        } else {
          throw new Error(`Invalid move: ${part}`);
        }
      }
      result.push(move * 3 + power);
    }
    return result;
  } else if (arg.length != null) {
    // Already an array
    return arg;
  } else if (!Array.isArray(arg)) {
    // A single move
    return [arg];
  }
  return arg;
};
export const randomInt = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

// Fisher-Yates shuffle adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    const randomIndex = randomInt(0, currentIndex - 1);
    currentIndex -= 1;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = Array.from([
      array[randomIndex],
      array[currentIndex],
    ]);
  }
};

export const getNumSwaps = (arr: number[]) => {
  let numSwaps = 0;
  const seen = range(0, arr.length - 1, true).map(() => false);
  // We compute the cycle decomposition
  while (true) {
    let cur = -1;
    for (
      let i = 0, end = arr.length - 1, asc = 0 <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      if (!seen[i]) {
        cur = i;
        break;
      }
    }
    if (cur === -1) {
      break;
    }
    let cycleLength = 0;
    while (!seen[cur]) {
      seen[cur] = true;
      cycleLength++;
      cur = arr[cur];
    }
    // A cycle is equivalent to cycleLength + 1 swaps
    numSwaps += cycleLength + 1;
  }
  return numSwaps;
};

export const arePermutationsValid = (cp: number[], ep: number[]) => {
  const numSwaps = getNumSwaps(ep) + getNumSwaps(cp);
  return numSwaps % 2 === 0;
};

export const generateValidRandomPermutation = (cp: number[], ep: number[]) => {
  // Each shuffle only takes around 12 operations and there's a 50%
  // chance of a valid permutation so it'll finish in very good time
  shuffle(ep);
  shuffle(cp);
  while (!arePermutationsValid(cp, ep)) {
    shuffle(ep);
    shuffle(cp);
  }
};

export const randomizeOrientation = (
  arr: number[],
  numOrientations: number
) => {
  for (
    let i = 0, end = arr.length - 1, asc = 0 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    arr[i] = randomInt(0, numOrientations - 1);
  }
};

export const isOrientationValid = (arr: number[], numOrientations: number) =>
  arr.reduce((a, b) => a + b, 0) % numOrientations === 0;

export const generateValidRandomOrientation = (co: number[], eo: number[]) => {
  // There is a 1/2 and 1/3 probably respectively of each of these
  // succeeding so the probability of them running 10 times before
  // success is already only 1% and only gets exponentially lower
  // and each generation is only in the 10s of operations which is nothing
  randomizeOrientation(co, 3);
  while (!isOrientationValid(co, 3)) {
    randomizeOrientation(co, 3);
  }

  randomizeOrientation(eo, 2);
  while (!isOrientationValid(eo, 2)) {
    randomizeOrientation(eo, 2);
  }
};

// 8 values are encoded in one number
export const pruning = (table: number[], index: number, value?: number) => {
  const pos = index % 8;
  const slot = index >> 3;
  const shift = pos << 2;

  if (value !== null && value !== undefined) {
    // Set
    table[slot] &= ~(0xf << shift);
    table[slot] |= value << shift;
    return value;
  } else {
    // Get
    return (table[slot] & (0xf << shift)) >>> shift;
  }
};

export const computePruningTable = (
  phase: number,
  size: number,
  currentCoords: (arg0: number) => any,
  nextIndex: (arg0: any, arg1: any) => any
) => {
  let moves: number[];
  const table = range(0, Math.ceil(size / 8) - 1, true).fill(0xffffffff);
  if (phase === 1) {
    moves = allMoves1;
  } else {
    moves = allMoves2;
  }
  let depth = 0;
  pruning(table, 0, depth);
  let done = 1;
  while (done !== size) {
    for (
      let index = 0, end = size - 1, asc = 0 <= end;
      asc ? index <= end : index >= end;
      asc ? index++ : index--
    ) {
      if (pruning(table, index) === depth) {
        const current = currentCoords(index);
        for (let move of Array.from(moves)) {
          const next = nextIndex(current, move);
          if (pruning(table, next) === 0xf) {
            pruning(table, next, depth + 1);
            done++;
          }
        }
      }
    }
    depth++;
  }
  return table;
};

export const getNextMoves1 = () => {
  const result = [];
  for (let lastFace = 0; lastFace <= 5; lastFace++) {
    const next = [];
    // Don't allow commuting moves, e.g. U U'. Also make sure that
    // opposite faces are always moved in the same order, i.e. allow
    // U D but no D U. This avoids sequences like U D U'.
    for (let face = 0; face <= 5; face++) {
      if (face !== lastFace && face !== lastFace - 3) {
        for (let power = 0; power <= 2; power++) {
          // single, double or inverse move
          next.push(face * 3 + power);
        }
      }
    }
    result.push(next);
  }
  return result;
};

export const getNextMoves2 = () => {
  const result = [];
  for (let lastFace = 0; lastFace <= 5; lastFace++) {
    const next = [];
    for (let face = 0; face <= 5; face++) {
      // Allow all moves of U and D and double moves of others
      if (face !== lastFace && face !== lastFace - 3) {
        const powers = [0, 3].includes(face) ? [0, 1, 2] : [1];
        for (let power of Array.from(powers)) {
          next.push(face * 3 + power);
        }
      }
    }
    result.push(next);
  }
  return result;
};


