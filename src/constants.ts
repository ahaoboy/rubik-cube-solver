export const CENTERS = [0, 1, 2, 3, 4, 5] as const;
export const CORNERS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
export const EDGES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export const CENTER_COLOR = ['U', 'R', 'F', 'D', 'L', 'B'] as const;
export const CORNER_COLOR = [
  ['U', 'R', 'F'],
  ['U', 'F', 'L'],
  ['U', 'L', 'B'],
  ['U', 'B', 'R'],
  ['D', 'F', 'R'],
  ['D', 'L', 'F'],
  ['D', 'B', 'L'],
  ['D', 'R', 'B'],
] as const;

export const EDGE_COLOR = [
  ['U', 'R'],
  ['U', 'F'],
  ['U', 'L'],
  ['U', 'B'],
  ['D', 'R'],
  ['D', 'F'],
  ['D', 'L'],
  ['D', 'B'],
  ['F', 'R'],
  ['F', 'L'],
  ['B', 'L'],
  ['B', 'R'],
] as const;

export const faceNums = {
  U: 0,
  R: 1,
  F: 2,
  D: 3,
  L: 4,
  B: 5,
  E: 6,
  M: 7,
  S: 8,
  x: 9,
  y: 10,
  z: 11,
  u: 12,
  r: 13,
  f: 14,
  d: 15,
  l: 16,
  b: 17,
} as const;

export const faceNames = {
  0: 'U',
  1: 'R',
  2: 'F',
  3: 'D',
  4: 'L',
  5: 'B',
  6: 'E',
  7: 'M',
  8: 'S',
  9: 'x',
  10: 'y',
  11: 'z',
  12: 'u',
  13: 'r',
  14: 'f',
  15: 'd',
  16: 'l',
  17: 'b',
} as const;
