import {
  COLORS,
  FACE_ROTATION_MAP,
  HORIZONTALLY_FACE_TARGETS_MAP,
  SIDE_BACK_VERTICAL_FACE_POSITIONS,
  SIDE_FRONT_FACES_TO_INVERTE,
  SIDE_FRONT_VERTICAL_FACE_POSITIONS,
  VERTICAL_FRONT_FACE_TARGETS_MAP,
  VERTICAL_FRONT_POSITION_TARGET_MAP,
  VERTICAL_SIDE_FACE_TARGETS_MAP,
} from './modules/constants';
import { MOVEMENT } from './modules/enums';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFacesByMap(map: Record<number, number[]>): number[] {
  return Object.keys(map).map(key => Number(key));
}

export class Cube {
  private _faces: Array<number[]>;

  constructor(positions?: Array<number[]>) {
    this._faces = positions ?? Cube.GetDefaultState();
  }

  /**
   * Faces state
   * @readonly
   */
  public get faces(): Array<number[]> {
    return this._faces;
  }

  public get isSolved(): boolean {
    const defaultState = Cube.GetDefaultState();

    return this._faces.every((face, faceIndex) =>
      face.every((position, positionIndex) =>
        this._faces[faceIndex][positionIndex] === defaultState[faceIndex][positionIndex]
      )
    )
  }

  /**
   * Reset cube state
   */
  public reset(): void {
    this._faces = Cube.GetDefaultState();
  }

  /**
   * Shuffle the cube
   * @param count number of movements to shuffle
   * @returns
   */
  public shuffle(count?: number): MOVEMENT[] {
    const flattedMovements = Object.values(MOVEMENT);
    const movementsCount = flattedMovements.length - 1;

    const movements = Array.from({ length: count ?? 10 }).map(
      (_) => flattedMovements[getRandomInt(0, movementsCount)]
    );

    // TODO
    // Remover movimentos parentes seguidos
    // Remover duplicados seguidos

    movements.forEach((movement) => this.move(movement));

    return movements;
  }

  /**
   * Do many movements
   * @param moves
   */
  public moveMany(moves: MOVEMENT[]): void {
    moves.forEach((move) => this.move(move));
  }

  /**
   * Do many movements
   * @param moves
   */
   public moveSameMany(move: MOVEMENT, count: number): void {
    Array.from({ length: count })
      .forEach(_ => this.move(move));
  }

  /**
   * Do movement
   * @param movement
   */
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

