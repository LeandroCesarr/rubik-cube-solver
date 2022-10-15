import { describe, expect, it } from 'vitest'
import { COLORS } from '../src/lib/constants'
import { Cube } from '../src/lib/Cube'
import { movements } from './data/cube/movements'

const makeSTU = () => ({
  cube: new Cube()
})

describe.each(Object.entries(movements))('Cube', (_, { moves, state }) => {
  it(`Face movement: ${moves.join(", ")}`, () => {
    const { cube } = makeSTU();

    moves.forEach((move) => cube.move(move));

    expect(cube.faces).toHaveLength(6)

    cube.faces.forEach((face, idx) => {
      expect(face).toHaveLength(9)
      expect(face, `Face ${COLORS[idx]} - #${idx}`).toStrictEqual(state[idx])
    })
  })
})
