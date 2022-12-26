import { Cube } from '@/lib/Cube';
import { LayerSolver } from '@/lib/LayerSolver';
import { bench, describe, expect } from 'vitest';
import { defaultState } from './data/cube/defaultState';

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
  bench('White cross solution', async () => {

    const { solver, cube } = makeSUT();

    await solver.solve();

    expect(cube.faces[5][1]).toBe(defaultState[5][1]);
    expect(cube.faces[5][3]).toBe(defaultState[5][3]);
    expect(cube.faces[5][5]).toBe(defaultState[5][5]);
    expect(cube.faces[5][7]).toBe(defaultState[5][7]);

  }, { iterations: 1000 });

  bench('First layer solution', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isBottomLayerSolved).toBeTruthy();
  }, { iterations: 1000 });

  bench('Second layer solution', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isMiddleLayerSolved).toBeTruthy();
  }, { iterations: 1000 });

  bench('Yellow cross solution', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowCrossSolved).toBeTruthy();
  }, { iterations: 1000 });

  bench('Yellow face solution', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowFaceSolved).toBeTruthy();
  }, { iterations: 1000 });

  bench('Yellow corners solution', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowCornersSolved).toBeTruthy();
  }, { iterations: 1000 });

  bench('Yellow foreheads solution', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isYellowForeheadsSolved).toBeTruthy();
  }, { iterations: 1000 });

  bench('Cube solution', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(cube.isSolved).toBeTruthy();
  }, { iterations: 1000 });
});