  /**
   * Do horizontally movement
   * @param isUp
   * @param reverse
   */
  private moveHorizontally(isUp: boolean, reverse: boolean): void {
    const cloneState = this.createFacesClone();
    const initialIndex = isUp ? 0 : 6;

    this._faces.forEach((position, positionIndex) => {
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
      this.rotateFacePositions(2, !reverse);
    }

    if (!isUp) {
      this.rotateFacePositions(5, reverse);
    }
  }

  /**
   * Do side vertically movement
   * @param movement
   * @param reverse
   */
  private moveSideVertically(
    movement: MOVEMENT.FRONT | MOVEMENT.BACK,
    reverse: boolean
  ): void {
    const stateClone = this.createFacesClone();
    const isFront = movement === MOVEMENT.FRONT;
    const facesToChange = getFacesByMap(SIDE_FRONT_VERTICAL_FACE_POSITIONS);

    this._faces
      .forEach((_, faceIndex) => {
        if (facesToChange.includes(faceIndex)) {
          const facePositionsMap = isFront ? SIDE_FRONT_VERTICAL_FACE_POSITIONS : SIDE_BACK_VERTICAL_FACE_POSITIONS;
          const targetFaceIndex = this.getRealVerticalTargetFaceIndex(false, faceIndex, reverse);

          this.moveFaceVertically(faceIndex, targetFaceIndex, stateClone[targetFaceIndex], facePositionsMap)

        }
      });

    if (movement == MOVEMENT.FRONT) {
      this.rotateFacePositions(4, !reverse);
    }

    if (movement == MOVEMENT.BACK) {
      this.rotateFacePositions(0, reverse);
    }
  }

  /**
   * Move side vertically face
   * @param faceIndex
   * @param targetFaceIndex
   * @param faceStateClone
   * @param facePositionsMap
   */
  private moveFaceVertically(faceIndex: number, targetFaceIndex: number, faceStateClone: number[], facePositionsMap: Record<number, number[]>): void {
    const sourceFacePositionsIndex = [...facePositionsMap[faceIndex.toString()]];
    const targetFacePositionsIndex = [...facePositionsMap[targetFaceIndex.toString()]];
    const revertedMap = targetFacePositionsIndex.slice().reverse();

    sourceFacePositionsIndex.forEach((facePositionIndex, idx) => {
      const hasInverte = SIDE_FRONT_FACES_TO_INVERTE.some(group =>
        group.every(item => ((item === targetFaceIndex) || (item == faceIndex) ))
      );

      if (hasInverte) {
        this._faces[faceIndex][facePositionIndex] = faceStateClone[revertedMap[idx]];
      } else {
        this._faces[faceIndex][facePositionIndex] = faceStateClone[targetFacePositionsIndex[idx]];
      }
    });
  }

  /**
   * Do front vertically movement
   * @param movement
   * @param reverse
   */
  private moveFrontVertically(
    movement: MOVEMENT.LEFT | MOVEMENT.RIGHT,
    reverse: boolean
  ): void {
    const cloneState = this.createFacesClone();
    const isLeft = movement == MOVEMENT.LEFT;
    const initialIndex = isLeft ? 0 : 2;

    this._faces.forEach((position, positionIndex) => {
      if (positionIndex != 1 && positionIndex != 3) {
        const positionSourceMap = [...VERTICAL_FRONT_POSITION_TARGET_MAP];
        const positionTargetMap = [...VERTICAL_FRONT_POSITION_TARGET_MAP];
        const targetFaceIndex = this.getRealVerticalTargetFaceIndex(
          true,
          positionIndex,
          reverse
        );
        const targetPosition = cloneState[targetFaceIndex];

        const srcPositionIndex =
          positionIndex == 0 ? (!isLeft ? 0 : 2) : initialIndex;
        const targetPositionIndex =
          targetFaceIndex == 0 ? (!isLeft ? 0 : 2) : initialIndex;

        if (positionIndex == 0) {
          positionSourceMap.reverse();
        }

        if (targetFaceIndex == 0) {
          positionTargetMap.reverse();
        }

        position[positionSourceMap[0] + srcPositionIndex] =
          targetPosition[positionTargetMap[0] + targetPositionIndex];
        position[positionSourceMap[1] + srcPositionIndex] =
          targetPosition[positionTargetMap[1] + targetPositionIndex];
        position[positionSourceMap[2] + srcPositionIndex] =
          targetPosition[positionTargetMap[2] + targetPositionIndex];
      }
    });

    if (movement == MOVEMENT.RIGHT) {
      this.rotateFacePositions(3, !reverse);
    }

    if (movement == MOVEMENT.LEFT) {
      this.rotateFacePositions(1, reverse);
    }
  }

  /**
   * Get vertical target face by face index
   * @param faceIndex
   * @param reverse
   */
  private getRealVerticalTargetFaceIndex(
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

    return source[number.toString()];
  }

  /**
   * Get horizontal target face by face index
   * @param faceIndex
   * @param reverse
   */
  private getRealHorizontalIndex(faceIndex: number, reverse: boolean): number {
    const source = HORIZONTALLY_FACE_TARGETS_MAP;

    if (reverse) {
      return Number.parseInt(
        Object.entries(source).find(([key, value]) => value == faceIndex)?.[0] ??
          '0'
      );
    }

    return source[faceIndex];
  }

  /**
   * Rotate the face clockwise
   * @param faceIndex
   * @param reverse reverse the direction
   */
  private rotateFacePositions(faceIndex: number, reverse: boolean): void {
    const clonedFace = this.createFaceClone(faceIndex);

    Object.entries(FACE_ROTATION_MAP).forEach((map) => {
      if (reverse) {
        this._faces[faceIndex][map[1]] = clonedFace[map[0]];
      } else {
        this._faces[faceIndex][Number.parseInt(map[0])] = clonedFace[map[1]];
      }
    });
  }

  /**
   * Returns a face clone
   * @param faceIndex
   * @returns cloned face
   */
   private createFaceClone(faceIndex: number): number[] {
    return JSON.parse(JSON.stringify(this._faces[faceIndex]));
  }

  /**
   * Returns a faces clone
   * @returns cloned state
   */
  private createFacesClone(): Array<number[]> {
    return JSON.parse(JSON.stringify(this._faces));
  }

  /**
   * Returns the summary of faces in string
   * @returns
   */
  public toString(): string {
    return this._faces
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

  /**
   * Convert face number to its respective color
   * @param number
   * @returns
   */
  private convertToColorName(number: number): string {
    const index = Math.ceil(number / 9);

    return COLORS?.[index - 1] ?? 'Inválido';
  }

  /**
   * Format face number to always have two characters
   * @param faceNumber
   * @returns formatted face number
   */
  private formatFace(faceNumber: Number): string {
    return faceNumber.toString().padStart(2, '0');
  }

  /**
   * Returns cube default state
   */
  public static GetDefaultState(): Array<number[]> {
    return Array.from({ length: 6 }).map((_, idx) =>
      Array.from({ length: 9 }).map((_, itemIdx) => itemIdx + 1 + 9 * idx)
    );
  }
}
