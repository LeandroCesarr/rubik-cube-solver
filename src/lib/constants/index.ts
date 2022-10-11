export const COLORS = [
  "Azul",
  "Vermelho",
  "Amarelo",
  "Laranja",
  "Verde",
  "Branco"
]

type FACE_TARGETS_MAP = Record<string, number>;

export const VERTICAL_FRONT_FACE_TARGETS_MAP: FACE_TARGETS_MAP = {
  0: 2,
  2: 4,
  4: 5,
  5: 0
}

export const VERTICAL_SIDE_FACE_TARGETS_MAP: FACE_TARGETS_MAP = {
  1: 5,
  2: 1,
  3: 2,
  5: 3
}

export const HORIZONTALLY_FACE_TARGETS_MAP: FACE_TARGETS_MAP = {
  0: 1,
  1: 4,
  3: 0,
  4: 3
}

export const VERTICAL_SIDE_FRONT_POSITIONS_MAP = {
  1: [2, 5, 8],
  2: [6, 7, 8],
  3: [0, 3, 6],
  5: [0, 1, 2],
}

export const VERTICAL_SIDE_BACK_POSITIONS_MAP = {
  1: [0, 3, 6],
  2: [0, 1, 2],
  3: [2, 5, 8],
  5: [6, 7, 8],
}