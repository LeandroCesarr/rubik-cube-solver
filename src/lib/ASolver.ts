import { Cube } from "@/lib/Cube";

export abstract class ASolver {
  constructor(private readonly cube: Cube) {}

  abstract solve(): void;
}
