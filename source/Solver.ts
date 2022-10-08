const COLORS = [
  "Azul",
  "Vermelho",
  "Amarelo",
  "Laranja",
  "Verde",
  "Branco"
]

const VERTICAL_FRONT_FACE_MAP = {
  0: 2,
  2: 4,
  4: 5,
  5: 0
}

const VERTICAL_SIDE_FACE_MAP = {
  1: 5,
  2: 1,
  3: 2,
  5: 3
}

const VERTICAL_SIDE_MOVE_MAP = {
  1: [2, 5, 8],
  2: [6, 7, 8],
  3: [0, 3, 6],
  5: [0, 1, 2],
}

function convertToColorName(number: number): string {
  const index = Math.ceil(number / 9);

  return COLORS?.[index - 1] ?? "Inválido";
}

enum MOVEMENT {
  RIGHT = "R",
  RIGHT_REVERSE = "R'",
  RIGHT_DOUBLE = "R2",
  LEFT = "L",
  LEFT_REVERSE = "L'",
  LEFT_DOUBLE = "L2",
  UP = "U",
  DOWN = "D",
  FRONT = "F",
  FRONT_REVERSE = "F'",
  BACK = "B"
}

type CubeMap = Array<number[]>;

class Cube {
  public positions: CubeMap;

  public move(movement: MOVEMENT): void {
    if (movement == MOVEMENT.RIGHT) {
      this.moveFrontVertically(MOVEMENT.RIGHT, false)
    }

    if (movement == MOVEMENT.RIGHT_REVERSE) {
      this.moveFrontVertically(MOVEMENT.RIGHT, true)
    }

    if (movement == MOVEMENT.RIGHT_DOUBLE) {
      this.moveFrontVertically(MOVEMENT.RIGHT, false)
      this.moveFrontVertically(MOVEMENT.RIGHT, false)
    }

    if (movement == MOVEMENT.LEFT) {
      this.moveFrontVertically(MOVEMENT.LEFT, false)
    }

    if (movement == MOVEMENT.FRONT) {
      this.moveSideHorizontally(MOVEMENT.FRONT, false)
    }

    if (movement == MOVEMENT.FRONT_REVERSE) {
      this.moveSideHorizontally(MOVEMENT.FRONT, true)
    }

    if (movement == MOVEMENT.BACK) {
      this.moveSideHorizontally(MOVEMENT.BACK, false)
    }
  }

  private moveSideHorizontally(movement: MOVEMENT.FRONT | MOVEMENT.BACK, reverse: boolean): void {
    const cloneState = this.createClone();

    this.positions.forEach((position, positionIndex) => {

      if (positionIndex != 0 && positionIndex != 4) {

        const targetIndex = this.getRealVerticalIndex(false, positionIndex, reverse);
        const targetPosition = cloneState[targetIndex];

        const targetMap = VERTICAL_SIDE_MOVE_MAP[positionIndex];
        const sourceMap = VERTICAL_SIDE_MOVE_MAP[targetIndex];

        position[targetMap[0]] = targetPosition[sourceMap[0]];
        position[targetMap[1]] = targetPosition[sourceMap[1]];
        position[targetMap[2]] = targetPosition[sourceMap[2]];
      }
    })
  }

  private moveFrontVertically(movement: MOVEMENT.LEFT | MOVEMENT.RIGHT, reverse: boolean): void {
    const cloneState = this.createClone();
    const initialIndex = movement == MOVEMENT.LEFT ? 0 : 2;

    this.positions.forEach((position, positionIndex) => {

      if (positionIndex != 1 && positionIndex != 3 ) {
        const targetPosition = cloneState[this.getRealVerticalIndex(true, positionIndex, reverse)];

        position[initialIndex] = targetPosition[initialIndex];
        position[initialIndex + 3] = targetPosition[initialIndex + 3];
        position[initialIndex + 6] = targetPosition[initialIndex + 6];
      }
    })
  }

  private createClone(): CubeMap {
    return this.positions.map(item => [...item]);
  }

  private getRealVerticalIndex(isFront: boolean, number: number, reverse: boolean): number {
    const source = isFront ? VERTICAL_FRONT_FACE_MAP : VERTICAL_SIDE_FACE_MAP;

    if (reverse) {
      return Number
        .parseInt(
          Object
            .entries(source)
            .find(([key, value]) => value == number)?.[0] ?? "0"
        );
    }

    return source[number];
  }

  public toString(): string {
    return this.positions
      .map((face, idx) => `Face #${idx} \n${face.map((position) => `${this.formatFace(position)} - ${convertToColorName(position)}`).join("\n")}`)
      .join("\n\n\n");
  }

  private formatFace(number: Number): string {
    return number.toString().padStart(2, "0")
  }
}

class Solver {

}

const cube = new Cube();

cube.positions = Array.from({ length: 6 })
  .map((_, idx) => Array.from({ length: 9 })
    .map((_, itemIdx) => (itemIdx + 1) + (9 * idx)));

console.log(cube.positions);

console.log("\n==========================================\n");

console.log(cube.toString());

console.log("\n==========================================\n");

// cube.move(MOVEMENT.RIGHT);
cube.move(MOVEMENT.FRONT_REVERSE);
// cube.move(MOVEMENT.LEFT);

console.log(cube.toString());