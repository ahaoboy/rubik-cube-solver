import {
  CENTERS,
  CORNERS,
  EDGES,
  CENTER_COLOR,
  CORNER_COLOR,
  EDGE_COLOR,
  faceNames,
} from './constants';
import {
  initFacelet,
  parseAlg,
  generateValidRandomOrientation,
  generateValidRandomPermutation,
} from './utils';
import type {CubeState} from './type'
// Centers
const [U, R, F, D, L, B] = CENTERS;
// Corners
const [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = CORNERS;
// Edges
const [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = EDGES;

const { cornerFacelet, edgeFacelet} = initFacelet();


class Cube {
  moves: Array<{
    center: number[];
    co: number[];
    ep: number[];
    cp: number[];
    eo: number[];
  }>;
  newCenter: number[] = [];
  newCp: number[] = [];
  newEp: number[] = [];
  newCo: number[] = [];
  newEo: number[] = [];
  center: number[] = [];
  co: number[] = [];
  ep: number[] = [];
  cp: number[] = [];
  eo: number[] = [];
  randomize() {
    generateValidRandomPermutation(this.cp, this.ep);
    generateValidRandomOrientation(this.co, this.eo);
  }

   initClass() {
   
  }
  constructor(other?: CubeState) {
    this.moves = [
      // U
      {
        center: [0, 1, 2, 3, 4, 5],
        cp: [UBR, URF, UFL, ULB, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UB, UR, UF, UL, DR, DF, DL, DB, FR, FL, BL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },

      // R
      {
        center: [0, 1, 2, 3, 4, 5],
        cp: [DFR, UFL, ULB, URF, DRB, DLF, DBL, UBR],
        co: [2, 0, 0, 1, 1, 0, 0, 2],
        ep: [FR, UF, UL, UB, BR, DF, DL, DB, DR, FL, BL, UR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },

      // F
      {
        center: [0, 1, 2, 3, 4, 5],
        cp: [UFL, DLF, ULB, UBR, URF, DFR, DBL, DRB],
        co: [1, 2, 0, 0, 2, 1, 0, 0],
        ep: [UR, FL, UL, UB, DR, FR, DL, DB, UF, DF, BL, BR],
        eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
      },

      // D
      {
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF, UFL, ULB, UBR, DLF, DBL, DRB, DFR],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UR, UF, UL, UB, DF, DL, DB, DR, FR, FL, BL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },

      // L
      {
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF, ULB, DBL, UBR, DFR, UFL, DLF, DRB],
        co: [0, 1, 2, 0, 0, 2, 1, 0],
        ep: [UR, UF, BL, UB, DR, DF, FL, DB, FR, UL, DL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },

      // B
      {
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF, UFL, UBR, DRB, DFR, DLF, ULB, DBL],
        co: [0, 0, 1, 2, 0, 0, 2, 1],
        ep: [UR, UF, UL, BR, DR, DF, DL, BL, FR, FL, UB, DB],
        eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      },

      // E
      {
        center: [U, F, L, D, B, R],
        cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UR, UF, UL, UB, DR, DF, DL, DB, FL, BL, BR, FR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      },

      // M
      {
        center: [B, R, U, F, L, D],
        cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UR, UB, UL, DB, DR, UF, DL, DF, FR, FL, BL, BR],
        eo: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
      },

      // S
      {
        center: [L, U, F, R, D, B],
        cp: [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UL, UF, DL, UB, UR, DF, DR, DB, FR, FL, BL, BR],
        eo: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      },
    ];

    // x
    this.moves.push(new Cube().move("R M' L'").toJSON());

    // y
    this.moves.push(new Cube().move("U E' D'").toJSON());

    // z
    this.moves.push(new Cube().move("F S B'").toJSON());

    // u
    this.moves.push(new Cube().move("U E'").toJSON());

    // r
    this.moves.push(new Cube().move("R M'").toJSON());

    // f
    this.moves.push(new Cube().move('F S').toJSON());

    // d
    this.moves.push(new Cube().move('D E').toJSON());

    // l
    this.moves.push(new Cube().move('L M').toJSON());

    // b
    this.moves.push(new Cube().move("B S'").toJSON());

    if (other) {
      this.init(other);
    } else {
      this.identity();
    }

    // For moves to avoid allocating new objects each time
    this.newCenter = Array(6)
      .fill(0)
      .map((_, k) => k);
    this.newCp = Array(8).fill(0);
    this.newEp = Array(12).fill(0);
    this.newCo = Array(8).fill(0);
    this.newEo = Array(12).fill(0);
    this.initClass()
  }

  init(state:CubeState) {
    this.center = state.center.slice(0);
    this.co = state.co.slice(0);
    this.ep = state.ep.slice(0);
    this.cp = state.cp.slice(0);
    return (this.eo = state.eo.slice(0));
  }

  identity() {
    // Initialize to the identity cube
    let x: number;
    this.center = [0, 1, 2, 3, 4, 5];
    this.cp = [0, 1, 2, 3, 4, 5, 6, 7];
    this.co = (() => {
      const result = [];
      for (x = 0; x <= 7; x++) {
        result.push(0);
      }
      return result;
    })();
    this.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return (this.eo = (() => {
      const result1 = [];
      for (x = 0; x <= 11; x++) {
        result1.push(0);
      }
      return result1;
    })());
  }

  toJSON() {
    return {
      center: this.center,
      cp: this.cp,
      co: this.co,
      ep: this.ep,
      eo: this.eo,
    };
  }

  asString() {
    let i: number, n: number, ori: any;
    const result = [];

    for (i = 0; i <= 5; i++) {
      result[9 * i + 4] = CENTER_COLOR[this.center[i]];
    }

    for (i = 0; i <= 7; i++) {
      const corner = this.cp[i];
      ori = this.co[i];
      for (n = 0; n <= 2; n++) {
        result[cornerFacelet[i][(n + ori) % 3]] = CORNER_COLOR[corner][n];
      }
    }

    for (i = 0; i <= 11; i++) {
      const edge = this.ep[i];
      ori = this.eo[i];
      for (n = 0; n <= 1; n++) {
        result[edgeFacelet[i][(n + ori) % 2]] = EDGE_COLOR[edge][n];
      }
    }

    return result.join('');
  }

  static fromString(str: string) {
    let i: number, j: number;
    const cube = new Cube();

    for (i = 0; i <= 5; i++) {
      for (j = 0; j <= 5; j++) {
        if (str[9 * i + 4] === CENTER_COLOR[j]) {
          cube.center[i] = j;
        }
      }
    }

    for (i = 0; i <= 7; i++) {
      var ori: number;
      for (ori = 0; ori <= 2; ori++) {
        if (['U', 'D'].includes(str[cornerFacelet[i][ori]])) {
          break;
        }
      }
      const col1 = str[cornerFacelet[i][(ori + 1) % 3]];
      const col2 = str[cornerFacelet[i][(ori + 2) % 3]];

      for (j = 0; j <= 7; j++) {
        if (col1 === CORNER_COLOR[j][1] && col2 === CORNER_COLOR[j][2]) {
          cube.cp[i] = j;
          cube.co[i] = ori % 3;
        }
      }
    }

    for (i = 0; i <= 11; i++) {
      for (j = 0; j <= 11; j++) {
        if (
          str[edgeFacelet[i][0]] === EDGE_COLOR[j][0] &&
          str[edgeFacelet[i][1]] === EDGE_COLOR[j][1]
        ) {
          cube.ep[i] = j;
          cube.eo[i] = 0;
          break;
        }
        if (
          str[edgeFacelet[i][0]] === EDGE_COLOR[j][1] &&
          str[edgeFacelet[i][1]] === EDGE_COLOR[j][0]
        ) {
          cube.ep[i] = j;
          cube.eo[i] = 1;
          break;
        }
      }
    }

    return cube;
  }

  clone() {
    return new Cube(this.toJSON());
  }

  // A class method returning a new random cube
  static random() {
    return new Cube().randomize();
  }

  isSolved() {
    const clone = this.clone();
    clone.move(clone.upright());

    for (let cent = 0; cent <= 5; cent++) {
      if (clone.center[cent] !== cent) {
        return false;
      }
    }

    for (let c = 0; c <= 7; c++) {
      if (clone.cp[c] !== c) {
        return false;
      }
      if (clone.co[c] !== 0) {
        return false;
      }
    }

    for (let e = 0; e <= 11; e++) {
      if (clone.ep[e] !== e) {
        return false;
      }
      if (clone.eo[e] !== 0) {
        return false;
      }
    }

    return true;
  }

  // Multiply this Cube with another Cube, restricted to centers.
  centerMultiply(other: CubeState) {
    let from: string | number;
    for (let to = 0; to <= 5; to++) {
      from = other.center[to];
      this.newCenter[to] = this.center[from];
    }

    [this.center, this.newCenter] = Array.from([this.newCenter, this.center]);
    return this;
  }

  // Multiply this Cube with another Cube, restricted to corners.
  cornerMultiply(other: CubeState) {
    let from: string | number;
    for (let to = 0; to <= 7; to++) {
      from = other.cp[to];
      this.newCp[to] = this.cp[from];
      this.newCo[to] = (this.co[from] + other.co[to]) % 3;
    }

    [this.cp, this.newCp] = Array.from([this.newCp, this.cp]);
    [this.co, this.newCo] = Array.from([this.newCo, this.co]);
    return this;
  }

  // Multiply this Cube with another Cube, restricted to edges
  edgeMultiply(other: CubeState) {
    let from: string | number;
    for (let to = 0; to <= 11; to++) {
      from = other.ep[to];
      this.newEp[to] = this.ep[from];
      this.newEo[to] = (this.eo[from] + other.eo[to]) % 2;
    }

    [this.ep, this.newEp] = Array.from([this.newEp, this.ep]);
    [this.eo, this.newEo] = Array.from([this.newEo, this.eo]);
    return this;
  }

  // Multiply this cube with another Cube
  multiply(other: any) {
    this.centerMultiply(other);
    this.cornerMultiply(other);
    this.edgeMultiply(other);
    return this;
  }

  move(arg: string) {
    for (let move of parseAlg(arg)) {
      const face = (move / 3) | 0;
      const power = move % 3;
      for (
        let x = 0, end = power, asc = 0 <= end;
        asc ? x <= end : x >= end;
        asc ? x++ : x--
      ) {
        this.multiply(this.moves[face]);
      }
    }

    return this;
  }

  upright() {
    let i: number, j: number;
    const clone = this.clone();
    const result = [];
    for (i = 0; i <= 5; i++) {
      if (clone.center[i] === F) {
        break;
      }
    }
    switch (i) {
      case D:
        result.push('x');
        break;
      case U:
        result.push("x'");
        break;
      case B:
        result.push('x2');
        break;
      case R:
        result.push('y');
        break;
      case L:
        result.push("y'");
        break;
    }
    if (result.length) {
      clone.move(result[0]);
    }
    for (j = 0; j <= 5; j++) {
      if (clone.center[j] === U) {
        break;
      }
    }
    switch (j) {
      case L:
        result.push('z');
        break;
      case R:
        result.push("z'");
        break;
      case D:
        result.push('z2');
        break;
    }
    return result.join(' ');
  }

  static inverse(arg: number[]) {
    let move: number, face: number, power: number;
    const result = (() => {
      const result1 = [];
      for (move of Array.from(parseAlg(arg))) {
        face = (move / 3) | 0;
        power = move % 3;
        result1.push(face * 3 + -(power - 1) + 1);
      }
      return result1;
    })();

    result.reverse();

    if (typeof arg === 'string') {
      let str = '';
      for (move of Array.from(result)) {
        face = (move / 3) | 0;
        power = move % 3;

        // @ts-ignore
        str += faceNames[face];
        if (power === 1) {
          str += '2';
        } else if (power === 2) {
          str += "'";
        }
        str += ' ';
      }
      return str.substring(0, str.length - 1);
    } else if (arg.length != null) {
      return result;
    } else {
      return result[0];
    }
  }
}
export default Cube;
