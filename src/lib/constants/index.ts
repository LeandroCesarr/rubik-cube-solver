export const COLORS = [
  "Azul",
  "Vermelho",
  "Amarelo",
  "Laranja",
  "Verde",
  "Branco"
]

export const VERTICAL_FRONT_FACE_MAP: Record<string, number> = {
  0: 2,
  2: 4,
  4: 5,
  5: 0
}

export const VERTICAL_SIDE_FACE_MAP: Record<string, number> = {
  1: 5,
  2: 1,
  3: 2,
  5: 3
}

export const VERTICAL_SIDE_MOVE_MAP = {
  1: [2, 5, 8],
  2: [6, 7, 8],
  3: [0, 3, 6],
  5: [0, 1, 2],
}