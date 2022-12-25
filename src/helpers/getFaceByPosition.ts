export function getFaceByPosition(number: number): number {
  return Math.ceil(number / 9) - 1;
}