import { ASolver, FACES_TO_FIRST_LAYER_IGNORE, IPositionLocation } from "./ASolver";
import { Cube } from "./Cube";
import { MOVEMENT } from "./enums/Movement";


const POSITIONS_TO_FIRST_LAYER_CHECK = [6, 7, 8];

const  VERTICAL_FULL_ROTATIONS_MAP = {
  1: [MOVEMENT.LEFT_DOUBLE],
  3: [MOVEMENT.RIGHT_DOUBLE],
  4: [MOVEMENT.FRONT, MOVEMENT.FRONT],
  0: [MOVEMENT.BACK, MOVEMENT.BACK]
}

const VERTICAL_ROTATIONS_MAP: Record<number, [MOVEMENT, MOVEMENT]> = {
  0: [MOVEMENT.BACK_REVERSE, MOVEMENT.BACK],
  1: [MOVEMENT.LEFT_REVERSE, MOVEMENT.LEFT],
  3: [MOVEMENT.RIGHT_REVERSE, MOVEMENT.RIGHT],
  4: [MOVEMENT.FRONT_REVERSE, MOVEMENT.FRONT],
}

interface IFaceMovementMap {
  vertical: {
    left: {
      top: MOVEMENT;
      bottom: MOVEMENT;
    },
    right: {
      top: MOVEMENT;
      bottom: MOVEMENT;
    }
  },
  horizontal: {
    top: {
      left: MOVEMENT;
      right: MOVEMENT;
    },
    bottom: {
      left: MOVEMENT;
      right: MOVEMENT;
    }
  }
}

