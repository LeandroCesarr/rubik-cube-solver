import { describe, expect, it } from 'vitest';
import { Cube } from 'cube';
import { LayerSolver } from '../src/index';
import { defaultState } from './data/cube/defaultState';

export const testState = [
  [
    10, 11, 12, 4, 5,
     6,  7,  8, 9
  ],
  [
    37, 38, 39, 13, 14,
    15, 16, 17, 18
  ],
  [
    25, 22, 19, 26, 23,
    20, 27, 24, 21
  ],
  [
     1,  2,  3, 31, 32,
    33, 34, 35, 36
  ],
  [
    28, 29, 30, 40, 41,
    42, 43, 44, 45
  ],
  [
    46, 47, 48, 49, 50,
    51, 52, 53, 54
  ]
];

const makeSUT = (shuffle: boolean = true, positions?: Array<number[]>) => {
  const cube = new Cube(positions);

  if (shuffle) {
    cube.shuffle();
  }

  const solver = new LayerSolver(cube);

  return {
    cube,
    solver,
  };
};

describe('LayerSolver', () => {
  it('Should have made the white cross', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(cube.faces[5][1]).toBe(defaultState[5][1]);
    expect(cube.faces[5][3]).toBe(defaultState[5][3]);
    expect(cube.faces[5][5]).toBe(defaultState[5][5]);
    expect(cube.faces[5][7]).toBe(defaultState[5][7]);
  });

  it('Should have made first layer', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isBottomLayerSolved).toBeTruthy();
  });

  it('Should have made second layer', async () => {
    // Arrange
    const { solver } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isMiddleLayerSolved).toBeTruthy();
  });

  it('Should have made yellow cross', async () => {
    // Arrange
    const { solver } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowCrossSolved).toBeTruthy();
  });

  it('Should have made yellow face', async () => {
    // Arrange
    const { solver } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowFaceSolved).toBeTruthy();
  });

  it('Should have made yellow corners', async () => {
    // Arrange
    const { solver } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowCornersSolved).toBeTruthy();
  });

  it('Should have made yellow foreheads', async () => {
    // Arrange
    const { solver } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowForeheadsSolved).toBeTruthy();
  });

  it('Should returns how to solve cube', async () => {
    // Arrange
    const { solver, cube } = makeSUT(false, testState);

    // Act
    expect(cube.faces).toStrictEqual(testState);

    const solve = await solver.getSolve();

    cube.moveMany(solve);

    // Assert
    expect(cube.isSolved).toBeTruthy();
  });

  it('Should solved cube', async () => {
    // Arrange
    const { solver, cube } = makeSUT(false, testState);
    // const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(cube.isSolved).toBeTruthy();
  });
});
