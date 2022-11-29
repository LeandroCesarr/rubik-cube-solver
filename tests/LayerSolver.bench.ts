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

  bench('First layer soluton', async () => {
    // Arrange
    const { solver, cube } = makeSUT();

    // Act
    await solver.solve();

    // Assert
    expect(solver.isBottomLayerSolved).toBeTruthy();
  }, { iterations: 1000 });
});
