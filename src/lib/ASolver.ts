import { Cube } from '@/lib/Cube';

const HORIZONTAL_FACE_SEQUENCE = [0, 1, 4, 3];
const FACE_CORNER_SEQUENCE = [0, 2, 8, 6];

const FOREHEADS_MAP = {
  2: 20,
  4: 33,
  6: 13,
  8: 53,
  11: 22,
  15: 40,
  17: 49,
  24: 29,
  26: 38,
  31: 42,
  35: 51,
  44: 47,
};

export const FACES_TO_FIRST_LAYER_IGNORE = [2, 5];

export interface IPositionLocation {
  face: number;
  position: number;
}

export interface ICornerMap {
  top: [number, number];
  left: [number, number];
  right: [number, number];
}

const CORNERS_MAP: ICornerMap[] = [
  {
    top: [2, 0],
    left: [0, 2],
    right: [1, 0]
  },
  {
    top: [2, 6],
    left: [1, 2],
    right: [4, 0]
  },
  {
    top: [2, 8],
    left: [4, 2],
    right: [3, 0]
  },
  {
    top: [2, 2],
    left: [3, 2],
    right:[ 0, 0]
  },
  {
    top: [5, 0],
    right: [4, 6],
    left: [1, 8]
  },
  {
    top: [5, 6],
    right: [1, 6],
    left:[0, 6]
  },
  {
    top: [5, 8],
    right: [0, 8],
    left: [3, 8]
  },
  {
    top: [5, 2],
    right: [3, 6],
    left: [4, 8]
  },
]

export abstract class ASolver {
  protected cube: Cube;

  constructor(protected readonly originalCube: Cube) {
    this.cube = new Cube(JSON.parse(JSON.stringify(originalCube.faces)));
  }

  abstract solve(): void;

  protected get defaultState(): Array<number[]> {
    return Cube.GetDefaultState();
  }

  protected getPrevOrNextHorizontalFace(face: number, prev: boolean): number {
    const currentSequenceIndex = HORIZONTAL_FACE_SEQUENCE.indexOf(face);

    if (currentSequenceIndex === HORIZONTAL_FACE_SEQUENCE.length -1 && !prev) {
      return 0
    }

    if (currentSequenceIndex === 0 && prev) {
      return HORIZONTAL_FACE_SEQUENCE[HORIZONTAL_FACE_SEQUENCE.length - 1];
    }

    if (prev) {
      return HORIZONTAL_FACE_SEQUENCE[currentSequenceIndex - 1];
    }

    return HORIZONTAL_FACE_SEQUENCE[currentSequenceIndex + 1];
  }

  /**
   * Positivo -> esquerda
   * @param currentFaceIndex
   * @param targetFaceIndex
   * @returns
   */
  protected getHorizontalTargetFaceMoveCount(currentFaceIndex: number, targetFaceIndex: number): number {
    const currentSequenceIndex = HORIZONTAL_FACE_SEQUENCE.indexOf(currentFaceIndex);
    const targetSequenceIndex = HORIZONTAL_FACE_SEQUENCE.indexOf(targetFaceIndex);
    const count = currentSequenceIndex - targetSequenceIndex;

    // TODO: improve this, se mudar array vai dar ruim
    if (currentFaceIndex === 3 && targetFaceIndex === 0) {
      return -1;
    }

    if (currentFaceIndex === 0 && targetFaceIndex === 3) {
      return 1;
    }

    return count;
  }

  /**
   * Positivo -> esquerda
   * @param currentFaceIndex
   * @param targetFaceIndex
   * @returns
   */
   protected geCornerTargetFaceMoveCount(currentPosition: number, targetPosition: number): number {
    const currentSequenceIndex = FACE_CORNER_SEQUENCE.indexOf(currentPosition);
    const targetSequenceIndex = FACE_CORNER_SEQUENCE.indexOf(targetPosition);
    const count = currentSequenceIndex - targetSequenceIndex;
    // const count2 =  targetSequenceIndex - currentSequenceIndex;
    // const minus = Math.min(count, count2)

    // console.log({
    //   currentPosition, targetPosition, currentSequenceIndex, targetSequenceIndex
    // });


    // TODO: improve this, se mudar array vai dar ruim
    if (currentPosition === 6 && targetPosition === 0) {
      return -1;
    }

    if (currentPosition === 0 && targetPosition === 6) {
      return 1;
    }

    return count;
  }

  protected isSiblingForeheadInRightFace(foreheadValue: number): boolean {
    const siblingValue = this.getSiblingForeheadValue(foreheadValue);
    const coordinates = this.getPositionCoordinatesByValue(siblingValue);

    const originalCoordinates = this.getOriginalPositionCoordinatesByValue(siblingValue);

    return coordinates[0] === originalCoordinates[0];
  }

  protected getSiblingForeheadValue(value: number): number {
    const FOREHEADS_MAP_INVERSE = Object.fromEntries(
      Object
        .entries(FOREHEADS_MAP)
        .map(([key, value]) => ([value, key]))
    )

    return Number.parseInt(FOREHEADS_MAP[value] || FOREHEADS_MAP_INVERSE[value]);
  }

  protected getOriginalPositionCoordinatesByValue(positionValue: number): [number, number] {
    const faceIndex = this.defaultState.findIndex(face => face.includes(positionValue));

    return [
      faceIndex,
      this.defaultState[faceIndex].findIndex(position => position === positionValue)
    ]
  }

  protected getPositionCoordinatesByValue(positionValue: number): [number, number] {
    const faceIndex = this.cube.faces.findIndex(face => face.includes(positionValue));

    return [
      faceIndex,
      this.cube.faces[faceIndex].findIndex(position => position === positionValue)
    ]
  }

  protected getForeheadsPositionsByFace(face: number): IPositionLocation[] {
    const includedFacePositions = this.getForeheadsByFace(face);

    return this.cube.faces.reduce<IPositionLocation[]>((acc, face, faceIndex) => {
      face.forEach((position, positionIndex) => {
        if (includedFacePositions.includes(position)) {
          acc.push({
            face: faceIndex,
            position: positionIndex
          })
        }
      })

      return acc;
    }, []);
  }

  protected getForeheadPositionsBySiblingValue(siblingValue: number): IPositionLocation {
    return this.cube.faces.reduce<IPositionLocation[]>((acc, face, faceIndex) => {
      face.forEach((position, positionIndex) => {
        if (position === siblingValue) {
          acc.push({
            face: faceIndex,
            position: positionIndex
          })
        }
      })

      return acc;
    }, [])[0];
  }

  protected getForeheadsByFace(face: number): number[] {
    return Object.entries(FOREHEADS_MAP).reduce((acc, curr) =>  {
      if (Math.ceil(Number.parseInt(curr[0]) / 9) - 1 === face) {
        return [...acc, Number.parseInt(curr[0])]
      }

      if (Math.ceil(curr[1] / 9) - 1 === face) {
        return [...acc, curr[1]]
      }

      return acc;
    }, [])
  }

  protected getCornersByFace(face: number): [number, number, number, number] {
    const faceData = this.defaultState[face];

    return [
      faceData[0],
      faceData[2],
      faceData[6],
      faceData[8]
    ]
  }

  protected getCornerMapByValue(value: number): ICornerMap {
    const coordinates = this.getPositionCoordinatesByValue(value);

    return CORNERS_MAP.find((map) =>
      Object
        .values(map)
        .map((values) => values.join())
        .includes(coordinates.join())
    );
  }

  protected getTargetCornerPosition(position: number) {
    const map = {
      0: 6,
      2: 8,
      6: 0,
      8: 2
    };

    return map[position];
  }
}
