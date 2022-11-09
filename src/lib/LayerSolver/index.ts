import { ASolver, FACES_TO_FIRST_LAYER_IGNORE } from "../ASolver";
import { Cube } from "../Cube";
import { MOVEMENT } from "../enums/Movement";
import {
  FACE_MOVEMENTS_MAP,
  POSITIONS_TO_FIRST_LAYER_CHECK,
  MAX_WHITE_CROSS_TRIES_COUNT,
  MAX_WHITE_FOREHEAD_TRIES_COUNT,
  VERTICAL_FULL_ROTATIONS_MAP,
  VERTICAL_ROTATIONS_MAP,
} from './constants';

export class LayerSolver extends ASolver {

  /**
   * Moves made
   */
  private _moves: MOVEMENT[] = [];

  /**
   * Mote to restore affected face by other face
   */
  private _movesToRestoreAffectedFaces: MOVEMENT[] = []

  /**
   * Returns if bottom layer is solved
   */
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

  /**
   * Return if white cross is done
   */
  public get isWhiteCrossDone(): boolean {
    return (
      this.cube.faces[5][1] === this.defaultState[5][1] &&
      this.cube.faces[5][3] === this.defaultState[5][3] &&
      this.cube.faces[5][5] === this.defaultState[5][5] &&
      this.cube.faces[5][7] === this.defaultState[5][7]
    )
  }

  /**
   * Move white forehead
   * @param value value of white forehead
   */
  private moveWhiteForehead(value: number): MOVEMENT[] {
    const moves = [];

    // White forehead data
    const [whiteFace, whitePosition] = this.getPositionCoordinatesByValue(value);
    const whiteFaceRotationMap = VERTICAL_ROTATIONS_MAP[whiteFace];
    const whiteFaceFullRotationMap = VERTICAL_FULL_ROTATIONS_MAP[whiteFace];
    const whiteFaceMovementsMap = FACE_MOVEMENTS_MAP[whiteFace];

    // Sibling data
    const siblingValue = this.getSiblingForeheadValue(value);
    const [siblingFace] = this.getPositionCoordinatesByValue(siblingValue);
    const [siblingOriginalFace] = this.getOriginalPositionCoordinatesByValue(siblingValue);
    const isSiblingForeheadInRightFace = this.isSiblingForeheadInRightFace(value);
    const siblingRotationMap = VERTICAL_ROTATIONS_MAP[siblingFace];

    // Distances
    const horizontalSiblingFaceTargetDistance = this.getHorizontalTargetFaceMoveCount(siblingFace, siblingOriginalFace);
    const horizontalFaceTargetDistance = this.getHorizontalTargetFaceMoveCount(whiteFace, siblingOriginalFace);

    // resolve quando ta a branca ta na em cima ou baixo nas laterais e a testa ta perto do destino
    if (
      (whitePosition === 1 || whitePosition === 7) &&
      Math.abs(horizontalFaceTargetDistance) === 1 &&
      !FACES_TO_FIRST_LAYER_IGNORE.includes(whiteFace)
    ) {
      console.log('#1');

      const originalSiblingFaceMap = FACE_MOVEMENTS_MAP[siblingOriginalFace];
      const rotationDirection = horizontalFaceTargetDistance >= 1 ? "right" : "left";
      const verticalMap = originalSiblingFaceMap.vertical[rotationDirection];

      moves.push(verticalMap[whitePosition === 1 ? "bottom" : "top"])
      this._movesToRestoreAffectedFaces.push(verticalMap[whitePosition === 1 ? "top" : "bottom"])

      // to solve apos
    }

    // resolve quando ta a branca ta na em cima ou baixo nas laterais e a testa ta longe do destino
    if (
      (whitePosition === 1 || whitePosition === 7) &&
      Math.abs(horizontalFaceTargetDistance) !== 1 &&
      !FACES_TO_FIRST_LAYER_IGNORE.includes(whiteFace)
    ) {
      console.log('#2');

      if (whitePosition === 7) {
        moves.push(...whiteFaceFullRotationMap)
      }

      if (horizontalFaceTargetDistance === 0) {
        moves.push(whiteFaceMovementsMap.horizontal.top.right)
      }

      if (horizontalFaceTargetDistance !== 0) {
        moves.push(whiteFaceMovementsMap.horizontal.top[horizontalFaceTargetDistance >= 1 ? "left" : "right"])
      }
    }

    if (
      (whitePosition === 3 || whitePosition === 5) &&
      !isSiblingForeheadInRightFace &&
      !FACES_TO_FIRST_LAYER_IGNORE.includes(whiteFace)
    ) {
      console.log('#THE LAST', Math.abs(horizontalFaceTargetDistance));

      if (Math.abs(horizontalFaceTargetDistance) === 1) {

        moves.push(...whiteFaceFullRotationMap);
        this._movesToRestoreAffectedFaces.push(...whiteFaceFullRotationMap)
      }

      if (Math.abs(horizontalFaceTargetDistance) !== 1) {
        moves.push(whiteFaceRotationMap[whitePosition === 3 ? 1 : 0])
        moves.push(whiteFaceMovementsMap.horizontal.top.left)
        moves.push(whiteFaceRotationMap[whitePosition === 3 ? 0 : 1])
      }
    }

    // resolve quando ta a branca ta na em cima ou baixo nas laterais e a testa ta no lugar certo
    if (
      (whitePosition === 3 || whitePosition === 5) &&
      isSiblingForeheadInRightFace &&
      !FACES_TO_FIRST_LAYER_IGNORE.includes(whiteFace)
    ) {
      console.log('#3');

      moves.push(siblingRotationMap[horizontalFaceTargetDistance >= 1 ? 1 : 0]);

      if (this._movesToRestoreAffectedFaces.length) {
        moves.push(...this._movesToRestoreAffectedFaces)
        this._movesToRestoreAffectedFaces = [];
      }
    }

    // resolve quando ta a branca ta na amarela e a testa ta na face certa
    if (whiteFace === 2 && isSiblingForeheadInRightFace) {
      console.log('#4');

      // rotate faces
      const rotationMap = VERTICAL_FULL_ROTATIONS_MAP[siblingFace];

      moves.push(...rotationMap);
    }

    // resolve quando ta a branca ta na amarela e a testa nao ta na face certa
    if (whiteFace === 2 && !isSiblingForeheadInRightFace) {
      console.log('#5');

      const { horizontal } = FACE_MOVEMENTS_MAP[siblingFace];
      const directionMove = horizontalSiblingFaceTargetDistance >= 1 ? horizontal.top.left : horizontal.top.right;

      moves.push(...Array.from({ length: Math.abs(horizontalSiblingFaceTargetDistance) }).fill(directionMove))
    }

    // resolve quando ta a branca ta na branca e a testa nao ta na face certa
    if (whiteFace === 5 && !isSiblingForeheadInRightFace) {
      console.log('#THE LAST LAST MESMO');

      const rotationMap = VERTICAL_FULL_ROTATIONS_MAP[siblingFace];

      moves.push(...rotationMap);
    }

    return moves;
  }

  /**
   * Solve white forehead
   * @param value value of white forehead
   */
  private solveWhiteForehead(value: number): void {
    let tries = 0;
    let isForeheadSolved = false;

    while (!isForeheadSolved && tries <= MAX_WHITE_FOREHEAD_TRIES_COUNT) {
      const moves = this.moveWhiteForehead(value);

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