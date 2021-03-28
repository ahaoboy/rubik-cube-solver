import { faceNums, faceNames } from './constants';
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
  return [
    // Centers
    [4, 13, 22, 31, 40, 49],
    // Corners
    [
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
    [
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
  ] as const;
};

// Rotate elements between l and r left by one place
export const rotateLeft = <T>(array: number[], l: number, r: number) => {
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
export const rotateRight = <T>(
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
  let ori = 0;
  for (
    let i = 0, end = arr.length - 1, asc = 0 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    ori += arr[i] = randomInt(0, numOrientations - 1);
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
