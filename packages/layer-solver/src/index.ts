import { getFaceByPosition } from "./helpers/getFaceByPosition";
import { getYellowPatternTargetFace } from "./helpers/getYellowPatternTargetFace";
import { ASolver, FACES_TO_FIRST_LAYER_IGNORE } from "abstract-solver";
import { Cube } from "cube";
import { MOVEMENT } from "cube/src/modules/enums";
import {
  FACE_MOVEMENTS_MAP,
  POSITIONS_TO_FIRST_LAYER_CHECK,
  MAX_WHITE_CROSS_TRIES_COUNT,
  MAX_WHITE_FOREHEAD_TRIES_COUNT,
  VERTICAL_FULL_ROTATIONS_MAP,
  VERTICAL_ROTATIONS_MAP,
  MAX_WHITE_CORNERS_TRIES_COUNT,
  MAX_WHITE_CORNER_TRIES_COUNT,
  POSITIONS_TO_SECOND_LAYER_CHECK,
  MAX_MIDDLE_FOREHEAD_TRIES_COUNT,
  YELLOW_CROSS_CASES,
  FOREHEADS_POSITIONS,
  MAX_YELLOW_CROSS_TRIES_COUNT,
} from './modules/constants';

export class LayerSolver extends ASolver {

  /**
   * Moves made
   */
  private _moves: MOVEMENT[] = [];

  /**
   * Mote to restore affected face by other face
   */
  private _movesToRestoreAffectedFaces: MOVEMENT[] = []

  private _faceToYellowCrossChange = 4;
  private _faceToYellowFaceChange = 4;

  public get isYellowCrossSolved(): boolean {
    return (
      getFaceByPosition(this.cube.faces[2][1]) === 2 &&
      getFaceByPosition(this.cube.faces[2][3]) === 2 &&
      getFaceByPosition(this.cube.faces[2][5]) === 2 &&
      getFaceByPosition(this.cube.faces[2][7]) === 2
    )
  }

  public get isYellowForeheadsSolved(): boolean {
    return this.cube.faces
      .filter((_, faceIndex) => ![2, 5].includes(faceIndex))
      .every((face) => {
        return face.slice(0, 3).every(position => getFaceByPosition(face[0]) === getFaceByPosition(position))
      })
  }

  public get isYellowCornersSolved(): boolean {
    return this.cube.faces
      .filter((_, faceIndex) => ![2, 5].includes(faceIndex))
      .every((face) => {
        return getFaceByPosition(face[0]) == getFaceByPosition(face[2])
      })
  }

