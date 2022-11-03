import { Cube } from '@/lib/Cube';
import { LayerSolver } from '@/lib/LayerSolver';
import { bench, describe } from 'vitest';

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

    const { solver } = makeSUT();

    await solver.solve();

  }, { iterations: 500 });
});
