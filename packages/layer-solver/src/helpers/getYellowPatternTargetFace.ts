import { YELLOW_FACE_PATTERNS } from "../modules/constants";
import { getFaceByPosition } from "./getFaceByPosition";

function getPatternFace(faceMap: number[], map: any): { positions: number[], face: number } {
  return map.find((map: any) => {
    return faceMap.every((position, index) => {
      const currentFace = getFaceByPosition(position);

      if (map.positions.includes(index)) {
        return currentFace !== 2
      }

      return currentFace === 2
    })
  })
}

export function getYellowPatternTargetFace(faceMap: number[]): number | undefined {
  const fishPattern = getPatternFace(faceMap, YELLOW_FACE_PATTERNS.fish);
  const twoCornersPattern = getPatternFace(faceMap, YELLOW_FACE_PATTERNS.twoCorners);

  return [
    fishPattern?.face,
    twoCornersPattern?.face
  ].find((face) => face != undefined)
}