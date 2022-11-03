import { Cube } from '@/lib/Cube';
import { LayerSolver } from '@/lib/LayerSolver';
import { describe, expect, it } from 'vitest';
import { defaultState } from './data/cube/defaultState';

const state = [
  [12, 42, 45, 24, 5, 4, 52, 40, 43],
  [48, 17, 30, 33, 14, 47, 46, 11, 36],
  [34, 31, 37, 49, 23, 6, 21, 20, 39],
  [27, 13, 25, 35, 32, 29, 10, 26, 16],
  [1, 2, 28, 44, 41, 51, 7, 8, 19],
  [54, 53, 3, 22, 50, 38, 18, 15, 9],
];

const makeSUT = () => {
  const cube = new Cube();

  cube.shuffle();

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

  it('Should have solved first layer', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isBottomLayerSolved).toBeTruthy();
  });

  it('Should returns how to solve cube', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    expect(cube.faces).toStrictEqual(state);

    const solve = await solver.getSolve();

    cube.moveMany(solve);

    console.log({ solve });

    // Assert
    expect(cube.isSolved).toBeTruthy();
  });

  it('Should solved cube', () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    solver.solve();

    // Assert
    expect(cube.isSolved).toBeTruthy();
  });
});
