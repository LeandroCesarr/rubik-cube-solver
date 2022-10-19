import { Cube } from "@/lib/Cube";
import { LayerSolver } from "@/lib/LayerSolver";
import { describe, expect, it } from "vitest";

const state = [
  [36, 11, 27, 42, 5, 13, 30, 35, 37],
  [39, 20, 43, 6, 14, 40, 12, 49, 10],
  [28, 22, 54, 2, 23, 26, 46, 47, 45],
  [34, 38, 7, 24, 32, 31, 52, 8, 1],
  [18, 44, 48, 15, 41, 29, 3, 4, 16],
  [19, 33, 9, 17, 50, 53, 25, 51, 21],
];

const makeSUT = () => {
  const cube = new Cube(state);
  const solver = new LayerSolver(cube);

  return {
    cube,
    solver
  }
}

describe("LayerSolver", () => {
  it("Should solve cube", () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    solver.solve();

    // Assert
    expect(cube.isSolved).toBeTruthy();
  })
})