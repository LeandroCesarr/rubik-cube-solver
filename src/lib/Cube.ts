import {
  COLORS,
  FACE_ROTATION_MAP,
  HORIZONTALLY_FACE_TARGETS_MAP,
  VERTICAL_FRONT_FACE_TARGETS_MAP,
  VERTICAL_FRONT_POSITION_TARGET_MAP,
  VERTICAL_SIDE_BACK_POSITIONS_MAP,
  VERTICAL_SIDE_FACE_TARGETS_MAP,
  VERTICAL_SIDE_FRONT_POSITIONS_MAP,
} from './constants';
import { MOVEMENT } from './enums/Movement';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Cube {
  private _positions: Array<number[]>;

  constructor(positions?: Array<number[]>) {
    this._positions = positions ?? Cube.GetDefaultPositions();
  }

  public get positions(): Array<number[]> {
    return this._positions;
  }

  public reset(): void {
    this._positions = Cube.GetDefaultPositions();
  }

  public shuffle(count?: number): void {
    const flattedMovements = Object.values(MOVEMENT);
    const movementsCount = flattedMovements.length - 1;

    const movements = Array.from({ length: count ?? 5 }).map(
      (_) => flattedMovements[getRandomInt(0, movementsCount)]
    );

    // TODO
    // Remover movimentos parentes seguidos
    // Remover duplicados seguidos

    console.log(movements);

    movements.forEach((movement) => this.move(movement));
  }

  public move(movement: MOVEMENT): void {
    // R
    if (movement == MOVEMENT.RIGHT) {
      this.moveFrontVertically(MOVEMENT.RIGHT, false);
    }

    // R'
    if (movement == MOVEMENT.RIGHT_REVERSE) {
      this.moveFrontVertically(MOVEMENT.RIGHT, true);
    }

    // R2
    if (movement == MOVEMENT.RIGHT_DOUBLE) {
      this.moveFrontVertically(MOVEMENT.RIGHT, false);
      this.moveFrontVertically(MOVEMENT.RIGHT, false);
    }

    // L
    if (movement == MOVEMENT.LEFT) {
      this.moveFrontVertically(MOVEMENT.LEFT, true);
    }

    // L'
    if (movement == MOVEMENT.LEFT_REVERSE) {
      this.moveFrontVertically(MOVEMENT.LEFT, false);
    }

    // L2
    if (movement == MOVEMENT.LEFT_DOUBLE) {
      this.moveFrontVertically(MOVEMENT.LEFT, true);
      this.moveFrontVertically(MOVEMENT.LEFT, true);
    }

    // U
    if (movement == MOVEMENT.UP) {
      this.moveHorizontally(true, false);
    }

    // U'
    if (movement == MOVEMENT.UP_REVERSE) {
      this.moveHorizontally(true, true);
    }

    // D
    if (movement == MOVEMENT.DOWN) {
      this.moveHorizontally(false, true);
    }

    // D'
    if (movement == MOVEMENT.DOWN_REVERSE) {
      this.moveHorizontally(false, false);
    }

    // F
    if (movement == MOVEMENT.FRONT) {
      this.moveSideVertically(MOVEMENT.FRONT, false);
    }

    // F'
    if (movement == MOVEMENT.FRONT_REVERSE) {
      this.moveSideVertically(MOVEMENT.FRONT, true);
    }

    // B
    if (movement == MOVEMENT.BACK) {
      this.moveSideVertically(MOVEMENT.BACK, true);
    }

    // B'
    if (movement == MOVEMENT.BACK_REVERSE) {
      this.moveSideVertically(MOVEMENT.BACK, false);
    }
  }

  private moveHorizontally(isUp: boolean, reverse: boolean): void {
    const cloneState = this.createClone();
    const initialIndex = isUp ? 0 : 6;

    this._positions.forEach((position, positionIndex) => {
      if (positionIndex != 2 && positionIndex != 5) {
        const targetFaceIndex = this.getRealHorizontalIndex(
          positionIndex,
          reverse
        );
        const targetPosition = cloneState[targetFaceIndex];

        position[initialIndex] = targetPosition[initialIndex];
        position[initialIndex + 1] = targetPosition[initialIndex + 1];
        position[initialIndex + 2] = targetPosition[initialIndex + 2];
      }
    });

    if (isUp) {
      this.rotateFacePositions(2, !reverse)
    }

    if (!isUp) {
      this.rotateFacePositions(5, !reverse)
    }
  }

  private moveSideVertically(
    movement: MOVEMENT.FRONT | MOVEMENT.BACK,
    reverse: boolean
  ): void {
    const cloneState = this.createClone();
    const isBack = movement == MOVEMENT.BACK;
    const positionsMap = isBack
      ? VERTICAL_SIDE_BACK_POSITIONS_MAP
      : VERTICAL_SIDE_FRONT_POSITIONS_MAP;

    this._positions.forEach((position, positionIndex) => {
      if (positionIndex != 0 && positionIndex != 4) {
        const targetFaceIndex = this.getRealVerticalIndex(
          false,
          positionIndex,
          reverse
        );

        const targetPosition = cloneState[targetFaceIndex];
        const targetMap = positionsMap[positionIndex];
        const sourceMap = positionsMap[targetFaceIndex];

        if (positionIndex == 5) {
          targetMap.reverse();
        }

        position[targetMap[0]] = targetPosition[sourceMap[0]];
        position[targetMap[1]] = targetPosition[sourceMap[1]];
        position[targetMap[2]] = targetPosition[sourceMap[2]];
      }
    });

    if (movement == MOVEMENT.FRONT) {
      this.rotateFacePositions(4, !reverse)
    }

    if (movement == MOVEMENT.BACK) {
      this.rotateFacePositions(0, reverse)
    }
  }

  private moveFrontVertically(
    movement: MOVEMENT.LEFT | MOVEMENT.RIGHT,
    reverse: boolean
  ): void {
    const cloneState = this.createClone();
    const isLeft = movement == MOVEMENT.LEFT;
    const initialIndex = isLeft ? 0 : 2;

    this._positions.forEach((position, positionIndex) => {
      if (positionIndex != 1 && positionIndex != 3) {
        const positionSourceMap = [...VERTICAL_FRONT_POSITION_TARGET_MAP];
        const positionTargetMap = [...VERTICAL_FRONT_POSITION_TARGET_MAP];
        const targetFaceIndex = this.getRealVerticalIndex(true, positionIndex, reverse);
        const targetPosition = cloneState[targetFaceIndex];

        const srcPositionIndex = positionIndex == 0 ? (!isLeft ? 0 : 2) : initialIndex;
        const targetPositionIndex = targetFaceIndex == 0 ? (!isLeft ? 0 : 2) : initialIndex;

        if (positionIndex == 0) {
          positionSourceMap.reverse();
        }

        if (targetFaceIndex == 0) {
          positionTargetMap.reverse();
        }

        position[positionSourceMap[0] + srcPositionIndex] = targetPosition[positionTargetMap[0] + targetPositionIndex];
        position[positionSourceMap[1] + srcPositionIndex] = targetPosition[positionTargetMap[1] + targetPositionIndex];
        position[positionSourceMap[2] + srcPositionIndex] = targetPosition[positionTargetMap[2] + targetPositionIndex];
      }
    });

    if (movement == MOVEMENT.RIGHT) {
      this.rotateFacePositions(3, !reverse)
    }

    if (movement == MOVEMENT.LEFT) {
      this.rotateFacePositions(1, reverse)
    }
  }

  private createClone(): Array<number[]> {
    return this._positions.map((item) => [...item]);
  }

  private getRealVerticalIndex(
    isFront: boolean,
    number: number,
    reverse: boolean
  ): number {
    const source = isFront
      ? VERTICAL_FRONT_FACE_TARGETS_MAP
      : VERTICAL_SIDE_FACE_TARGETS_MAP;

    if (reverse) {
      return Number.parseInt(
        Object.entries(source).find(([key, value]) => value == number)?.[0] ??
          '0'
      );
    }

    return source[number];
  }

  private getRealHorizontalIndex(number: number, reverse: boolean): number {
    const source = HORIZONTALLY_FACE_TARGETS_MAP;

    if (reverse) {
      return Number.parseInt(
        Object.entries(source).find(([key, value]) => value == number)?.[0] ??
          '0'
      );
    }

    return source[number];
  }

  private rotateFacePositions(faceIndex: number, reverse: boolean): void {
    const clonedFace = [...this._positions[faceIndex]];

    Object.entries(FACE_ROTATION_MAP).forEach((map) => {
      if (reverse) {
        this._positions[faceIndex][map[1]] = clonedFace[map[0]]
      } else {
        this._positions[faceIndex][Number.parseInt(map[0])] = clonedFace[map[1]]
      }
    })
  }

  public toString(): string {
    return this._positions
      .map(
        (face, idx) =>
          `Face #${idx} \n${face
            .map(
              (position) =>
                `${this.formatFace(position)} - ${this.convertToColorName(
                  position
                )}`
            )
            .join('\n')}`
      )
      .join('\n\n\n');
  }

  private convertToColorName(number: number): string {
    const index = Math.ceil(number / 9);

    return COLORS?.[index - 1] ?? 'Inválido';
  }

  private formatFace(number: Number): string {
    return number.toString().padStart(2, '0');
  }

  public static GetDefaultPositions(): Array<number[]> {
    return Array.from({ length: 6 }).map((_, idx) =>
      Array.from({ length: 9 }).map((_, itemIdx) => itemIdx + 1 + 9 * idx)
    );
  }
}
