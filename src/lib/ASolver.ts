import { Cube } from "@/lib/Cube";

export abstract class ASolver {
  abstract solve(cube: Cube): void;
}