  public get isYellowFaceSolved(): boolean {
    return this.cube.faces[2]
      .every((position) => getFaceByPosition(position) === 2);
  }

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
   * Returns if middle layer is solved
   */
   public get isMiddleLayerSolved(): boolean {
    const defaultState = Cube.GetDefaultState();
    const isWhiteFaceSolved = this.cube.faces[5]
      .every((position, positionIndex) => defaultState[5][positionIndex] === position);

    const isSidesSolved = this.cube.faces.every((face, faceIndex) => {
      if (FACES_TO_FIRST_LAYER_IGNORE.includes(faceIndex))
        return true

      return face.every((position, positionIndex) => {
        if (POSITIONS_TO_SECOND_LAYER_CHECK.includes(positionIndex)) {
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

  private isPositionInRightPlace(face: number, position: number): boolean {
    return this.defaultState[face][position] === this.cube.faces[face][position];
  }

  /**
   * Move middle forehead
   * @param value value of middle forehead
   */
   private moveMiddleForehead(value: number): MOVEMENT[] {
    const moves: MOVEMENT[] = [];

    // middle forehead data
    const [middleFace, middlePosition] = this.getPositionCoordinatesByValue(value);
    const [middleOriginalFace] = this.getOriginalPositionCoordinatesByValue(value);

    // Sibling data
    const siblingValue = this.getSiblingForeheadValue(value);
    const [siblingFace] = this.getPositionCoordinatesByValue(siblingValue);
    const [siblingOriginalFace] = this.getOriginalPositionCoordinatesByValue(siblingValue);
    const siblingNextFace = this.getPrevOrNextHorizontalFace(siblingFace, false);
    const siblingFaceMovementMap = FACE_MOVEMENTS_MAP[siblingFace];
    const siblingRotationMap = VERTICAL_ROTATIONS_MAP[siblingFace];

    // Distances
    const horizontalSiblingFaceTargetDistance = this.getHorizontalTargetFaceMoveCount(siblingFace, siblingOriginalFace);

    if (
      siblingFace === 2 ||
      (![middleFace, siblingFace].includes(2) && middlePosition !== 5)
    ) {
      return this.moveMiddleForehead(siblingValue);
    }

    // movements
    const leftMovements = [
      siblingFaceMovementMap.horizontal.top.left,
      siblingFaceMovementMap.vertical.right.top,
      siblingFaceMovementMap.horizontal.top.left,
      siblingFaceMovementMap.vertical.right.bottom,
      siblingFaceMovementMap.horizontal.top.right,
      siblingRotationMap[0],
      siblingFaceMovementMap.horizontal.top.right,
      siblingRotationMap[1]
    ];

    const rightMovements = [
      siblingFaceMovementMap.horizontal.top.right,
      siblingFaceMovementMap.vertical.left.top,
      siblingFaceMovementMap.horizontal.top.right,
      siblingFaceMovementMap.vertical.left.bottom,
      siblingFaceMovementMap.horizontal.top.left,
      siblingRotationMap[1],
      siblingFaceMovementMap.horizontal.top.left,
      siblingRotationMap[0]
    ];

    if (
      middleFace === 2 &&
      horizontalSiblingFaceTargetDistance !== 0
    ) {
      const horizontalTopMap = siblingFaceMovementMap.horizontal.top;
      const directionMove = horizontalSiblingFaceTargetDistance >= 1 ? horizontalTopMap.left : horizontalTopMap.right;

      moves.push(...(Array.from({ length: Math.abs(horizontalSiblingFaceTargetDistance) }).fill(directionMove) as MOVEMENT[]))
    }

    if (
      middleFace === 2 &&
      horizontalSiblingFaceTargetDistance === 0
    ) {
      moves.push(...(siblingNextFace === middleOriginalFace ? leftMovements : rightMovements));
    }

    if (![middleFace, siblingFace].includes(2)) {
      moves.push(...rightMovements)
    }

    return moves;
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
    const whiteFaceFullRotationMap = (VERTICAL_FULL_ROTATIONS_MAP as any)[whiteFace];
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
      // console.log('#1');

      const originalSiblingFaceMap = FACE_MOVEMENTS_MAP[siblingOriginalFace];
      const rotationDirection = horizontalFaceTargetDistance >= 1 ? "right" : "left";
      const verticalMap = originalSiblingFaceMap.vertical[rotationDirection];

      moves.push(verticalMap[whitePosition === 1 ? "bottom" : "top"])
      this._movesToRestoreAffectedFaces.push(verticalMap[whitePosition === 1 ? "top" : "bottom"])
    }

    // resolve quando ta a branca ta na em cima ou baixo nas laterais e a testa ta longe do destino
    if (
      (whitePosition === 1 || whitePosition === 7) &&
      Math.abs(horizontalFaceTargetDistance) !== 1 &&
      !FACES_TO_FIRST_LAYER_IGNORE.includes(whiteFace)
    ) {
      // console.log('#2');

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
      // console.log('#THE LAST', Math.abs(horizontalFaceTargetDistance));

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
      // console.log('#3');

      moves.push(siblingRotationMap[horizontalFaceTargetDistance >= 1 ? 1 : 0]);

      if (this._movesToRestoreAffectedFaces.length) {
        moves.push(...this._movesToRestoreAffectedFaces)
        this._movesToRestoreAffectedFaces = [];
      }
    }

    // resolve quando ta a branca ta na amarela e a testa ta na face certa
    if (whiteFace === 2 && isSiblingForeheadInRightFace) {
      // console.log('#4');

      // rotate faces
      const rotationMap = (VERTICAL_FULL_ROTATIONS_MAP as any)[siblingFace];

      moves.push(...rotationMap);
    }

    // resolve quando ta a branca ta na amarela e a testa nao ta na face certa
    if (whiteFace === 2 && !isSiblingForeheadInRightFace) {
      // console.log('#5');

      const { horizontal } = FACE_MOVEMENTS_MAP[siblingFace];
      const directionMove = horizontalSiblingFaceTargetDistance >= 1 ? horizontal.top.left : horizontal.top.right;

      moves.push(...Array.from({ length: Math.abs(horizontalSiblingFaceTargetDistance) }).fill(directionMove))
    }

    // resolve quando ta a branca ta na branca e a testa nao ta na face certa
    if (whiteFace === 5 && !isSiblingForeheadInRightFace) {
      // console.log('#THE LAST LAST MESMO');

      const rotationMap = (VERTICAL_FULL_ROTATIONS_MAP as any)[siblingFace];

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

      tries++;
      isForeheadSolved = this.isPositionInRightPlace(
        ...this.getPositionCoordinatesByValue(value)
      );
    }
  }

  /**
   * Solve diddle forehead
   * @param value value of Middle forehead
   */
   private solveMiddleForehead(value: number): void {
    let tries = 0;
    let isForeheadSolved = false;

    while (!isForeheadSolved && tries <= MAX_MIDDLE_FOREHEAD_TRIES_COUNT) {
      const moves = this.moveMiddleForehead(value);

      this._moves.push(...moves);
      this.cube.moveMany(moves);

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

      tries++;
    }
  }

  private moveWhiteCorner(value: number): MOVEMENT[] {
    const valueToScan = value;
    const moves: MOVEMENT[] = [];

    // White forehead data
    const [whiteFace, whitePosition] = this.getPositionCoordinatesByValue(value);
    const originalCoordinates = this.getOriginalPositionCoordinatesByValue(value);
    const {
      left,
      right,
      top
    } = this.getCornerMapByValue(value);

    const originalCornerCoordinates = {
      top: this.getOriginalPositionCoordinatesByValue(this.cube.faces[top[0]][top[1]]),
      left: this.getOriginalPositionCoordinatesByValue(this.cube.faces[left[0]][left[1]]),
      right: this.getOriginalPositionCoordinatesByValue(this.cube.faces[right[0]][right[1]])
    }

    const cornerDistances = {
      // top:
      left: this.getHorizontalTargetFaceMoveCount(
        left[0],
        originalCornerCoordinates.left[0]
      ),
      right: this.getHorizontalTargetFaceMoveCount(
        right[0],
        originalCornerCoordinates.right[0]
      ),
    }

    const isInSide = whiteFace != 5 && whiteFace != 2;

    /////// Moves

    if (
      isInSide &&
      whitePosition === 2 &&
      cornerDistances.right != -1
    ) {
      const { horizontal } = FACE_MOVEMENTS_MAP[left[0]];
      const prevTargetFace = this.getPrevOrNextHorizontalFace(originalCornerCoordinates.top[0], true);
      const distance = this.getHorizontalTargetFaceMoveCount(left[0], prevTargetFace);

      const directionMove = distance >= 1 ? horizontal.top.left : horizontal.top.right;

      moves.push(...(Array.from({ length: Math.abs(distance) }).fill(directionMove) as MOVEMENT[]));
    }

    if (
      isInSide &&
      whitePosition === 0 &&
      cornerDistances.left != 0
    ) {
      const { horizontal } = FACE_MOVEMENTS_MAP[right[0]];
      const prevTargetFace = this.getPrevOrNextHorizontalFace(originalCornerCoordinates.top[0], true);
      const distance = this.getHorizontalTargetFaceMoveCount(right[0], prevTargetFace);

      const directionMove = distance >= 1 ? horizontal.top.left : horizontal.top.right;

      moves.push(...(Array.from({ length: Math.abs(distance) + 1 }).fill(directionMove) as MOVEMENT[]));
    }

    if (
      whiteFace === 2 &&
      cornerDistances.left != -1 &&
      cornerDistances.right != 1
    ) {
      const { horizontal } = FACE_MOVEMENTS_MAP[left[0]];
      const targetCornerPosition = this.getTargetCornerPosition(originalCoordinates[1]);
      const moveCount = this.geCornerTargetFaceMoveCount(top[1], targetCornerPosition);

      const directionMove = moveCount >= 1 ? horizontal.top.left : horizontal.top.right;

      moves.push(...(Array.from({ length: Math.abs(moveCount) }).fill(directionMove) as MOVEMENT[]))
    }

    if (whiteFace === 5) {
      const { horizontal, vertical } = FACE_MOVEMENTS_MAP[right[0]];

      moves.push(
        vertical.left.top,
        horizontal.top.left,
        vertical.left.bottom,
      );
    }

    if (
      isInSide &&
      [6, 8].includes(whitePosition)
    ) {
      const targetMoveFace = this.getPrevOrNextHorizontalFace(whiteFace, whitePosition === 6);
      const { vertical, horizontal } = FACE_MOVEMENTS_MAP[targetMoveFace];
      const verticalSide = whitePosition === 6 ? 'right' : 'left';

      moves.push(
        vertical[verticalSide].top,
        horizontal.top.left,
        vertical[verticalSide].bottom,
      )
    }

    if (
      whiteFace === 2 &&
      cornerDistances.left == -1 &&
      cornerDistances.right == 1
    ) {
      const { horizontal, vertical } = FACE_MOVEMENTS_MAP[left[0]];

      moves.push(
        vertical.right.top,
        horizontal.top.left,
        horizontal.top.left,
        vertical.right.bottom
      );
    }

    //// Finishes

    if (
      isInSide &&
      whitePosition === 2 &&
      cornerDistances.right == -1
    ) {
      const { horizontal, vertical } = FACE_MOVEMENTS_MAP[right[0]];

      moves.push(
        vertical.right.top,
        horizontal.top.right,
        vertical.right.bottom,
      );

    }

    if (
      isInSide &&
      whitePosition === 0 &&
      cornerDistances.left == 0
    ) {
      const { horizontal, vertical } = FACE_MOVEMENTS_MAP[left[0]];

      moves.push(
        vertical.right.top,
        horizontal.top.left,
        vertical.right.bottom,
      );
    }

    return moves;
  }

  private solveWhiteCorner(value: number): void {
    let tries = 0;
    let isCornerSolved = false;

    while (!isCornerSolved && tries <= MAX_WHITE_CORNER_TRIES_COUNT) {
      const moves = this.moveWhiteCorner(value);

      this._moves.push(...moves);
      this.cube.moveMany(moves);

      tries++;
      isCornerSolved = this.isPositionInRightPlace(
        ...this.getPositionCoordinatesByValue(value)
      );
    }
  }

  private setWhiteCorners(): void {
    const whiteCorners = this.getCornersByFace(5);

    let tries = 0;

    while(!this.isBottomLayerSolved && tries < MAX_WHITE_CORNERS_TRIES_COUNT) {
      whiteCorners.forEach(value => {
        const valueCoordinates = this.getPositionCoordinatesByValue(value);

        if (!this.isPositionInRightPlace(...valueCoordinates)) {
          this.solveWhiteCorner(value)
        }
      })

      tries++;
    }
  }

  private moveYellowForeheadGroups(foreheads: number[]): MOVEMENT[] {
    const moves = [];

    const foreheadsCoordinates = foreheads.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: this.getPositionCoordinatesByValue(curr)
      };
    } ,{})

    const foreheadsInRightPosition = foreheads.filter((position) => {
      const coordinates = (foreheadsCoordinates as any)[position];

      return FOREHEADS_POSITIONS.includes(coordinates[1]) && coordinates[0] === 2;
    } , 0);

    if (foreheadsInRightPosition.length === 2) {
      const foundCase = YELLOW_CROSS_CASES.find((i) => {
        const firstPosition = (foreheadsCoordinates as any)[foreheadsInRightPosition[0]][1];
        const secondPosition = (foreheadsCoordinates as any)[foreheadsInRightPosition[1]][1];

        return (
          i[0] === firstPosition &&
          i[1] === secondPosition
        ) || (
          i[0] === secondPosition &&
          i[1] === firstPosition
        )
      });

      if (foundCase) {
        this._faceToYellowCrossChange = foundCase[2];
      }
    }

    const { horizontal, vertical } = FACE_MOVEMENTS_MAP[this._faceToYellowCrossChange];
    const fullRotationMap = VERTICAL_ROTATIONS_MAP[this._faceToYellowCrossChange];

    moves.push(
      fullRotationMap[1],
      vertical.right.top,
      horizontal.top.left,
      vertical.right.bottom,
      horizontal.top.right,
      fullRotationMap[0]
    )

    return moves;
  }

  private moveYellowFace(): MOVEMENT[] {
    const faceTarget = getYellowPatternTargetFace(this.cube.faces[2]);

    if (faceTarget != undefined) {
      this._faceToYellowFaceChange = faceTarget;
    }

    const { horizontal, vertical } = FACE_MOVEMENTS_MAP[this._faceToYellowFaceChange];

    return [
      vertical.right.top,
      horizontal.top.left,
      vertical.right.bottom,
      horizontal.top.left,
      vertical.right.top,
      horizontal.top.left,
      horizontal.top.left,
      vertical.right.bottom,
    ]
  }

  private setUpperFace(): void {
    const moves = [];
    const targetFace = 0;
    const originalTargetFace = this.getOriginalPositionCoordinatesByValue(this.cube.faces[targetFace][0])[0];
    const distance = this.getHorizontalTargetFaceMoveCount(targetFace, originalTargetFace);
    const { horizontal } = FACE_MOVEMENTS_MAP[targetFace];

    const directionMove = distance >= 1 ? horizontal.top.left : horizontal.top.right;

    // console.log({
    //   test: this.cube.faces[targetFace][0],
    //   targetFace,
    //   originalTargetFace,
    //   distance,
    //   directionMove
    // });

    moves.push(...(Array.from({ length: Math.abs(distance) }).fill(directionMove) as MOVEMENT[]));

    this._moves.push(...moves);
    this.cube.moveMany(moves);
  }

  /**
   * true -> direita
   * @param face
   * @returns
   */
  private getTargetSideFromYellowForehead(face: number): boolean {
    const oppositeFace = this.getPrevOrNextHorizontalFace(
      this.getPrevOrNextHorizontalFace(face, true),
      true
    );

    const originalFaceTarget = getFaceByPosition(this.cube.faces[oppositeFace][0]);
    const positionValueTarget = this.defaultState[originalFaceTarget][1];
    const targetFace = this.getPositionCoordinatesByValue(positionValueTarget)[0];
    const distance = this.getHorizontalTargetFaceMoveCount(oppositeFace, targetFace);

    return distance > 0;
  }

  private getYellowResolvedForeheadsFaces(): number[] {
    return this.cube.faces
      .map((face, index) => ({ face, index }))
      .filter((faceData) => ![2, 5].includes(faceData.index))
      .filter((faceData) => {
        return faceData.face.slice(0, 3).every(position => getFaceByPosition(faceData.face[0]) === getFaceByPosition(position))
      }).map((faceData) => faceData.index)
  }

  private moveYellowForeheads(): MOVEMENT[] {
    const resolvedFaces = this.getYellowResolvedForeheadsFaces();

    let targetFace = resolvedFaces[0] ?? 0;
    let isRightSideTarget = true;

    if (resolvedFaces.length === 1) {
      isRightSideTarget = this.getTargetSideFromYellowForehead(resolvedFaces[0]);
    }

    const { horizontal, vertical } = FACE_MOVEMENTS_MAP[targetFace];

    const leftFirstMove = [
      vertical.left.top,
      horizontal.top.right,
      vertical.left.bottom,
      horizontal.top.left,
    ];

    const leftEndMove = [
      horizontal.top.right,
      vertical.left.top,
      horizontal.top.left,
      vertical.left.bottom,
    ];

    const rightFirstMove = [
      vertical.right.top,
      horizontal.top.left,
      vertical.right.bottom,
      horizontal.top.right,
    ];

    const rightEndMove = [
      horizontal.top.left,
      vertical.right.top,
      horizontal.top.right,
      vertical.right.bottom,
    ];

    if (isRightSideTarget) {
      return [
        ...rightFirstMove,
        ...leftFirstMove,
        ...rightEndMove,
        ...leftEndMove
      ];
    }

    return [
      ...leftFirstMove,
      ...rightFirstMove,
      ...leftEndMove,
      ...rightEndMove
    ];
  }

  private setYellowForeheads(): void {
    let tries = 0;

    while(!this.isYellowForeheadsSolved && tries < 2) {
      const moves = this.moveYellowForeheads();

      this._moves.push(...moves);
      this.cube.moveMany(moves);

      tries++;
    }
  }

  private getYellowTargetFacesWithResolvedCorners(): number[] {
    return this.cube.faces
      .map((face, index) => ({ index, face }))
      .filter((faceData) => ![2, 5].includes(faceData.index))
      .filter((faceData) => {
        return getFaceByPosition(faceData.face[0]) == getFaceByPosition(faceData.face[2])
      }).map((face) => face.index)
  }

  private static getRandomHorizontalFace(): number {
    const faces = Array
      .from({ length: 6 })
      .map((_, index) => index)
      .filter((_, index) =>
        ![2, 5].includes(index)
      );

    return faces[Math.floor(Math.random() * faces.length)]
  }

  private moveYellowCorners(): MOVEMENT[] {
    let targetFace = LayerSolver.getRandomHorizontalFace();
    const facesWithResolvedCorners = this.getYellowTargetFacesWithResolvedCorners();

    if (facesWithResolvedCorners.length === 1) {
      targetFace = this.getPrevOrNextHorizontalFace(facesWithResolvedCorners[0], false);
    }

    const { horizontal, vertical } = FACE_MOVEMENTS_MAP[targetFace];
    const fullRotationMap = VERTICAL_ROTATIONS_MAP[targetFace];

    return [
      vertical.right.top,
      horizontal.top.left,
      vertical.right.bottom,
      fullRotationMap[0],
      vertical.right.top,
      horizontal.top.left,
      vertical.right.bottom,
      horizontal.top.right,
      vertical.right.bottom,
      fullRotationMap[1],
      vertical.right.bottom,
      vertical.right.bottom,
      horizontal.top.right,
      vertical.right.bottom,
    ];
  }

  private setYellowCorners(): void {
    let tries = 0;

    while(!this.isYellowCornersSolved && tries < 2) {
      const moves = this.moveYellowCorners();

      this._moves.push(...moves);
      this.cube.moveMany(moves);

      tries++;
    }
  }

  private setYellowFace(): void {
    let tries = 0;

    while(!this.isYellowFaceSolved && tries < 10) {
      const moves = this.moveYellowFace();

      this._moves.push(...moves);
      this.cube.moveMany(moves);

      tries++;
    }
  }

  private setYellowCross(): void {
    const yellowForeheadValues = this.getForeheadsByFace(2);

    let tries = 0;

    while(!this.isYellowCrossSolved && tries < MAX_YELLOW_CROSS_TRIES_COUNT) {
      const moves = this.moveYellowForeheadGroups(yellowForeheadValues);

      this._moves.push(...moves);
      this.cube.moveMany(moves);

      tries++;
    }

    this._faceToYellowCrossChange = 4;
  }

  private solveFirstLayer(): void {
    this.setWhiteCross();
    this.setWhiteCorners();
  }

  private solveSecondLayer(): void {
    const middleForeheadValues = this.getMiddleForeheads();

    let tries = 0;

    while(!this.isMiddleLayerSolved && tries < MAX_MIDDLE_FOREHEAD_TRIES_COUNT) {
      middleForeheadValues.forEach(value => {
        const valueCoordinates = this.getPositionCoordinatesByValue(value);

        if (!this.isPositionInRightPlace(...valueCoordinates)) {
          this.solveMiddleForehead(value)
        }
      })

      tries++;
    }
  }

  private solveThirdLayer(): void {
    this.setYellowCross();
    this.setYellowFace();
    this.setYellowCorners();
    this.setYellowForeheads();
    this.setUpperFace();
  }

  public async getSolve(): Promise<MOVEMENT[]> {
    // if (this.originalCube.isSolved) {
    //   throw new Error("Cube already solved");
    // }

    this.solveFirstLayer();
    this.solveSecondLayer();
    this.solveThirdLayer();

    return new Promise((resolve) => resolve(this._moves));
  }

  public async solve(): Promise<void> {
    const moves = await this.getSolve();

    this.originalCube.moveMany(moves);
  }
}