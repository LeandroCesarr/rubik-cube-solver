import {
  COLORS,
  HORIZONTALLY_FACE_TARGETS_MAP,
  VERTICAL_FRONT_FACE_TARGETS_MAP,
  VERTICAL_SIDE_BACK_POSITIONS_MAP,
  VERTICAL_SIDE_FACE_TARGETS_MAP,
  VERTICAL_SIDE_FRONT_POSITIONS_MAP,
} from './constants';
import { MOVEMENT } from './enums/Movement';

export class Cube {
  public readonly positions: Array<number[]>;

  constructor(positions?: Array<number[]>) {
    this.positions =
      positions ??
      Array.from({ length: 6 }).map((_, idx) =>
        Array.from({ length: 9 }).map((_, itemIdx) => itemIdx + 1 + 9 * idx)
      );
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
      this.moveFrontVertically(MOVEMENT.LEFT, false);
    }

    // L'
    if (movement == MOVEMENT.LEFT_REVERSE) {
      this.moveFrontVertically(MOVEMENT.LEFT, true);
    }

    // L2
    if (movement == MOVEMENT.LEFT_DOUBLE) {
      this.moveFrontVertically(MOVEMENT.LEFT, false);
      this.moveFrontVertically(MOVEMENT.LEFT, false);
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
      this.moveHorizontally(false, false);
    }

    // D'
    if (movement == MOVEMENT.DOWN_REVERSE) {
      this.moveHorizontally(false, true);
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
      this.moveSideVertically(MOVEMENT.BACK, false);
    }

    // B'
    if (movement == MOVEMENT.BACK_REVERSE) {
      this.moveSideVertically(MOVEMENT.BACK, true);
    }
  }

  private moveHorizontally(isUp: boolean, reverse: boolean): void {
    const cloneState = this.createClone();
    const initialIndex = isUp ? 0 : 6;

    this.positions.forEach((position, positionIndex) => {
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

    this.positions.forEach((position, positionIndex) => {
      if (positionIndex != 0 && positionIndex != 4) {
        const targetFaceIndex = this.getRealVerticalIndex(
          false,
          positionIndex,
          reverse
        );

        const targetPosition = cloneState[targetFaceIndex];
        const targetMap = positionsMap[positionIndex];
        const sourceMap = positionsMap[targetFaceIndex];

        position[targetMap[0]] = targetPosition[sourceMap[0]];
        position[targetMap[1]] = targetPosition[sourceMap[1]];
        position[targetMap[2]] = targetPosition[sourceMap[2]];
      }
    });
  }

  private moveFrontVertically(
    movement: MOVEMENT.LEFT | MOVEMENT.RIGHT,
    reverse: boolean
  ): void {
    const cloneState = this.createClone();
    const initialIndex = movement == MOVEMENT.LEFT ? 0 : 2;

    this.positions.forEach((position, positionIndex) => {
      if (positionIndex != 1 && positionIndex != 3) {
        const targetPosition =
          cloneState[this.getRealVerticalIndex(true, positionIndex, reverse)];

        position[initialIndex] = targetPosition[initialIndex];
        position[initialIndex + 3] = targetPosition[initialIndex + 3];
        position[initialIndex + 6] = targetPosition[initialIndex + 6];
      }
    });
  }

  private createClone(): Array<number[]> {
    return this.positions.map((item) => [...item]);
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

  public toString(): string {
    return this.positions
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
}
