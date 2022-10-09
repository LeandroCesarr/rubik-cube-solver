import { Cube } from "./Cube";

export abstract class ASolver {
  abstract solve(cube: Cube): void;
}
