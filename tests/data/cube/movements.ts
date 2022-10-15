import { MOVEMENT } from '../../../src/lib/enums/Movement';

export const movements = [
  {
    moves: [MOVEMENT.RIGHT],
    state: [
      [27, 2, 3, 24, 5, 6, 21, 8, 9],
      [10, 11, 12, 13, 14, 15, 16, 17, 18],
      [19, 20, 39, 22, 23, 42, 25, 26, 45],
      [34, 31, 28, 35, 32, 29, 36, 33, 30],
      [37, 38, 48, 40, 41, 51, 43, 44, 54],
      [46, 47, 7, 49, 50, 4, 52, 53, 1],
    ],
  },
  {
    moves: [MOVEMENT.RIGHT_REVERSE],
    state: [
      [54, 2, 3, 51, 5, 6, 48, 8, 9],
      [10, 11, 12, 13, 14, 15, 16, 17, 18],
      [19, 20, 7, 22, 23, 4, 25, 26, 1],
      [30, 33, 36, 29, 32, 35, 28, 31, 34],
      [37, 38, 21, 40, 41, 24, 43, 44, 27],
      [46, 47, 39, 49, 50, 42, 52, 53, 45],
    ],
  },
  {
    moves: [MOVEMENT.LEFT],
    state: [
      [1, 2, 52, 4, 5, 49, 7, 8, 46],
      [16, 13, 10, 17, 14, 11, 18, 15, 12],
      [9, 20, 21, 6, 23, 24, 3, 26, 27],
      [28, 29, 30, 31, 32, 33, 34, 35, 36],
      [19, 38, 39, 22, 41, 42, 25, 44, 45],
      [37, 47, 48, 40, 50, 51, 43, 53, 54],
    ],
  },
  {
    moves: [MOVEMENT.UP],
    state: [
      [10, 11, 12, 4, 5, 6, 7, 8, 9],
      [37, 38, 39, 13, 14, 15, 16, 17, 18],
      [25, 22, 19, 26, 23, 20, 27, 24, 21],
      [1, 2, 3, 31, 32, 33, 34, 35, 36],
      [28, 29, 30, 40, 41, 42, 43, 44, 45],
      [46, 47, 48, 49, 50, 51, 52, 53, 54],
    ],
  },
  {
    moves: [MOVEMENT.DOWN],
    state: [
      [1, 2, 3, 4, 5, 6, 34, 35, 36],
      [10, 11, 12, 13, 14, 15, 7, 8, 9],
      [19, 20, 21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, 32, 33, 43, 44, 45],
      [37, 38, 39, 40, 41, 42, 16, 17, 18],
      [52, 49, 46, 53, 50, 47, 54, 51, 48],
    ],
  },
  {
    moves: [MOVEMENT.DOWN_REVERSE],
    state: [
      [1, 2, 3, 4, 5, 6, 16, 17, 18],
      [10, 11, 12, 13, 14, 15, 43, 44, 45],
      [19, 20, 21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, 32, 33, 7, 8, 9],
      [37, 38, 39, 40, 41, 42, 34, 35, 36],
      [48, 51, 54, 47, 50, 53, 46, 49, 52],
    ],
  },
  {
    moves: [MOVEMENT.FRONT],
    state: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [10, 11, 46, 13, 14, 47, 16, 17, 48],
      [19, 20, 21, 22, 23, 24, 18, 15, 12],
      [25, 29, 30, 26, 32, 33, 27, 35, 36],
      [43, 40, 37, 44, 41, 38, 45, 42, 39],
      [34, 31, 28, 49, 50, 51, 52, 53, 54],
    ],
  },
  {
    moves: [MOVEMENT.FRONT_REVERSE],
    state: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [10, 11, 27, 13, 14, 26, 16, 17, 25],
      [19, 20, 21, 22, 23, 24, 28, 31, 34],
      [48, 29, 30, 47, 32, 33, 46, 35, 36],
      [39, 42, 45, 38, 41, 44, 37, 40, 43],
      [12, 15, 18, 49, 50, 51, 52, 53, 54],
    ],
  },
  {
    moves: [MOVEMENT.BACK],
    state: [
      [7, 4, 1, 8, 5, 2, 9, 6, 3],
      [21, 11, 12, 20, 14, 15, 19, 17, 18],
      [30, 33, 36, 22, 23, 24, 25, 26, 27],
      [28, 29, 54, 31, 32, 53, 34, 35, 52],
      [37, 38, 39, 40, 41, 42, 43, 44, 45],
      [46, 47, 48, 49, 50, 51, 10, 13, 16],
    ],
  },
  {
    moves: [MOVEMENT.BACK_REVERSE],
    state: [
      [3, 6, 9, 2, 5, 8, 1, 4, 7],
      [52, 11, 12, 53, 14, 15, 54, 17, 18],
      [16, 13, 10, 22, 23, 24, 25, 26, 27],
      [28, 29, 19, 31, 32, 20, 34, 35, 21],
      [37, 38, 39, 40, 41, 42, 43, 44, 45],
      [46, 47, 48, 49, 50, 51, 36, 33, 30],
    ],
  },
  {
    moves: [
      MOVEMENT.FRONT,
      MOVEMENT.FRONT_REVERSE,
      MOVEMENT.FRONT,
      MOVEMENT.FRONT_REVERSE,
      MOVEMENT.FRONT,
    ],
    state: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [10, 11, 46, 13, 14, 47, 16, 17, 48],
      [19, 20, 21, 22, 23, 24, 18, 15, 12],
      [25, 29, 30, 26, 32, 33, 27, 35, 36],
      [43, 40, 37, 44, 41, 38, 45, 42, 39],
      [34, 31, 28, 49, 50, 51, 52, 53, 54],
    ],
  },
];