const FACE_MOVEMENTS_MAP: Record<number, IFaceMovementMap> = {
  0: {
    vertical: {
      left: {
        top: MOVEMENT.RIGHT_REVERSE,
        bottom: MOVEMENT.RIGHT
      },
      right: {
        top: MOVEMENT.LEFT,
        bottom: MOVEMENT.LEFT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  1: {
    vertical: {
      left: {
        top: MOVEMENT.BACK_REVERSE,
        bottom: MOVEMENT.BACK
      },
      right: {
        top: MOVEMENT.FRONT,
        bottom: MOVEMENT.FRONT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  2: {
    vertical: {
      left: {
        top: MOVEMENT.LEFT_REVERSE,
        bottom: MOVEMENT.LEFT
      },
      right: {
        top: MOVEMENT.RIGHT,
        bottom: MOVEMENT.RIGHT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.BACK,
        right: MOVEMENT.BACK_REVERSE
      },
      bottom: {
        left: MOVEMENT.FRONT_REVERSE,
        right: MOVEMENT.FRONT
      }
    }
  },
  3: {
    vertical: {
      left: {
        top: MOVEMENT.FRONT_REVERSE,
        bottom: MOVEMENT.FRONT
      },
      right: {
        top: MOVEMENT.BACK,
        bottom: MOVEMENT.BACK_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  4: {
    vertical: {
      left: {
        top: MOVEMENT.LEFT_REVERSE,
        bottom: MOVEMENT.LEFT
      },
      right: {
        top: MOVEMENT.RIGHT,
        bottom: MOVEMENT.RIGHT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  5: {
    vertical: {
      left: {
        top: MOVEMENT.LEFT_REVERSE,
        bottom: MOVEMENT.LEFT
      },
      right: {
        top: MOVEMENT.RIGHT,
        bottom: MOVEMENT.RIGHT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.FRONT,
        right: MOVEMENT.FRONT_REVERSE
      },
      bottom: {
        left: MOVEMENT.BACK_REVERSE,
        right: MOVEMENT.BACK
      }
    }
  }
}

const MAX_WHITE_CROSS_TRIES_COUNT = 5;
const MAX_WHITE_FOREHEAD_TRIES_COUNT = 5;

export class LayerSolver extends ASolver {
  private _moves: MOVEMENT[] = [];

  private _movesToRestoreAffectedFaces: MOVEMENT[] = []

  public get isBottomLayerSolved(): boolean {
    const defaultState = Cube.GetDefaultState();
    const isWhiteFaceSolved = this.cube.faces[5]
      .every((position, positionIndex) => defaultState[5][positionIndex] === position);

    const isSidesSolved = this.cube.faces.every((face, faceIndex) => {
      if (FACES_TO_FIRST_LAYER_IGNORE.includes(faceIndex))
        return true

      return face.every((position, positionIndex) => {
        if (POSITIONS_TO_FIRST_LAYER_CHECK.includes(positionIndex)) {
          return position === defaultState[faceIndex][positionIndex];
        }

        return true
      })
    })

    return isWhiteFaceSolved && isSidesSolved;
  }

  public get isWhiteCrossDone(): boolean {
    return (
      this.cube.faces[5][1] === this.defaultState[5][1] &&
      this.cube.faces[5][3] === this.defaultState[5][3] &&
      this.cube.faces[5][5] === this.defaultState[5][5] &&
      this.cube.faces[5][7] === this.defaultState[5][7]
    )
  }

  private solveWhiteForehead(value: number): void {
    let tries = 0;
    let isForeheadSolved = false;

    while (!isForeheadSolved && tries <= MAX_WHITE_FOREHEAD_TRIES_COUNT) {
      const moves = [];
      const coordinates = this.getPositionCoordinatesByValue(value);
      const siblingValue = this.getSiblingForeheadValue(value);
      const siblingCoordinates = this.getPositionCoordinatesByValue(siblingValue);
      const siblingOriginalCoordinates = this.getOriginalPositionCoordinatesByValue(siblingValue);
      const isSiblingForeheadInRightFace = this.isSiblingForeheadInRightFace(value);

      const horizontalFaceTargetDistance = this.getHorizontalTargetFaceMoveCount(coordinates[0], siblingOriginalCoordinates[0]);
      const horizontalSiblingFaceTargetDistance = this.getHorizontalTargetFaceMoveCount(siblingCoordinates[0], siblingOriginalCoordinates[0]);

      if (tries === 0) {
        console.log({
          value,
          coordinates,
          isSiblingForeheadInRightFace,
          horizontalFaceTargetDistance,
          horizontalSiblingFaceTargetDistance
        });
      }

      // resolve quando ta a branca ta na em cima ou baixo nas laterais e a testa ta perto do destino
      if (
        (coordinates[1] === 1 || coordinates[1] === 7) &&
        Math.abs(horizontalFaceTargetDistance) === 1 &&
        !FACES_TO_FIRST_LAYER_IGNORE.includes(coordinates[0])
      ) {
        console.log('#1');

        const originalSiblingFaceMap = FACE_MOVEMENTS_MAP[siblingOriginalCoordinates[0]];
        const rotationDirection = horizontalFaceTargetDistance >= 1 ? "right" : "left";
        const verticalMap = originalSiblingFaceMap.vertical[rotationDirection];

        if (coordinates[1] === 1) {
          moves.push(verticalMap.bottom)

          this._movesToRestoreAffectedFaces.push(verticalMap.top)
        }

        if (coordinates[1] === 7) {
          moves.push(verticalMap.top)

          this._movesToRestoreAffectedFaces.push(verticalMap.bottom)
        }

        // to solve apos
      }

      // resolve quando ta a branca ta na em cima ou baixo nas laterais e a testa ta longe do destino
      if (
        (coordinates[1] === 1 || coordinates[1] === 7) &&
        Math.abs(horizontalFaceTargetDistance) !== 1 &&
        !FACES_TO_FIRST_LAYER_IGNORE.includes(coordinates[0])
      ) {
        console.log('#2');

        const rotationMap = VERTICAL_FULL_ROTATIONS_MAP[coordinates[0]];
        const faceMovementMap = FACE_MOVEMENTS_MAP[coordinates[0]];

        if (coordinates[1] === 7) {
          moves.push(...rotationMap)
        }

        if (horizontalFaceTargetDistance === 0) {
          moves.push(faceMovementMap.horizontal.top.right)
        }

        if (horizontalFaceTargetDistance !== 0) {
          moves.push(faceMovementMap.horizontal.top[horizontalFaceTargetDistance >= 1 ? "left" : "right"])
        }
      }

      if (
        (coordinates[1] === 3 || coordinates[1] === 5) &&
        !isSiblingForeheadInRightFace &&
        !FACES_TO_FIRST_LAYER_IGNORE.includes(coordinates[0])
      ) {
        console.log('#THE LAST', Math.abs(horizontalFaceTargetDistance));

        if (Math.abs(horizontalFaceTargetDistance) === 1) {
          const rotationMap = VERTICAL_FULL_ROTATIONS_MAP[coordinates[0]];

          moves.push(...rotationMap);
          this._movesToRestoreAffectedFaces.push(...rotationMap)
        }

        if (Math.abs(horizontalFaceTargetDistance) !== 1) {
          const faceMovementMap = FACE_MOVEMENTS_MAP[coordinates[0]];
          const rotationMap = VERTICAL_ROTATIONS_MAP[coordinates[0]];

          moves.push(rotationMap[coordinates[1] === 3 ? 1 : 0])
          moves.push(faceMovementMap.horizontal.top.left)
          moves.push(rotationMap[coordinates[1] === 3 ? 0 : 1])
        }
      }

      // resolve quando ta a branca ta na em cima ou baixo nas laterais e a testa ta no lugar certo
      if (
        (coordinates[1] === 3 || coordinates[1] === 5) &&
        isSiblingForeheadInRightFace &&
        !FACES_TO_FIRST_LAYER_IGNORE.includes(coordinates[0])
      ) {
        console.log('#3');

        const rotationMap = VERTICAL_ROTATIONS_MAP[siblingCoordinates[0]];

        moves.push(rotationMap[horizontalFaceTargetDistance >= 1 ? 1 : 0]);

        if (this._movesToRestoreAffectedFaces.length) {
          moves.push(...this._movesToRestoreAffectedFaces)
          this._movesToRestoreAffectedFaces = [];
        }
      }

      // resolve quando ta a branca ta na amarela e a testa ta na face certa
      if (coordinates[0] === 2 && isSiblingForeheadInRightFace) {
        console.log('#4');

        // rotate faces
        const rotationMap = VERTICAL_FULL_ROTATIONS_MAP[siblingCoordinates[0]];

        moves.push(...rotationMap);
      }

      // resolve quando ta a branca ta na amarela e a testa nao ta na face certa
      if (coordinates[0] === 2 && !isSiblingForeheadInRightFace) {
        console.log('#5');

        const { horizontal } = FACE_MOVEMENTS_MAP[siblingCoordinates[0]];
        const directionMove = horizontalSiblingFaceTargetDistance >= 1 ? horizontal.top.left : horizontal.top.right;

        moves.push(...Array.from({ length: Math.abs(horizontalSiblingFaceTargetDistance) }).fill(directionMove))
      }

      // resolve quando ta a branca ta na branca e a testa nao ta na face certa
      if (coordinates[0] === 5 && !isSiblingForeheadInRightFace) {
        console.log('#THE LAST LAST MESMO');

        const rotationMap = VERTICAL_FULL_ROTATIONS_MAP[siblingCoordinates[0]];

        moves.push(...rotationMap);
      }

      this._moves.push(...moves);
      this.cube.moveMany(moves);

      console.log({
        moves
      });

      tries++;
      isForeheadSolved = this.isPositionInRightPlace(
        ...this.getPositionCoordinatesByValue(value)
      );
    }
  }

  private setWhiteCross(): void {
    const whiteForeheadValues = this.getForeheadsByFace(5);

    let tries = 0;

    while(!this.isWhiteCrossDone && tries < MAX_WHITE_CROSS_TRIES_COUNT) {
      whiteForeheadValues.forEach(value => {
        const valueCoordinates = this.getPositionCoordinatesByValue(value);

        if (!this.isPositionInRightPlace(...valueCoordinates)) {
          this.solveWhiteForehead(value)
        }
      })

      console.log("looped", this._moves);
      tries++;
    }
  }

  private isPositionInRightPlace(face: number, position: number): boolean {
    return this.defaultState[face][position] === this.cube.faces[face][position];
  }

  private solveFirstLayer(): void {
    this.setWhiteCross();
  }

  public async getSolve(): Promise<MOVEMENT[]> {
    if (this.cube.isSolved) {
      throw new Error("Cube already solved");
    }

    this.solveFirstLayer();

    return new Promise((resolve) => resolve(this._moves));
  }

  public async solve(): Promise<void> {
    const moves = await this.getSolve();

    console.log({ moves });

    this.originalCube.moveMany(moves);
  }
}